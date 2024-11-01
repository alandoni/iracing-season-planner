import { DI, Logger } from "utils"
import { Routes } from "backend/routes/routes"
import path from "path"
import express from "express"
import { Router } from "backend/server_interface"
import { WinstonLogger } from "backend/logger/index"

export class PublicRoute implements Routes {
  constructor(private logger: Logger = DI.get(WinstonLogger)) {}
  use(router: Router): void {
    const buildPath = process.env.NODE_ENV === "production" ? "../../" : "../../build"

    router.use(express.static(path.resolve(__dirname, buildPath)))
    router.get("/*", (req, res) => {
      this.logger.debugObject("Request", req.path)
      res.sendFile(path.resolve(__dirname, buildPath, "index.html"))
    })
    this.logger.debug(`Creating router on /`)
  }
}
