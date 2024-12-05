import { CustomRouter } from "@alandoni/backend/routes/custom_router"
import { Routes } from "@alandoni/backend/routes/routes"
import { Router } from "@alandoni/backend/server_interface"
import { PaymentController } from "./payment_controller"
import { PaymentApi } from "racing-tools-data/payment/payment_api"

export class PaymentRouter implements Routes {
  constructor(private seasonController: PaymentController, private api: PaymentApi) {}

  use(router: Router) {
    new CustomRouter(router, this.api.url, this.seasonController).api(
      this.api.createPayment(),
      this.seasonController.createPayment,
    )
  }
}
