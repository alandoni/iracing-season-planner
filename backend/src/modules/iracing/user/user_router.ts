import { CustomRouter } from "@alandoni/backend/routes/custom_router"
import { Routes } from "@alandoni/backend/routes/routes"
import { UserController } from "./user_controller"
import { UserApi } from "racing-tools-data/iracing/user/user_api"
import { Router } from "@alandoni/backend/server_interface"

export class UserRouter implements Routes {
  constructor(private userController: UserController, private api: UserApi) {}

  use(router: Router) {
    new CustomRouter(router, this.api.url, this.userController).api(
      this.api.getMemberInfo(),
      this.userController.getMemberInfo,
    )
  }
}
