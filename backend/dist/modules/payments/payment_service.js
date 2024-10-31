"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentService = void 0;
class PaymentService {
    httpClient;
    api;
    constructor(httpClient, api) {
        this.httpClient = httpClient;
        this.api = api;
    }
    async createPayment(payment) {
        const request = this.api.createPayment().buildRequest({ body: payment });
        return (await this.httpClient.request(request)).data;
    }
}
exports.PaymentService = PaymentService;
//# sourceMappingURL=payment_service.js.map