import { Logger, DI } from "utils"
import { WinstonLogger } from "backend/logger/index"
import { MPPaymentRequest } from "./mp_payment_request"
import { PaymentService } from "./payment_service"
import { PaymentRequest } from "data/payment/payment_request"

export class PaymentRepository {
  constructor(private service: PaymentService, private logger: Logger = DI.get(WinstonLogger)) {}
  async createPayment(payment: PaymentRequest) {
    const payload = new MPPaymentRequest()
    payload.description = `Doação de ${payment.amount ?? "0"} feita via PIX feita por ${
      payment.firstName ?? "anônimo"
    } ${payment.lastName ?? ""}`
    payload.transaction_amount = payment.amount
    payload.payment_method_id = "pix"
    payload.payer = {
      first_name: payment.firstName,
      last_name: payment.lastName,
      email: payment.email ?? "generic@example.com",
    }
    const response = await this.service.createPayment(payload)
    this.logger.info(JSON.stringify(response))
    return {
      id: response.id,
      dateCreated: response.date_created,
      dateApproved: response.date_approved,
      expirationDate: response.date_of_expiration,
      moneyReleaseDate: response.money_release_date,
      paymentMethodId: response.payment_method_id,
      status: response.status,
      currency: response.currency_id,
      taxes: response.taxes_amount,
      fees: response.fee_details.reduce((acc, item) => acc + item.amount, 0),
      qrCodeBase64: response.point_of_interaction.transaction_data.qr_code_base64,
      qrCode: response.point_of_interaction.transaction_data.qr_code,
    }
  }
}
