import { HttpClientImpl } from "@alandoni/frontend/utils/http_client"
import { DependencyInjection, DependencyInjectionModule } from "@alandoni/utils"
import { PaymentApi } from "racing-tools-data/payment/payment_api"
import { PaymentRepository } from "./modules/payment/data/payment_repository.js"
import { PaymentService } from "./modules/payment/data/payment_service.js"

export class PaymentModule extends DependencyInjectionModule {
  initialize() {
    return (di: DependencyInjection) => {
      di.factory(PaymentApi, () => new PaymentApi())
      di.factory(PaymentService, () => new PaymentService(di.get(HttpClientImpl), di.get(PaymentApi)))
      di.factory(PaymentRepository, () => new PaymentRepository(di.get(PaymentService)))
    }
  }
}
