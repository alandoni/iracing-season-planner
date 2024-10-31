import { PaymentRepository } from "./payment_repository";
import { PaymentResponse } from "data/payment/payment_response";
import { RequestWrapper } from "backend/controller/request_wrapper";
import { PaymentRequest } from "data/payment/payment_request";
export declare class PaymentController {
    private donationRepository;
    constructor(donationRepository: PaymentRepository);
    createPayment(payment: RequestWrapper<PaymentRequest>): Promise<PaymentResponse>;
}
