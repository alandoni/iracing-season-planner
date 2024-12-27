import "reflect-metadata"
import { ServerConfiguration } from "@alandoni/backend/server_interface"
import { WinstonLogger } from "@alandoni/backend/logger/index"
import { SeasonController } from "./modules/iracing/season/season_controller"
import { DI } from "@alandoni/utils"
import "./dependency_injection"

const logger = DI.get(WinstonLogger)
logger.info("Starting...")

DI.get(ServerConfiguration)
  .startServer()
  .then(async (address) => {
    logger.info(`Downloading latest info`)
    try {
      logger.info("Latest info downloaded and cached")
      logger.info(`Running on: ${process.env.NODE_ENV ?? "dev"}, on: ${address.address ?? "localhost"}${address.port}`)
      await DI.get(SeasonController).getSeason()
    } catch (error) {
      logger.error(error)
    }
  })
