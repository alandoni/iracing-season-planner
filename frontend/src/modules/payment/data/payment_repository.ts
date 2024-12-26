import { PaymentService } from "./payment_service.js"
import { PaymentRequest } from "racing-tools-data/payment/payment_request"

export class PaymentRepository {
  constructor(private service: PaymentService) {}

  async generatePayment(donation: PaymentRequest) {
    return await this.service.createPayment(donation)
  }
}
