import express from "express"
import path from "path"
import * as dotenv from "dotenv"

dotenv.config({ path: path.resolve(__dirname, "../.env") })

import { logger } from "./logger"
import { getSeasonController } from "./dependency-injection"
import { ExpressServer } from "./express-server"
import { seasonRouter } from "./routes/season"
import { userRouter } from "./routes/user"
import { donationRouter } from "./routes/donation"

const version = "/api/v1"

const app = new ExpressServer()

app
  .router(version)
  .get(`/`, (_, res) => {
    logger.info("Server is working")
    res.status(200).send(`Server is working, try calling: /api/v1/season`)
  })
  .use("/season", seasonRouter)
  .use("/user", userRouter)
  .use("/donation", donationRouter)

const buildPath = process.env.NODE_ENV === "production" ? "../../" : "../../build"

app.useMiddleware(express.static(path.resolve(__dirname, buildPath)))
app.get("/*", (_req, res) => {
  res.sendFile(path.resolve(__dirname, buildPath, "index.html"))
})

app.init().then(async () => {
  logger.info("Downloading latest info")
  await getSeasonController().getSeason()
  logger.info("Latest info downloaded and cached")

  logger.info(`Running on: ${process.env.NODE_ENV}`)
})
