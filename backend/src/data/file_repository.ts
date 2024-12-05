import { WinstonLogger } from "@alandoni/backend/logger/index"
import { Logger, DI } from "@alandoni/utils"
import { promises as fs } from "fs"
import path from "path"

export class FileRepository {
  constructor(private logger: Logger = DI.get(WinstonLogger)) {}

  async removeFile(filePath: string) {
    this.logger.info(`Removing file ${path.resolve(filePath)}`)
    await fs.rm(filePath)
  }

  async readFile(filePath: string) {
    this.logger.info(`Reading file ${path.resolve(filePath)}`)
    return await fs.readFile(path.resolve(filePath), { encoding: "utf8" })
  }

  async writeFile(filePath: string, content: string) {
    this.logger.info(`File will be stored in ${path.resolve(filePath)}`)
    await fs.writeFile(path.resolve(filePath), content)
  }

  async fileExist(filePath: string) {
    try {
      this.logger.info(`Check if ${path.resolve(filePath)} exist`)
      const result = await fs.lstat(path.resolve(filePath))
      return !result.isDirectory()
    } catch {
      return false
    }
  }

  async removeFolder(folderPath: string) {
    this.logger.info(`Removing folder ${path.resolve(folderPath)}`)
    await fs.rm(folderPath, { recursive: true, force: true })
  }

  async createFolder(folderPath: string, newFolderName: string) {
    this.logger.info(`Creating folder ${path.resolve(folderPath)}`)
    await fs.mkdir(path.resolve(folderPath, newFolderName))
  }

  async folderExist(folderPath: string) {
    try {
      this.logger.info(`Check if ${path.resolve(folderPath)} exist`)
      const result = await fs.lstat(path.resolve(folderPath))
      return result.isDirectory()
    } catch {
      return false
    }
  }
}
