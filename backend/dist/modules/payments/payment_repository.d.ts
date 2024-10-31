import { Logger } from "utils";
import { PaymentService } from "./payment_service";
import { PaymentRequest } from "data/payment/payment_request";
export declare class PaymentRepository {
    private service;
    private logger;
    constructor(service: PaymentService, logger?: Logger);
    createPayment(payment: PaymentRequest): Promise<{
        id: number;
        dateCreated: string;
        dateApproved: string;
        expirationDate: string;
        moneyReleaseDate: string;
        paymentMethodId: string;
        status: string;
        currency: string;
        taxes: number;
        fees: number;
        qrCodeBase64: string;
        qrCode: string;
    }>;
}
