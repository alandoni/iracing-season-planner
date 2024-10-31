"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentRouter = void 0;
const custom_router_1 = require("backend/routes/custom_router");
class PaymentRouter {
    seasonController;
    api;
    constructor(seasonController, api) {
        this.seasonController = seasonController;
        this.api = api;
    }
    use(router) {
        new custom_router_1.CustomRouter(router, this.api.url, this.seasonController).api(this.api.createPayment(), this.seasonController.createPayment);
    }
}
exports.PaymentRouter = PaymentRouter;
//# sourceMappingURL=payment_router.js.map