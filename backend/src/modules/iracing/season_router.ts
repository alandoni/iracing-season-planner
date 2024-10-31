import { CustomRouter } from "backend/routes/custom_router"
import { Routes } from "backend/routes/routes"
import { SeasonController } from "./season/season_controller"
import { SeasonApi } from "data/iracing/season/season_api"
import { Router } from "backend/server_interface"

export class SeasonRouter implements Routes {
  constructor(private seasonController: SeasonController, private seasonApi: SeasonApi) {}

  use(router: Router) {
    new CustomRouter(router, this.seasonApi.url, this.seasonController)
      .api(this.seasonApi.get(), this.seasonController.getSeason)
      .api(this.seasonApi.raw(), this.seasonController.getRawSeason)
      .api(this.seasonApi.clearCache(), this.seasonController.downloadSeason)
  }
}
