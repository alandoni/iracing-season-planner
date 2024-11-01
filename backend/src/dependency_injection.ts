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
import { PublicRoute } from "./public_routes"

export const modules = [new IRacingModule(), new PaymentModule()]

DependencyInjection.initialize((di) => {
  di.factory(WinstonLogger, () => new WinstonLogger())
  di.factory(PublicRoute, () => new PublicRoute())
  di.modules(...modules)
  di.factory(ServerConfiguration, () => {
    const app = express()
    app.use(cors())
    app.use(json())
    const version = "/api/v1"
    const port = isNaN(Number(process.env.PORT)) ? 3001 : Number(process.env.port)
    const appConfiguration = new ServerConfiguration(app, Router, port, di.get(WinstonLogger))
    // appConfiguration.setRoutes("", [di.get(PublicRoute)])
    appConfiguration.setRoutes(version, [...modules.flatMap((m) => m.getRoutes())])
    return appConfiguration
  })
  di.modules(...modules)
})
