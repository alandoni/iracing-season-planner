import { Router } from "express"
import { getSeasonController } from "src/dependency-injection"
import { logger } from "src/logger"

export const seasonRouter = Router()
  .get(`/`, async (_, res) => {
    try {
      const seasons = await getSeasonController().getSeason()
      res.status(200).send(seasons)
    } catch (error) {
      logger.error(`Error: ${error} -- Request ID: ${res.getHeader("requestId")}`)
      res.status(500).send(`Unknown error - Request ID: ${res.getHeader("requestId")}`)
    }
  })
  .get(`/clear-cache`, async (_, res) => {
    try {
      await getSeasonController().invalidateCache()
      const seasons = await getSeasonController().getSeason()
      res.status(200).send(seasons)
    } catch (error) {
      logger.error(`Error: ${error} -- Request ID: ${res.getHeader("requestId")}`)
      res.status(500).send(`Unknown error - Request ID: ${res.getHeader("requestId")}`)
    }
  })
  .get(`/raw`, async (_, res) => {
    try {
      const seasons = await getSeasonController().getRawSeason()
      res.status(200).send(seasons)
    } catch (error) {
      logger.error(`Error: ${error} -- Request ID: ${res.getHeader("requestId")}`)
      res.status(500).send(`Unknown error - Request ID: ${res.getHeader("requestId")}`)
    }
  })
