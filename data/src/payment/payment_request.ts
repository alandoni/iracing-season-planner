import { IsOptional, MinLength, IsEmail, Min } from "class-validator"
export class PaymentRequest {
  @IsOptional()
  @MinLength(3)
  firstName?: string

  @MinLength(3)
  @IsOptional()
  lastName?: string

  @IsEmail()
  @IsOptional()
  email?: string

  @Min(1)
  amount: number
}
