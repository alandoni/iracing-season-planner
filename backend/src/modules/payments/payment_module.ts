import { FileRepository } from "src/data/file_repository"
import { AxiosHttpClient } from "src/data/http_client"
import { DependencyInjection, DependencyInjectionModule, DI } from "@alandoni/utils"
import { MPHeadersInterceptor } from "./mp_headers_interceptor"
import { PaymentApi } from "racing-tools-data/payment/payment_api"
import { PaymentService } from "./payment_service"
import { PaymentRepository } from "./payment_repository"
import { PaymentController } from "./payment_controller"
import { MPPaymentApi } from "./mp_payment_api"
import { PaymentRouter } from "./payment_router"
import { Routes } from "@alandoni/backend/routes/routes"
import { BackendModuleInterface } from "@alandoni/backend/backend_module_interface"

class MPHttpClient extends AxiosHttpClient {
  constructor() {
    super("https://api.mercadopago.com/v1/", [DI.get(MPHeadersInterceptor)])
  }
}

export class PaymentModule extends DependencyInjectionModule implements BackendModuleInterface {
  constructor() {
    super()
  }

  initialize(): (di: DependencyInjection) => void {
    return (di) => {
      di.factory(FileRepository, () => new FileRepository())

      di.factory(PaymentApi, () => new PaymentApi())
      di.factory(MPPaymentApi, () => new MPPaymentApi())
      di.factory(PaymentService, () => new PaymentService(di.get(MPHttpClient), di.get(MPPaymentApi)))
      di.factory(PaymentRepository, () => new PaymentRepository(di.get(PaymentService)))

      di.factory(MPHeadersInterceptor, () => new MPHeadersInterceptor())
      di.factory(MPHttpClient, () => new MPHttpClient())

      di.factory(PaymentController, () => new PaymentController(di.get(PaymentRepository)))
      di.factory(PaymentRouter, () => new PaymentRouter(di.get(PaymentController), di.get(PaymentApi)))
    }
  }

  getEntities(): unknown[] {
    return []
  }

  getRoutes(): Routes[] {
    return [DI.get(PaymentRouter)]
  }
}
