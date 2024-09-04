import express, { Express, Request, Response, NextFunction } from "express"
import { ServerInterface } from "./server-interface"
import { logger } from "./logger"
import { randomUUID } from "crypto"
import cors from "cors"

export class ExpressServer implements ServerInterface<Request, Response, NextFunction> {
  app: Express
  port = process.env.PORT ?? 3001

  constructor() {
    this.app = express()
    this.app.use(cors())
  }

  init(): Promise<void> {
    return new Promise((resolve) => {
      logger.info(`Listening on port ${this.port}`)
      this.app.listen(this.port, () => {
        resolve()
      })
    })
  }

  get(url: string, callback: (req: Request, res: Response, next: NextFunction) => void | Promise<void>) {
    this.app.get(url, async (req, res, next) => {
      const requestId = randomUUID()
      logger.info(`Getting ${url} with Request ID: ${requestId}`)
      res.setHeader("requestId", requestId)
      await callback(req, res, next)
      logger.info(`End of getting season with Request ID: ${requestId}`)
    })
  }

  use(url: string, handler: (req: Request, res: Response, next: NextFunction) => void | Promise<void>) {
    this.app.use(url, handler)
  }

  useMiddleware(handler: (req: Request, res: Response, next: NextFunction) => void | Promise<void>) {
    this.app.use(handler)
  }
}
