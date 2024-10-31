import { PaymentRepository } from "./payment_repository"
import { PaymentResponse } from "data/payment/payment_response"
import { RequestWrapper } from "backend/controller/request_wrapper"
import { PaymentRequest } from "data/payment/payment_request"

export class PaymentController {
  constructor(private donationRepository: PaymentRepository) {}

  async createPayment(payment: RequestWrapper<PaymentRequest>): Promise<PaymentResponse> {
    return await this.donationRepository.createPayment(payment.body)
  }
}
