import { Router } from "express"
import { getUserRepository } from "src/dependency-injection"
import { logger } from "src/logger"

export const userRouter = Router().get(`/user/:id/:displayName`, async (req, res) => {
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
