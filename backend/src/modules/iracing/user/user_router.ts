import { CustomRouter } from "backend/routes/custom_router"
import { Routes } from "backend/routes/routes"
import { UserController } from "./user_controller"
import { UserApi } from "data/iracing/user/user_api"
import { Router } from "backend/server_interface"

export class UserRouter implements Routes {
  constructor(private userController: UserController, private api: UserApi) {}

  use(router: Router) {
    new CustomRouter(router, this.api.url, this.userController).api(
      this.api.getMemberInfo(),
      this.userController.getMemberInfo,
    )
  }
}
