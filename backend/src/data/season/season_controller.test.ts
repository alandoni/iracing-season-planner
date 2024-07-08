import fs from "fs"
import { getSeasonController } from "src/dependency-injection"
import { SeasonController } from "./season_controller"
import { logger } from "src/logger"

describe("SeasonController", () => {
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
})
