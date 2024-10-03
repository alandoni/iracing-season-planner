import { Payment } from "data/payment"
import { DonationRepository } from "./donation_repository"
import { PaymentResponse } from "data/payment_response"

export class DonationController {
  constructor(private donationRepository: DonationRepository) {}

  async createPayment(payment: Payment): Promise<PaymentResponse> {
    const result = await this.donationRepository.createPayment(payment)
    return {
      qrCode: result.qrCode,
      qrCodeBase64: result.qrCodeBase64,
    }
  }
}
