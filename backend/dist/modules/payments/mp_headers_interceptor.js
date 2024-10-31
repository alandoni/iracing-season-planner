"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MPHeadersInterceptor = void 0;
const utils_1 = require("utils");
class MPHeadersInterceptor {
    executeBefore(apiRequest) {
        apiRequest.headers = {
            ...apiRequest.headers,
            Authorization: `Bearer ${process.env.MP_ACCESS_TOKEN}`,
            "Content-Type": "application/json",
            "X-Idempotency-Key": (0, utils_1.uuid)(),
        };
        return Promise.resolve();
    }
}
exports.MPHeadersInterceptor = MPHeadersInterceptor;
//# sourceMappingURL=mp_headers_interceptor.js.map