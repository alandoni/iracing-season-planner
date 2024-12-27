"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentApi = void 0;
const data_utils_1 = require("@alandoni/data-utils");
const payment_response_1 = require("./payment_response");
class PaymentApi {
    url = "payment";
    createPayment() {
        return new data_utils_1.ApiRequest(data_utils_1.HttpMethod.POST, this.url, payment_response_1.PaymentResponse);
    }
}
exports.PaymentApi = PaymentApi;
//# sourceMappingURL=payment_api.js.map