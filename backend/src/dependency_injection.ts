import express, { Router } from "express"
import path from "path"
import * as dotenv from "dotenv"

if (process.env.NODE_ENV !== "production") {
  dotenv.config({ path: path.resolve(__dirname, "../.env") })
}

import { ServerConfiguration } from "@alandoni/backend/server_interface"
import { WinstonLogger } from "@alandoni/backend/logger/index"
import { DependencyInjection } from "@alandoni/utils"
import { IRacingModule } from "./modules/iracing/iracing_module"
import { PaymentModule } from "./modules/payments/payment_module"
import { json } from "body-parser"
import cors from "cors"
import { PublicRoute } from "./public_routes"

const version = "/api/v1"

export const modules = [new IRacingModule(), new PaymentModule()]

DependencyInjection.initialize((di) => {
  di.factory(WinstonLogger, () => new WinstonLogger())
  di.factory(PublicRoute, () => new PublicRoute())
  di.modules(...modules)
  di.factory(ServerConfiguration, () => {
    const app = express()
    app.use(cors())
    app.use(json())
    const port = isNaN(Number(process.env.PORT)) ? 3001 : Number(process.env.port)
    const appConfiguration = new ServerConfiguration(app, Router, port, di.get(WinstonLogger))
    appConfiguration.setRoutes("", [di.get(PublicRoute)])
    appConfiguration.setRoutes(version, [...modules.flatMap((m) => m.getRoutes())])
    return appConfiguration
  })
  di.modules(...modules)
})
