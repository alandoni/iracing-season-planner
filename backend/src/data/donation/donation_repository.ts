import axios from "axios"
import { Payment } from "data/payment"
import { v4 } from "uuid"
import { MPPayment } from "./mp_payment"
import { logger } from "src/logger"

export class DonationRepository {
  async createPayment(payment: Payment) {
    const url = "https://api.mercadopago.com/v1/payments"
    const headers = {
      Authorization: `Bearer ${process.env.MP_ACCESS_TOKEN}`,
      "Content-Type": "application/json",
      "X-Idempotency-Key": v4(),
    }

    const payload = {
      transaction_amount: payment.amount,
      description: "Pagamento via PIX",
      payment_method_id: "pix",
      payer: {
        first_name: payment.firstName,
        last_name: payment.lastName,
        email: payment.email ?? "generic@example.com",
      },
    }
    const response = (await axios.post<MPPayment>(url, payload, { headers })).data

    logger.info(JSON.stringify(response))

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
