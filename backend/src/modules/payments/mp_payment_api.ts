import { ApiRequest, HttpMethod } from "@alandoni/data-utils"
import { MPPayment } from "./mp_payment"
import { MPPaymentRequest } from "./mp_payment_request"

export class MPPaymentApi {
  createPayment(): ApiRequest<MPPayment, MPPaymentRequest> {
    return new ApiRequest(HttpMethod.POST, "payments", MPPayment)
  }
}
