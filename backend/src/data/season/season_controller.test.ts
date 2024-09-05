import fs from "fs"
import { getSeasonController } from "src/dependency-injection"
import { SeasonController } from "./season_controller"
import { logger } from "src/logger"
import { Season } from "data/season"

fdescribe("SeasonController", () => {
  it("0 - should store the season in the cache", async () => {
    try {
      fs.readFileSync(SeasonController.SEASON_FILE, { encoding: "utf8" })
      fs.rmSync(SeasonController.SEASON_FILE)
    } catch {
      logger.debug("File didn't exist")
    }
    const season = await getSeasonController().getSeason()
    const newFile = fs.readFileSync(SeasonController.SEASON_FILE, { encoding: "utf8" })
    expect(JSON.stringify(season)).toStrictEqual(newFile)
  }, 30000)

  it("1 - should get the cached file", async () => {
    const file = fs.readFileSync(SeasonController.SEASON_FILE, { encoding: "utf8" })
    expect(file).not.toBeUndefined()
    expect(file).not.toBeNull()
    const controller = getSeasonController()
    const spy = jest.spyOn(controller, "downloadSeason")
    const season = await controller.getSeason()
    expect(spy).not.toHaveBeenCalled()
    const newFile = fs.readFileSync(SeasonController.SEASON_FILE, { encoding: "utf8" })
    expect(JSON.stringify(season)).toStrictEqual(newFile)
  }, 30000)

  describe("Cache validation", () => {
    it("should validate the cache", () => {
      jest.useFakeTimers().setSystemTime(new Date("2024-01-17 02:59"))
      const season: Season = {
        cachedDate: new Date("2024-01-10 03:00"),
        cars: [],
        tracks: [],
        licenses: [],
        categories: [],
        series: [
          {
            schedules: [
              {
                startDate: new Date("2024-01-11 03:00"),
                raceWeekNum: 0,
                cars: [],
                category: "",
                categoryId: 0,
                name: "",
                serieId: 0,
                track: undefined,
              },
              {
                startDate: new Date("2024-01-01 03:00"),
                raceWeekNum: 0,
                cars: [],
                category: "",
                categoryId: 0,
                name: "",
                serieId: 0,
                track: undefined,
              },
            ],
            id: 0,
            name: "",
            licenses: [],
            fixedSetup: false,
            maxWeeks: 0,
            multiclass: false,
            official: false,
          },
        ],
      }
      expect(getSeasonController().validateCache(season)).toBeTruthy()
    })

    it("should not validate the cache if no series are included", () => {
      jest.useFakeTimers().setSystemTime(new Date("2024-01-01"))
      const season = {
        cachedDate: new Date("2024-05-01"),
        cars: [],
        tracks: [],
        licenses: [],
        categories: [],
        series: [],
      }
      expect(getSeasonController().validateCache(season)).toBeFalsy()
    })

    it("should not validate the cache if no schedules are included", () => {
      jest.useFakeTimers().setSystemTime(new Date("2024-01-01"))
      const season = {
        cachedDate: new Date("2024-05-01"),
        cars: [],
        tracks: [],
        licenses: [],
        categories: [],
        series: [
          {
            schedules: [],
            id: 0,
            name: "",
            licenses: [],
            fixedSetup: false,
            maxWeeks: 0,
            multiclass: false,
            official: false,
          },
        ],
      }
      expect(getSeasonController().validateCache(season)).toBeFalsy()
    })

    it("should not validate the cache if the cached date is too old", () => {
      jest.useFakeTimers().setSystemTime(new Date("2024-01-17 03:00"))
      const season: Season = {
        cachedDate: new Date("2024-01-10 03:00"),
        cars: [],
        tracks: [],
        licenses: [],
        categories: [],
        series: [
          {
            schedules: [
              {
                startDate: new Date("2024-01-11 03:00"),
                raceWeekNum: 0,
                cars: [],
                category: "",
                categoryId: 0,
                name: "",
                serieId: 0,
                track: undefined,
              },
              {
                startDate: new Date("2024-01-01 03:00"),
                raceWeekNum: 0,
                cars: [],
                category: "",
                categoryId: 0,
                name: "",
                serieId: 0,
                track: undefined,
              },
            ],
            id: 0,
            name: "",
            licenses: [],
            fixedSetup: false,
            maxWeeks: 0,
            multiclass: false,
            official: false,
          },
        ],
      }
      expect(getSeasonController().validateCache(season)).toBeFalsy()
    })

    it("should not validate the cache if the last schedule of the bigger season is too old", () => {
      jest.useFakeTimers().setSystemTime(new Date("2024-01-17 03:00"))
      const season: Season = {
        cachedDate: new Date("2024-01-12 03:00"),
        cars: [],
        tracks: [],
        licenses: [],
        categories: [],
        series: [
          {
            schedules: [
              {
                startDate: new Date("2024-01-11 03:00"),
                raceWeekNum: 0,
                cars: [],
                category: "",
                categoryId: 0,
                name: "",
                serieId: 0,
                track: undefined,
              },
              {
                startDate: new Date("2024-01-01 03:00"),
                raceWeekNum: 0,
                cars: [],
                category: "",
                categoryId: 0,
                name: "",
                serieId: 0,
                track: undefined,
              },
            ],
            id: 0,
            name: "",
            licenses: [],
            fixedSetup: false,
            maxWeeks: 0,
            multiclass: false,
            official: false,
          },
        ],
      }
      expect(getSeasonController().validateCache(season)).toBeFalsy()
    })
  })
})
