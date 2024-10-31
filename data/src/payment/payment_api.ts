import { ApiRequest, HttpMethod } from "data-utils"
import { PaymentResponse } from "./payment_response"
import { PaymentRequest } from "./payment_request"

export class PaymentApi {
  url = "payment"

  createPayment(): ApiRequest<PaymentResponse, PaymentRequest> {
    return new ApiRequest(HttpMethod.POST, this.url, PaymentResponse)
  }
}
