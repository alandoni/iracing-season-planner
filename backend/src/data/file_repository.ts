import { WinstonLogger } from "@alandoni/backend/logger/index"
import { Logger, DI } from "@alandoni/utils"
import { promises as fs } from "fs"
import path from "path"

export class FileRepository {
  constructor(private logger: Logger = DI.get(WinstonLogger)) {}

  async removeFile(filePath: string) {
    this.logger.info(`Removing file ${path.join(__dirname, filePath)}`)
    await fs.rm(filePath)
  }

  async readFile(filePath: string) {
    this.logger.info(`Reading file ${path.join(__dirname, filePath)}`)
    return await fs.readFile(path.join(__dirname, filePath), { encoding: "utf8" })
  }

  async writeFile(filePath: string, content: string) {
    this.logger.info(`File will be stored in ${path.join(__dirname, filePath)}`)
    await fs.writeFile(path.join(__dirname, filePath), content)
  }

  async fileExist(filePath: string) {
    try {
      this.logger.info(`Check if ${path.join(__dirname, filePath)} exist`)
      const result = await fs.lstat(path.join(__dirname, filePath))
      return !result.isDirectory()
    } catch {
      return false
    }
  }

  async removeFolder(folderPath: string) {
    this.logger.info(`Removing folder ${path.join(__dirname, folderPath)}`)
    await fs.rm(folderPath, { recursive: true, force: true })
  }

  async createFolder(folderPath: string, newFolderName: string) {
    this.logger.info(`Creating folder ${path.join(__dirname, folderPath)}`)
    await fs.mkdir(path.join(__dirname, folderPath, newFolderName))
  }

  async folderExist(folderPath: string) {
    try {
      this.logger.info(`Check if ${path.join(__dirname, folderPath)} exist`)
      const result = await fs.lstat(path.join(__dirname, folderPath))
      return result.isDirectory()
    } catch {
      return false
    }
  }
}
