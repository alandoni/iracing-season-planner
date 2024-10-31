import { Routes } from "backend/routes/routes";
import { PaymentController } from "./payment_controller";
import { PaymentApi } from "data/payment/payment_api";
import { Router } from "backend/server_interface";
export declare class PaymentRouter implements Routes {
    private seasonController;
    private api;
    constructor(seasonController: PaymentController, api: PaymentApi);
    use(router: Router): void;
}
