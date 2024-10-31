import { ApiRequest } from "data-utils";
import { MPPayment } from "./mp_payment";
import { MPPaymentRequest } from "./mp_payment_request";
export declare class MPPaymentApi {
    createPayment(): ApiRequest<MPPayment, MPPaymentRequest>;
}
