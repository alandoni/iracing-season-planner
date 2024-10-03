import { Router } from "express"
import { getDonationRepository } from "src/dependency-injection"
import { logger } from "src/logger"

export const donationRouter = Router().post("/", async (req, res) => {
  try {
    logger.info(req.body)
    const response = await getDonationRepository().createPayment(req.body)
    res.status(200).json(response)
  } catch (error) {
    logger.error(`Error: ${JSON.stringify(error)} -- Request ID: ${res.getHeader("requestId")}`)
    res.status(500).send(`Unknown error - Request ID: ${res.getHeader("requestId")}`)
  }
})
