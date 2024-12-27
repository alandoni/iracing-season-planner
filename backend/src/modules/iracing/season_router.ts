import { DI } from "@alandoni/utils"
import { CustomRouter } from "@alandoni/backend/routes/custom_router"
import { Routes } from "@alandoni/backend/routes/routes"
import { Router } from "@alandoni/backend/server_interface"
import { WinstonLogger } from "@alandoni/backend/logger/index"
import { SeasonController } from "./season/season_controller"
import { SeasonApi } from "racing-tools-data/iracing/season/season_api"

export class SeasonRouter implements Routes {
  constructor(private seasonController: SeasonController, private seasonApi: SeasonApi) {}

  use(router: Router) {
    new CustomRouter(router, this.seasonApi.url, this.seasonController, {
      logger: DI.get(WinstonLogger),
      shouldLogTheResponseBody: false,
      shouldLogTheRequestBody: false,
    })
      .api(this.seasonApi.get(), this.seasonController.getSeason)
      .api(this.seasonApi.raw(), this.seasonController.getRawSeason)
      .api(this.seasonApi.clearCache(), this.seasonController.downloadSeason)
  }
}
