import { CarRepository } from "../cars/car_repository"
import { LicenseRepository } from "../license/license_repository"
import { TrackRepository } from "../tracks/track_repository"
import { SeriesService } from "./series_service"
import { WinstonLogger } from "@alandoni/backend/logger/index"
import { Series } from "racing-tools-data/iracing/season/models/series"
import { Schedule } from "racing-tools-data/iracing/season/models/schedule"
import { Category } from "racing-tools-data/iracing/season/models/category"
import { License } from "racing-tools-data/iracing/season/models/license"
import { Car } from "racing-tools-data/iracing/season/models/car"
import { Track } from "racing-tools-data/iracing/season/models/track"
import { Season } from "racing-tools-data/iracing/season/models/season"
import { SeriesResponse } from "./series_response"
import { IrSchedule } from "./ir_schedule"
import { DI, assertNotNull, plainToInstance } from "@alandoni/utils"

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
        .flatMap((series) => this.fromSeriesResponseToSeries(series, licenses, cars, tracks))
        .sort((a, b) => {
          const licenseSorted = this.sortLicenses(a.licenses)[0].id - this.sortLicenses(b.licenses)[0].id
          if (licenseSorted !== 0) {
            return licenseSorted
          } else {
            return a.name.localeCompare(b.name)
          }
        })

      const seasonCars = this.getCarsOfTheSeason(series, cars)
      const seasonTracks = this.getTracksOfTheSeason(series, tracks)

      return plainToInstance(Season, {
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
                  id: track.id,
                  configName: s.track.configName,
                },
                cars: s.cars.map((car) => seasonCars[car]).map((car) => car.id),
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

  private fromSeriesResponseToSeries(
    series: SeriesResponse,
    licenses: License[],
    cars: Car[],
    tracks: Track[],
  ): Series {
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
      calculateMinimumParticipation: () => 1,
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
      cars: this.getScheduleCars(schedule, series, cars).map((car) => car.id),
      category: new Category(schedule.category_id, schedule.category),
      startDate: new Date(schedule.start_date),
      name: schedule.schedule_name,
      serieId: series.season_id,
      track: { id: track.id, configName: schedule.track.config_name },
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

  private getCarsOfTheSeason(series: Series[], cars: Car[]) {
    return series.reduce((acc, series) => {
      series.schedules.forEach((schedule) => {
        schedule.cars.forEach((carId) => {
          const car = cars.find((c) => c.id === carId)
          assertNotNull(car)
          if (acc[carId]) {
            if (!acc[carId].seriesIds.includes(series.id)) {
              acc[carId].numberOfSeries += 1
              acc[carId].seriesIds.push(series.id)
            }
            acc[carId].numberOfRaces += 1
            acc[carId].licenses = [...acc[carId].licenses, ...series.licenses].removeDuplicates((a, b) => a.id === b.id)
            acc[carId].categories = [...acc[carId].categories, schedule.category].removeDuplicates(
              (a, b) => a.id === b.id,
            )
          } else {
            acc[carId] = {
              ...car,
              categories: [schedule.category],
              licenses: series.licenses,
              numberOfRaces: 1,
              numberOfSeries: 1,
              seriesIds: [series.id],
            }
          }
          acc[carId].licenses = this.sortLicenses(acc[carId].licenses)
        })
      })
      return acc
    }, {} as Record<number, Car>)
  }

  private getTracksOfTheSeason(series: Series[], tracks: Track[]) {
    return series.reduce((acc, series) => {
      series.schedules.forEach((schedule) => {
        const track = tracks.find((t) => t.id === schedule.track.id)
        assertNotNull(track)
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
      .removeDuplicates((value, value2) => value.category.id === value2.category.id)
      .map((value) => value.category)
  }
}
