import { PaymentRepository } from "src/data/payment_repository"
import { PaymentResponse } from "racing-tools-data/payment/payment_response"
import { useForm } from "frontend/utils/react_hooks/use_form"
import { useState } from "react"
import { DI, Money } from "@alandoni/utils"

export function useDonationViewModel(repository: PaymentRepository = DI.get(PaymentRepository)) {
  const [{ name, amount, email }, setForm, { reset }] = useForm({ name: "", email: "", amount: "" })
  const [validationError, setValidationError] = useState<string>()
  const [data, setData] = useState<PaymentResponse>()
  const [success, setSuccess] = useState<boolean>()
  const [error, setError] = useState<unknown>()
  const [loading, setLoading] = useState<boolean>()

  const validateEmail = (email: string) => {
    const regex =
      /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/gi
    return regex.test(email)
  }

  const generatePayment = async () => {
    setLoading(true)
    const number = Money.fromString(amount)
    if (isNaN(number.amount)) {
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
    const request = {
      firstName,
      lastName,
      email: email.length > 0 ? email : undefined,
      amount: number.amount,
    }
    try {
      const data = await repository.generatePayment(request)
      setData(data)
      setSuccess(true)
    } catch (error) {
      setError(error)
      setSuccess(false)
    }
    setLoading(false)
  }

  return {
    name,
    amount,
    email,
    setForm,
    reset,
    generatePayment,
    data,
    success,
    error,
    validationError,
    loading,
  }
}
