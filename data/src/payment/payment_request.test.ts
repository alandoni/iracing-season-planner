import { PaymentRequest } from "./payment_request"
import { validate } from "class-validator"
import "reflect-metadata"

describe("PaymentRequest", () => {
  it("should validate a class", async () => {
    const request = new PaymentRequest()
    request.amount = 0
    const errors = await validate(request)
    expect(errors).toMatchObject(
      expect.arrayContaining([
        expect.objectContaining({
          value: 0,
          property: "amount",
          constraints: { min: "amount must not be less than 1" },
        }),
      ]),
    )
  })
})
