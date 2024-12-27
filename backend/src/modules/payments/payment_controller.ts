import { PaymentRepository } from "./payment_repository"
import { PaymentResponse } from "racing-tools-data/payment/payment_response"
import { PaymentRequest } from "racing-tools-data/payment/payment_request"
import { RequestWrapper } from "@alandoni/backend/controller/request_wrapper"

export class PaymentController {
  constructor(private donationRepository: PaymentRepository) {}

  async createPayment(payment: RequestWrapper<PaymentRequest>): Promise<PaymentResponse> {
    return await this.donationRepository.createPayment(payment.body)
  }
}
