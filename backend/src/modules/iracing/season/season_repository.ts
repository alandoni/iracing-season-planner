import { CarRepository } from "../cars/car_repository"
import { LicenseRepository } from "../license/license_repository"
import { TrackRepository } from "../tracks/track_repository"
import { SeriesService } from "./series_service"
import { Series } from "data/iracing/season/models/series"
import { WinstonLogger } from "backend/logger/index"
import { DI } from "utils"
import { Schedule } from "data/iracing/season/models/schedule"
import { Category } from "data/iracing/season/models/category"
import { License } from "data/iracing/season/models/license"
import { SeriesResponse } from "./series_response"
import { Car } from "data/iracing/season/models/car"
import { Track } from "data/iracing/season/models/track"
import { IrSchedule } from "./ir_schedule"
import { Season } from "data/iracing/season/models/season"

export class SeasonRepository {
  constructor(
    private seriesService: SeriesService,
    private trackRepository: TrackRepository,
    private carRepository: CarRepository,
    private licenseRepository: LicenseRepository,
    private logger = DI.get(WinstonLogger),
  ) {}

  async getSeason(): Promise<Season> {
    try {
      const cars = await this.carRepository.getCars()
      const tracks = await this.trackRepository.getTracks()
      const licenses = await this.licenseRepository.getLicenses()
      const seriesResponse = await this.seriesService.getSeries()

      const series = seriesResponse
        .filter((series) => series.active)
        .flatMap((series) => this.fromSeriesReponseToSeries(series, licenses, cars, tracks))
        .sort((a, b) => {
          const licenseSorted = this.sortLicenses(a.licenses)[0].id - this.sortLicenses(b.licenses)[0].id
          if (licenseSorted !== 0) {
            return licenseSorted
          } else {
            return a.name.localeCompare(b.name)
          }
        })

      const seasonCars = this.getCarsOfTheSeason(series)
      const seasonTracks = this.getTracksOfTheSeason(series)

      return Object.assign(new Season(), {
        cachedDate: new Date(),
        cars: this.sortByLicense(Object.values(seasonCars)),
        tracks: this.sortByLicense(Object.values(seasonTracks)),
        licenses: this.sortLicenses(licenses),
        categories: this.getCategoriesOfTheSeason(series),
        quarter: seriesResponse[0].season_quarter,
        year: seriesResponse[0].season_year,
        series: series.map((series) => {
          return {
            ...series,
            schedules: series.schedules.map((s) => {
              const track = seasonTracks[s.track.id]
              return {
                ...s,
                track: {
                  ...track,
                  configName: s.track.configName,
                },
                cars: s.cars.map((car) => seasonCars[car.id]),
              }
            }),
          }
        }),
      })
    } catch (error) {
      this.logger.error(error)
      throw error
    }
  }

  private fromSeriesReponseToSeries(series: SeriesResponse, licenses: License[], cars: Car[], tracks: Track[]): Series {
    return {
      id: series.season_id,
      name: series.season_name,
      licenses: series.license_group_types.map((licenseGroup) => {
        const license = licenses.find((license) => license.id === licenseGroup.license_group_type)
        if (!license) {
          throw new Error(`License with ID ${licenseGroup.license_group_type} is not found in licenses array`)
        }
        return license
      }),
      droppedWeeks: series.drops,
      fixedSetup: series.fixed_setup,
      maxWeeks: series.max_weeks,
      multiclass: series.multiclass,
      official: series.official,
      schedules: series.schedules.map((schedule) =>
        this.fromScheduleResponseToSchedule(schedule, series, cars, tracks),
      ),
    }
  }

  private fromScheduleResponseToSchedule(
    schedule: IrSchedule,
    series: SeriesResponse,
    cars: Car[],
    tracks: Track[],
  ): Schedule {
    const track = tracks.find((track) => track.configs.find((config) => config.id === schedule.track.track_id))
    if (!track) {
      throw new Error(`Couldn't find the track with ID ${schedule.track.track_id} inside of tracks list`)
    }
    return {
      raceWeekNum: schedule.race_week_num,
      cars: this.getScheduleCars(schedule, series, cars),
      category: new Category(schedule.category_id, schedule.category),
      startDate: new Date(schedule.start_date),
      name: schedule.schedule_name,
      serieId: series.season_id,
      track: {
        ...track,
        configName: schedule.track.config_name,
      },
    }
  }

  private getScheduleCars(schedule: IrSchedule, series: SeriesResponse, cars: Car[]) {
    const carsOfSchedule = []
    if (schedule.race_week_cars.length > 0) {
      carsOfSchedule.push(
        ...schedule.race_week_cars.flatMap((weekCar) => cars.filter((car) => car.id === weekCar.car_id)),
      )
    } else {
      carsOfSchedule.push(
        ...schedule.car_restrictions.flatMap((restriction) => cars.filter((car) => car.id === restriction.car_id)),
      )
    }
    if (carsOfSchedule.length === 0) {
      carsOfSchedule.push(
        ...(series.car_class_ids?.flatMap((id) => cars.filter((car) => car.classes.find((cls) => cls.id === id))) ??
          []),
      )
    }
    return carsOfSchedule
  }

  private sortByLicense<T extends { licenses: License[] }>(arrayOfObjectsContainingLicense: T[]): T[] {
    return arrayOfObjectsContainingLicense.sort((a, b) => a.licenses[0].id - b.licenses[0].id)
  }

  private sortLicenses(licenses: License[]): License[] {
    return licenses.sort((a, b) => a.id - b.id)
  }

  private getCarsOfTheSeason(series: Series[]) {
    return series.reduce((acc, series) => {
      series.schedules.forEach((schedule) => {
        schedule.cars.forEach((car) => {
          if (acc[car.id]) {
            if (!acc[car.id].seriesIds.includes(series.id)) {
              acc[car.id].numberOfSeries += 1
              acc[car.id].seriesIds.push(series.id)
            }
            acc[car.id].numberOfRaces += 1
            acc[car.id].licenses = [...acc[car.id].licenses, ...series.licenses].removeDuplicates(
              (a, b) => a.id === b.id,
            )
            acc[car.id].categories = [...acc[car.id].categories, schedule.category].removeDuplicates(
              (a, b) => a.id === b.id,
            )
          } else {
            acc[car.id] = {
              ...car,
              categories: [schedule.category],
              licenses: series.licenses,
              numberOfRaces: 1,
              numberOfSeries: 1,
              seriesIds: [series.id],
            }
          }
          acc[car.id].licenses = this.sortLicenses(acc[car.id].licenses)
        })
      })
      return acc
    }, {} as Record<number, Car>)
  }

  private getTracksOfTheSeason(series: Series[]) {
    return series.reduce((acc, series) => {
      series.schedules.forEach((schedule) => {
        const track = schedule.track
        if (acc[track.id]) {
          if (!acc[track.id].seriesIds.includes(series.id)) {
            acc[track.id].numberOfSeries += 1
            acc[track.id].seriesIds.push(series.id)
          }
          acc[track.id].numberOfRaces += 1
          acc[track.id].licenses = [...acc[track.id].licenses, ...series.licenses].removeDuplicates(
            (a, b) => a.id === b.id,
          )
          acc[track.id].categories = [...acc[track.id].categories, schedule.category].removeDuplicates(
            (a, b) => a.id === b.id,
          )
        } else {
          acc[track.id] = {
            ...track,
            categories: [schedule.category],
            licenses: series.licenses,
            numberOfRaces: 1,
            numberOfSeries: 1,
            seriesIds: [series.id],
          }
        }
        acc[track.id].licenses = this.sortLicenses(acc[track.id].licenses)
      })
      return acc
    }, {} as Record<number, Track>)
  }

  private getCategoriesOfTheSeason(series: Series[]) {
    return series
      .flatMap((series) => series.schedules)
      .removeDuplicates((value, value2) => value.category === value2.category)
      .map((value) => value.category)
  }
}
