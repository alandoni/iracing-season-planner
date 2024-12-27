import "reflect-metadata"
import fs from "fs"
import { SeasonController } from "./season_controller"
import { DI, plainToInstance } from "@alandoni/utils"
import { Season } from "racing-tools-data/iracing/season/models/season"
import { Category } from "racing-tools-data/iracing/season/models/category"
import { Car } from "racing-tools-data/iracing/season/models/car"
import { mockLogger } from "@alandoni/utils"
import { plainToClass } from "class-transformer"

describe("Season", () => {
  it("should deserialize correctly", () => {
    const object = {
      categories: [{ id: 1, _name: "A" }],
      cars: [{ id: 1, categories: [{ id: 1, _name: "A" }] }],
    }
    const result: Season = plainToClass(Season, object)
    mockLogger.debugObject("Season", result)

    expect(result.categories[0]["_name"]).toBe("A")
    expect(result.categories[0]).toBeInstanceOf(Category)
    expect(result.categories[0].name).toBe("A")

    expect(result.cars[0]).toBeInstanceOf(Car)
    expect(result.cars[0].categories[0]["_name"]).toBe("A")
    expect(result.cars[0].categories[0]).toBeInstanceOf(Category)
    expect(result.cars[0].categories[0].name).toBe("A")
  })
})

describe("SeasonController", () => {
  it.skip("should store the season in the cache", async () => {
    try {
      fs.readFileSync(SeasonController.SEASON_FILE, { encoding: "utf8" })
      fs.rmSync(SeasonController.SEASON_FILE)
    } catch {
      mockLogger.debug("File didn't exist")
    }
    const season = await DI.get(SeasonController).getSeason()
    const newFile = fs.readFileSync(SeasonController.SEASON_FILE, { encoding: "utf8" })
    expect(JSON.stringify(season)).toStrictEqual(newFile)
  }, 30000)

  it.skip("should get the cached file", async () => {
    const file = fs.readFileSync(SeasonController.SEASON_FILE, { encoding: "utf8" })
    expect(file).not.toBeUndefined()
    expect(file).not.toBeNull()
    const controller = DI.get(SeasonController)
    const spy = jest.spyOn(controller, "downloadSeason")
    const season = await controller.getSeason()
    expect(spy).not.toHaveBeenCalled()
    const newFile = fs.readFileSync(SeasonController.SEASON_FILE, { encoding: "utf8" })
    expect(JSON.stringify(season)).toStrictEqual(newFile)
  }, 30000)

  describe("Cache validation", () => {
    it("should validate the cache", () => {
      jest.useFakeTimers().setSystemTime(new Date("2024-01-17 02:59"))
      const season = plainToInstance(Season, {
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
            maxWeeks: 2,
            droppedWeeks: 1,
            multiclass: false,
            official: false,
          },
        ],
      })
      expect(season.validate()).toBeTruthy()
    })

    it("should not validate the cache if no series are included", () => {
      jest.useFakeTimers().setSystemTime(new Date("2024-01-01"))
      const season = plainToInstance(Season, {
        cachedDate: new Date("2024-05-01"),
        cars: [],
        tracks: [],
        licenses: [],
        categories: [],
        series: [],
      })
      expect(season.validate()).toBeFalsy()
    })

    it("should not validate the cache if no schedules are included", () => {
      jest.useFakeTimers().setSystemTime(new Date("2024-01-01"))
      const season = plainToInstance(Season, {
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
      })
      expect(season.validate()).toBeFalsy()
    })

    it("should not validate the cache if the cached date is too old", () => {
      jest.useFakeTimers().setSystemTime(new Date("2024-01-17 03:00"))
      const season = plainToInstance(Season, {
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
      })
      expect(season.validate()).toBeFalsy()
    })

    it("should not validate the cache if the last schedule of the bigger season is too old", () => {
      jest.useFakeTimers().setSystemTime(new Date("2024-01-17 03:00"))
      const season = plainToInstance(Season, {
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
      })
      expect(season.validate()).toBeFalsy()
    })
  })
})
