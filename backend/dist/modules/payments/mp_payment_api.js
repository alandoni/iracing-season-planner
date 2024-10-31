"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MPPaymentApi = void 0;
const data_utils_1 = require("data-utils");
const mp_payment_1 = require("./mp_payment");
class MPPaymentApi {
    createPayment() {
        return new data_utils_1.ApiRequest(data_utils_1.HttpMethod.POST, "payments", mp_payment_1.MPPayment);
    }
}
exports.MPPaymentApi = MPPaymentApi;
//# sourceMappingURL=mp_payment_api.js.map