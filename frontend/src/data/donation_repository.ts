import { PaymentResponse } from "data/payment_response"
import { useRequest } from "./use_request"
import { Payment } from "data/payment"
import { useState } from "react"

export function useDonationRepository() {
  const [data, loading, success, error, makeRequest, resetRequest] = useRequest<PaymentResponse>("donation", false)
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [amount, setAmount] = useState("")
  const [validationError, setValidationError] = useState<string>()

  const currencyToNumber = (amount: string) => {
    let validatedAmount = amount.replace(/[^\d.,]+/g, "")
    // WHEN PRICE FORMAT 1.000,00
    if (/\.[^,.]+,/g.test(validatedAmount)) {
      validatedAmount = validatedAmount.replace(/\./g, "").replace(/,/, ".")
    }
    // WHEN PRICE FORMAT 1,000.00
    else if (/,[^,.]+\./g.test(validatedAmount)) {
      validatedAmount = validatedAmount.replace(/,/g, "")
    }
    // WHEN PRICE FORMAT 100,00 OR 100.00
    else {
      validatedAmount = validatedAmount.replace(/,/g, ".")
    }
    return parseFloat(validatedAmount)
  }

  const validateEmail = (email: string) => {
    const regex =
      /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/gi
    return regex.test(email)
  }

  const generatePayment = () => {
    const number = currencyToNumber(amount)
    if (isNaN(number)) {
      setValidationError("O valor digitado não é um número válido.")
      return
    }
    if (email.length > 0 && !validateEmail(email)) {
      setValidationError("Digite um e-mail válido.")
      return
    }
    const names = name.split(" ")
    const firstName = names.slice(0, -2).join(" ")
    const lastName = names[names.length - 1]
    makeRequest<Payment>("POST", {
      firstName,
      lastName,
      email: email.length > 0 ? email : undefined,
      amount: number,
    })
  }

  const reset = () => {
    resetRequest()
    setValidationError(undefined)
  }

  return {
    generatePayment,
    data,
    loading,
    success,
    error,
    name,
    setName,
    email,
    setEmail,
    amount,
    setAmount,
    validationError,
    reset,
  }
}
