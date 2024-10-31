import { ApiRequest } from "data-utils";
import { PaymentResponse } from "./payment_response";
import { PaymentRequest } from "./payment_request";
export declare class PaymentApi {
    url: string;
    createPayment(): ApiRequest<PaymentResponse, PaymentRequest>;
}
