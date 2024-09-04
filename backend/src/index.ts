import "dotenv/config"
import { logger } from "./logger"
import { getSeasonController, getUserRepository } from "./dependency-injection"
import { ExpressServer } from "./express-server"
import express from "express"
import path from "path"

const version = "/api/v1"

const app = new ExpressServer()

app.get(`${version}`, (_, res) => {
  logger.info("Server is working")
  res.status(200).send(`Server is working, try calling: /api/v1/season`)
})

app.get(`${version}/season`, async (_, res) => {
  try {
    const seasons = await getSeasonController().getSeason()
    res.status(200).send(seasons)
  } catch (error) {
    logger.error(`Error: ${error} -- Request ID: ${res.getHeader("requestId")}`)
    res.status(500).send(`Unknown error - Request ID: ${res.getHeader("requestId")}`)
  }
})

app.get(`${version}/user/{id}/{displayName}`, async (req, res) => {
  try {
    const id = req.params.id
    const name = req.params.displayName
    const user = await getUserRepository().getUserInfo(parseInt(id))
    if (user.members[0].display_name !== name) {
      res.status(401).send(`Unauthorized`)
    }
    res.status(200).send(user)
  } catch (error) {
    logger.error(`Error: ${error} -- Request ID: ${res.getHeader("requestId")}`)
    res.status(500).send(`Unknown error - Request ID: ${res.getHeader("requestId")}`)
  }
})

app.useMiddleware(express.static(path.resolve(__dirname, "../../build")))
app.get("/*", (_req, res) => {
  res.sendFile(path.resolve(__dirname, "../../build", "index.html"))
})

app.init().then(async () => {
  logger.info("Downloading latest info")
  await getSeasonController().getSeason()
  logger.info("Latest info downloaded and cached")
})
