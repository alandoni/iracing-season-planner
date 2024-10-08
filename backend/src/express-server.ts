import express, { Express, Request, Response, NextFunction, Router } from "express"
import { ServerInterface } from "./server-interface"
import { logger } from "./logger"
import { randomUUID } from "crypto"
import cors from "cors"
import { json } from "body-parser"

export class ExpressServer implements ServerInterface<Request, Response, NextFunction> {
  app: Express
  port = process.env.PORT ?? 3001

  constructor() {
    this.app = express()
    this.app.use(cors())
    this.app.use(json())
  }

  init(): Promise<void> {
    return new Promise((resolve) => {
      logger.info(`Listening on port ${this.port}`)
      this.app.listen(this.port, () => {
        resolve()
      })
    })
  }

  get(url: string | RegExp, callback: (req: Request, res: Response, next: NextFunction) => void | Promise<void>) {
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

  route(prefix: string) {
    return this.app.route(prefix)
  }

  router(prefix: string) {
    const router = Router()
    this.app.use(prefix, router)
    return router
  }
}
