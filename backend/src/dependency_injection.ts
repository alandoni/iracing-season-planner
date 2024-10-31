import express, { Router } from "express"
import path from "path"
import * as dotenv from "dotenv"

dotenv.config({ path: path.resolve(__dirname, "../.env") })

import { ServerConfiguration } from "backend/server_interface"
import { WinstonLogger } from "backend/logger/index"
import { DependencyInjection } from "utils"
import { IRacingModule } from "./modules/iracing/iracing_module"
import { PaymentModule } from "./modules/payments/payment_module"
import { json } from "body-parser"
import cors from "cors"
import { SeasonController } from "./modules/iracing/season/season_controller"
import { PublicRoute } from "./public_routes"

const modules = [new IRacingModule(), new PaymentModule()]

DependencyInjection.initialize((di) => {
  di.factory(WinstonLogger, () => new WinstonLogger())
  di.factory(PublicRoute, () => new PublicRoute())
  di.factory(ServerConfiguration, () => {
    const app = express()
    app.use(cors())
    app.use(json())
    const version = "/api/v1"
    const port = isNaN(Number(process.env.PORT)) ? 3001 : Number(process.env.port)
    app.listen
    const appConfiguration = new ServerConfiguration(app, Router, port, di.get(WinstonLogger))
    appConfiguration.setRoutes(version, [...modules.flatMap((m) => m.getRoutes()), di.get(PublicRoute)])
    appConfiguration.startServer().then(async (address) => {
      const logger = di.get(WinstonLogger)
      logger.info(`Downloading latest info`)
      try {
        logger.info("Latest info downloaded and cached")
        logger.info(`Running on: ${process.env.NODE_ENV ?? "dev"}, on: ${address}`)
        await di.get(SeasonController).getSeason()
      } catch (error) {
        logger.error(error)
      }
    })
    return appConfiguration
  })
  di.modules(...modules)
})
