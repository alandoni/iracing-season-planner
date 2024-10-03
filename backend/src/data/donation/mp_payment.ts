export type MPPayment = {
  id: number
  date_created: string
  date_approved: string
  date_of_expiration: string
  money_release_date: string
  payment_method_id: string
  status: string
  currency_id: string
  taxes_amount: number
  fee_details: {
    amount: number
  }[]
  point_of_interaction: {
    transaction_data: {
      qr_code_base64: string
      qr_code: string
    }
  }
}
