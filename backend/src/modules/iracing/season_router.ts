import { DI } from "utils"
import { CustomRouter } from "backend/routes/custom_router"
import { Routes } from "backend/routes/routes"
import { SeasonController } from "./season/season_controller"
import { SeasonApi } from "data/iracing/season/season_api"
import { Router } from "backend/server_interface"
import { WinstonLogger } from "backend/logger/index"

export class SeasonRouter implements Routes {
  constructor(private seasonController: SeasonController, private seasonApi: SeasonApi) {}

  use(router: Router) {
    new CustomRouter(router, this.seasonApi.url, this.seasonController, {
      logger: DI.get(WinstonLogger),
      shouldLogTheResponseBody: false,
    })
      .api(this.seasonApi.get(), this.seasonController.getSeason)
      .api(this.seasonApi.raw(), this.seasonController.getRawSeason)
      .api(this.seasonApi.clearCache(), this.seasonController.downloadSeason)
  }
}
