import { logger } from "src/logger"
import { SeasonRepository } from "./season_repository"
import { CarRepository } from "data/cars/car_repository"
import { TrackRepository } from "data/tracks/track_repository"
import { LicenseRepository } from "data/license/license_repository"
import { Series } from "data/series"
import { Schedule } from "data/schedule"
import { Season } from "models/season"
import { UserRepository } from "data/user/user_repository"
import { formatCategory } from "data/category"
import { License } from "data/license"
import { Car } from "data/car"
import { Track } from "data/track"
import { promises as fs } from "fs"
import path from "path"

export class SeasonController {
  static DOWNLOAD_PATH = `downloaded`
  static SEASON_FILE = `${SeasonController.DOWNLOAD_PATH}/file-season.json`

  constructor(
    private seasonRepository: SeasonRepository,
    private userRepository: UserRepository,
    private carRepository: CarRepository,
    private trackRepository: TrackRepository,
    private licenseRepository: LicenseRepository,
  ) {}

  sortLicenses(licenses: License[]): License[] {
    return licenses.sort((a, b) => a.id - b.id)
  }

  removeDuplicates<T>(array: T[], comparison: (a: T, b: T) => boolean) {
    return array.filter((value, index, a) => {
      return (
        a.findIndex((value2) => {
          return comparison(value, value2)
        }) === index
      )
    })
  }

  async invalidateCache(): Promise<void> {
    return await fs.rm(SeasonController.DOWNLOAD_PATH, { recursive: true, force: true })
  }

  async getRawSeason(): Promise<string> {
    return await this.readFile(SeasonController.SEASON_FILE)
  }

  async getSeason(): Promise<Season> {
    const cache = await this.getCachedSeason()
    if (cache?.validate()) {
      logger.debug(`Using cache ${cache?.cachedDate}`)
      return cache
    } else {
      logger.debug("Downloading season")
      return await this.downloadSeason()
    }
  }

  private async getCachedSeason(): Promise<Season | null> {
    try {
      const file = await this.readFile(SeasonController.SEASON_FILE)
      const content = JSON.parse(file) as Season
      content.cachedDate = new Date(content.cachedDate)
      content.series.forEach((s) => {
        s.schedules.forEach((sc) => {
          sc.startDate = new Date(sc.startDate)
        })
      })
      return Object.assign(new Season(), content)
    } catch (error) {
      logger.warn(`File not loaded: ${error}`)
      return null
    }
  }

  private async readFile(file: string): Promise<string> {
    logger.info(`Reading file ${path.resolve(file)}`)
    return await fs.readFile(path.resolve(file), { encoding: "utf8" })
  }

  async downloadSeason(): Promise<Season> {
    const season = await this.buildSeason()
    if (!(await this.checkPathExists(SeasonController.DOWNLOAD_PATH))) {
      await this.createFolder(SeasonController.DOWNLOAD_PATH)
    }
    await this.storeFile(SeasonController.SEASON_FILE, JSON.stringify(season, null, 2))
    return season
  }

  private async buildSeason(): Promise<Season> {
    await this.userRepository.login()
    const cars = await this.carRepository.getCars()
    const tracks = await this.trackRepository.getTracks()
    const licenses = await this.licenseRepository.getLicenses()

    const season = (await this.seasonRepository.getSeasons())
      .filter((series) => series.active)
      .flatMap((series): Series => {
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
          schedules: series.schedules.map((schedule): Schedule => {
            const carsOfSchedule = []
            if (schedule.race_week_cars.length > 0) {
              carsOfSchedule.push(
                ...schedule.race_week_cars.flatMap((weekCar) => cars.filter((car) => car.id === weekCar.car_id)),
              )
            } else {
              carsOfSchedule.push(
                ...schedule.car_restrictions.flatMap((restriction) =>
                  cars.filter((car) => car.id === restriction.car_id),
                ),
              )
            }
            if (carsOfSchedule.length === 0) {
              carsOfSchedule.push(
                ...(series.car_class_ids?.flatMap((id) =>
                  cars.filter((car) => car.classes.find((cls) => cls.id === id)),
                ) ?? []),
              )
            }
            const track = tracks.find((track) => track.configs.find((config) => config.id === schedule.track.track_id))
            if (!track) {
              throw new Error(`Couldn't find the track with ID ${schedule.track.track_id} inside of tracks list`)
            }
            return {
              raceWeekNum: schedule.race_week_num,
              cars: carsOfSchedule,
              category: formatCategory(schedule.category),
              categoryId: schedule.category_id,
              startDate: new Date(schedule.start_date),
              name: schedule.schedule_name,
              serieId: series.season_id,
              track: {
                ...track,
                configName: schedule.track.config_name,
              },
            }
          }),
        }
      })
      .sort((a, b) => {
        const licenseSorted = this.sortLicenses(a.licenses)[0].id - this.sortLicenses(b.licenses)[0].id
        if (licenseSorted !== 0) {
          return licenseSorted
        } else {
          return a.name.localeCompare(b.name)
        }
      })

    const categories = this.removeDuplicates(
      season.flatMap((season) => season.schedules),
      (value, value2) => value.category === value2.category,
    ).map((value) => ({
      id: value.categoryId,
      name: formatCategory(value.category),
    }))

    const seasonCars = season.reduce((acc, series) => {
      series.schedules.forEach((schedule) => {
        schedule.cars.forEach((car) => {
          if (acc[car.id]) {
            if (!acc[car.id].seriesIds.includes(series.id)) {
              acc[car.id].numberOfSeries += 1
              acc[car.id].seriesIds.push(series.id)
            }
            acc[car.id].numberOfRaces += 1
            acc[car.id].licenses = this.sortLicenses(
              this.removeDuplicates([...acc[car.id].licenses, ...series.licenses], (a, b) => a.id === b.id),
            )
            acc[car.id].categories = this.removeDuplicates(
              [...acc[car.id].categories, { id: schedule.categoryId, name: schedule.category }],
              (a, b) => a.id === b.id,
            )
          } else {
            acc[car.id] = {
              ...car,
              categories: [{ id: schedule.categoryId, name: schedule.category }],
              licenses: this.sortLicenses(series.licenses),
              numberOfRaces: 1,
              numberOfSeries: 1,
              seriesIds: [series.id],
            }
          }
        })
      })
      return acc
    }, {} as Record<number, Car>)

    const seasonTracks = season.reduce((acc, series) => {
      series.schedules.forEach((schedule) => {
        const track = schedule.track
        if (acc[track.id]) {
          if (!acc[track.id].seriesIds.includes(series.id)) {
            acc[track.id].numberOfSeries += 1
            acc[track.id].seriesIds.push(series.id)
          }
          acc[track.id].numberOfRaces += 1
          acc[track.id].licenses = this.sortLicenses(
            this.removeDuplicates([...acc[track.id].licenses, ...series.licenses], (a, b) => a.id === b.id),
          )
          acc[track.id].categories = this.removeDuplicates(
            [...acc[track.id].categories, { id: schedule.categoryId, name: schedule.category }],
            (a, b) => a.id === b.id,
          )
        } else {
          acc[track.id] = {
            ...track,
            categories: [{ id: schedule.categoryId, name: schedule.category }],
            licenses: this.sortLicenses(series.licenses),
            numberOfRaces: 1,
            numberOfSeries: 1,
            seriesIds: [series.id],
          }
        }
      })
      return acc
    }, {} as Record<number, Track>)

    return Object.assign(new Season(), {
      cachedDate: new Date(),
      cars: Object.values(seasonCars).sort((a, b) => a.licenses[0].id - b.licenses[0].id),
      tracks: Object.values(seasonTracks).sort((a, b) => a.licenses[0].id - b.licenses[0].id),
      licenses,
      categories,
      series: season.map((series) => {
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
  }

  private async storeFile(file: string, content: string): Promise<void> {
    logger.debug(`File will be stored in ${path.resolve(file)}`)
    return await fs.writeFile(path.resolve(file), content)
  }

  private async checkPathExists(file: string): Promise<boolean> {
    logger.info(`Check if ${path.resolve(file)} exist`)
    try {
      await fs.lstat(path.resolve(file))
      return true
    } catch {
      return false
    }
  }

  private async createFolder(folder: string): Promise<void> {
    logger.info(`Creating folder ${path.resolve(folder)}`)
    return await fs.mkdir(path.resolve(folder))
  }
}
