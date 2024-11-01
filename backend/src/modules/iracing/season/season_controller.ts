import { Season } from "data/iracing/season/models/season"
import { SeasonRepository } from "./season_repository"
import { UserRepository } from "src/modules/iracing/user/user_repository"
import { FileRepository } from "src/data/file_repository"
import { DI, Logger } from "utils"
import { WinstonLogger } from "backend/logger/index"

export class SeasonController {
  static DOWNLOAD_PATH = `downloaded`
  static SEASON_FILE = `${SeasonController.DOWNLOAD_PATH}/file-season.json`

  constructor(
    private seasonRepository: SeasonRepository,
    private userRepository: UserRepository,
    private fileRepository: FileRepository,
    private logger: Logger = DI.get(WinstonLogger),
  ) {}

  async invalidateCache(): Promise<void> {
    return await this.fileRepository.removeFolder(SeasonController.DOWNLOAD_PATH)
  }

  async getRawSeason(): Promise<string> {
    return await this.fileRepository.readFile(SeasonController.SEASON_FILE)
  }

  async getSeason(): Promise<Season> {
    console.log("Ué")
    const cache = await this.getCachedSeason()
    if (cache?.validate()) {
      this.logger.debug(`Using cache ${cache?.cachedDate}`)
      return cache
    } else {
      this.logger.debug("Downloading season")
      return await this.downloadSeason()
    }
  }

  private async getCachedSeason(): Promise<Season | null> {
    try {
      const file = await this.fileRepository.readFile(SeasonController.SEASON_FILE)
      const content = JSON.parse(file) as Season
      content.cachedDate = new Date(content.cachedDate)
      content.series.forEach((s) => {
        s.schedules.forEach((sc) => {
          sc.startDate = new Date(sc.startDate)
        })
      })
      return Object.assign(new Season(), content)
    } catch (error) {
      this.logger.error(error)
      return null
    }
  }

  async downloadSeason(): Promise<Season> {
    const season = await this.buildSeason()
    if (!(await this.fileRepository.folderExist(SeasonController.DOWNLOAD_PATH))) {
      await this.fileRepository.createFolder("", SeasonController.DOWNLOAD_PATH)
    }
    await this.fileRepository.writeFile(SeasonController.SEASON_FILE, JSON.stringify(season, null, 2))
    return season
  }

  private async buildSeason(): Promise<Season> {
    try {
      await this.userRepository.login()
      return await this.seasonRepository.getSeason()
    } catch (error) {
      this.logger.error(error)
      throw error
    }
  }
}
