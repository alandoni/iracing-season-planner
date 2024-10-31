"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IRacingHeadersInterceptor = void 0;
const utils_1 = require("utils");
const user_repository_1 = require("../../modules/iracing/user/user_repository");
class IRacingHeadersInterceptor {
    async executeBefore(apiRequest) {
        const userRepository = utils_1.DI.get(user_repository_1.UserRepository);
        const parsedCookies = await userRepository.getStoredCookie();
        if (!parsedCookies) {
            return;
        }
        console.log(parsedCookies);
        if (!apiRequest.headers) {
            apiRequest.headers = {};
        }
        apiRequest.headers.Cookie = parsedCookies;
        apiRequest.headers["Content-Type"] = "application/json";
    }
    async executeAfter(response) {
        console.log(response.headers);
        if (!response.headers || !response.headers["set-cookie"] || !Array.isArray(response.headers["set-cookie"])) {
            return response;
        }
        console.log(response);
        const userRepository = utils_1.DI.get(user_repository_1.UserRepository);
        await userRepository.setStoredCookie(this.parseCookies(response.headers["set-cookie"]));
        return response;
    }
    parseCookies(raw) {
        return raw
            .map((entry) => {
            const parts = entry.split(";");
            const cookiePart = parts[0];
            return cookiePart;
        })
            .join(";");
    }
}
exports.IRacingHeadersInterceptor = IRacingHeadersInterceptor;
//# sourceMappingURL=ir_headers_interceptor.js.map