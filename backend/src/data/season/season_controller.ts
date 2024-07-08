import { logger } from "src/logger"
import { Season } from "./season"
import { SeasonRepository } from "./season_repository"
import { CarRepository } from "data/cars/car_repository"
import { TrackRepository } from "data/tracks/track_repository"
import { LicenseRepository } from "data/license/license_repository"
import { Series } from "./series"
import { Schedule } from "./schedule"
import { UserRepository } from "data/user/user_repository"
import fs from "fs"

export class SeasonController {
  static SEASON_FILE = `downloaded/file-season.json`
  static MAX_DAYS_TO_VALIDATE_CACHE = 14

  constructor(
    private seasonRepository: SeasonRepository,
    private userRepository: UserRepository,
    private carRepository: CarRepository,
    private trackRepository: TrackRepository,
    private licenseRepository: LicenseRepository,
  ) {}

  async getSeason(): Promise<Season> {
    const cache = await this.getCachedSeason()
    if (this.validateCache(cache)) {
      return cache
    } else {
      return await this.downloadSeason()
    }
  }

  private validateCache(cache: Season | null): boolean {
    const lastValidDate = new Date().setDate(new Date().getDate() - SeasonController.MAX_DAYS_TO_VALIDATE_CACHE)
    return cache?.cachedDate?.getDate() < lastValidDate
  }

  private async getCachedSeason(): Promise<Season | null> {
    try {
      const file = await this.readFile(SeasonController.SEASON_FILE)
      const content = JSON.parse(file) as Season
      content.cachedDate = new Date(content.cachedDate)
      return content
    } catch (error) {
      logger.warn(`File not loaded: ${error}`)
      return null
    }
  }

  private readFile(file: string): Promise<string> {
    return new Promise((resolve, reject) => {
      fs.readFile(file, { encoding: "utf8" }, (error, data) => {
        if (error) {
          reject(error)
        } else {
          resolve(data)
        }
      })
    })
  }

  async downloadSeason(): Promise<Season> {
    const season = await this.buildSeason()
    await this.storeFile(SeasonController.SEASON_FILE, JSON.stringify(season))
    return season
  }

  private formatCategory(value: string) {
    return value
      .split("_")
      .map((word) => word.substring(0, 1).toUpperCase() + word.substring(1).toLowerCase())
      .join(" ")
  }

  private async buildSeason(): Promise<Season> {
    await this.userRepository.login()
    const cars = await this.carRepository.getCars()
    const tracks = await this.trackRepository.getTracks()
    const licenses = await this.licenseRepository.getLicenses()
    const seasons = (await this.seasonRepository.getSeasons())
      .filter((season) => season.active)
      .map(
        (season): Series => ({
          id: season.season_id,
          name: season.season_name,
          licenses: season.license_group_types.map((licenseGroup) =>
            licenses.find((license) => license.id === licenseGroup.license_group_type),
          ),
          fixedSetup: season.fixed_setup,
          maxWeeks: season.max_weeks,
          multiclass: season.multiclass,
          official: season.official,
          schedules: season.schedules.map((schedule): Schedule => {
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
                ...(season.car_class_ids?.flatMap((id) =>
                  cars.filter((car) => car.classes.find((cls) => cls.id === id)),
                ) ?? []),
              )
            }
            return {
              raceWeekNum: schedule.race_week_num,
              cars: carsOfSchedule,
              category: this.formatCategory(schedule.category),
              categoryId: schedule.category_id,
              name: schedule.schedule_name,
              serieId: schedule.series_id,
              track: {
                ...tracks.find((track) => track.configs.find((config) => config.id === schedule.track.track_id)),
                configName: schedule.track.config_name,
              },
            }
          }),
        }),
      )
    const categories = seasons
      .flatMap((car) => car.schedules)
      .filter((value, index, array) => {
        return (
          array.findIndex((value2) => {
            return value.category === value2.category
          }) === index
        )
      })
      .map((value) => ({
        id: value.categoryId,
        name: this.formatCategory(value.category),
      }))
    return {
      cachedDate: new Date(),
      cars,
      tracks,
      licenses,
      categories,
      series: seasons,
    }
  }

  private storeFile(file: string, content: string): Promise<void> {
    return new Promise((resolve, reject) => {
      fs.writeFile(file, content, (error) => {
        if (error) {
          reject(error)
        } else {
          resolve()
        }
      })
    })
  }
}
