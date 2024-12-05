import { HttpClient } from "@alandoni/data-utils"
import { PaymentApi } from "racing-tools-data/payment/payment_api"
import { PaymentRequest } from "racing-tools-data/payment/payment_request"

export class PaymentService {
  constructor(private httpClient: HttpClient, private paymentApi: PaymentApi) {}

  async createPayment(payment: PaymentRequest) {
    const request = this.paymentApi.createPayment().buildRequest({ body: payment })
    return (await this.httpClient.request(request)).data
  }
}
