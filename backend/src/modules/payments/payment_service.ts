import { HttpClient } from "data-utils"
import { MPPaymentApi } from "./mp_payment_api"
import { MPPaymentRequest } from "./mp_payment_request"

export class PaymentService {
  constructor(private httpClient: HttpClient, private api: MPPaymentApi) {}

  async createPayment(payment: MPPaymentRequest) {
    const request = this.api.createPayment().buildRequest({ body: payment })
    return (await this.httpClient.request(request)).data
  }
}
