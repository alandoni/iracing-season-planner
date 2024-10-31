import { CustomRouter } from "backend/routes/custom_router"
import { Routes } from "backend/routes/routes"
import { PaymentController } from "./payment_controller"
import { PaymentApi } from "data/payment/payment_api"
import { Router } from "backend/server_interface"

export class PaymentRouter implements Routes {
  constructor(private seasonController: PaymentController, private api: PaymentApi) {}

  use(router: Router) {
    new CustomRouter(router, this.api.url, this.seasonController).api(
      this.api.createPayment(),
      this.seasonController.createPayment,
    )
  }
}
