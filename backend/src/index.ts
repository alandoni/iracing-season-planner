import { DI } from "utils"
import { ServerConfiguration } from "backend/server_interface"
import "./dependency_injection"
import { WinstonLogger } from "backend/logger/index"
import { SeasonController } from "./modules/iracing/season/season_controller"

DI.get(ServerConfiguration)
  .startServer()
  .then(async (address) => {
    const logger = DI.get(WinstonLogger)
    logger.info(`Downloading latest info`)
    try {
      logger.info("Latest info downloaded and cached")
      logger.info(`Running on: ${process.env.NODE_ENV ?? "dev"}, on: ${address.address ?? "localhost"}${address.port}`)
      await DI.get(SeasonController).getSeason()
    } catch (error) {
      logger.error(error)
    }
  })
