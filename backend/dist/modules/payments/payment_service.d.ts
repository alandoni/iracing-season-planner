import { HttpClient } from "data-utils";
import { MPPaymentApi } from "./mp_payment_api";
import { MPPaymentRequest } from "./mp_payment_request";
export declare class PaymentService {
    private httpClient;
    private api;
    constructor(httpClient: HttpClient, api: MPPaymentApi);
    createPayment(payment: MPPaymentRequest): Promise<import("./mp_payment").MPPayment>;
}
