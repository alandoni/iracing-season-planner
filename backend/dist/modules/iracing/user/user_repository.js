"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRepository = void 0;
const js_sha256_1 = require("js-sha256");
require("dotenv/config");
class UserRepository {
    userService;
    static cookie;
    constructor(userService) {
        this.userService = userService;
    }
    encriptLogin(login) {
        const hash = (0, js_sha256_1.sha256)(`${login.password}${login.email.toLowerCase()}`);
        const newPassword = Buffer.from(hash, "hex").toString("base64");
        return { email: login.email, password: newPassword };
    }
    async login() {
        const loginRequest = this.encriptLogin({
            email: process.env.IRACING_EMAIL ?? "",
            password: process.env.IRACING_PASSWORD ?? "",
        });
        return await this.userService.login(loginRequest);
    }
    async getLoggedUser() {
        return await this.userService.getLoggedUser();
    }
    async getUserInfo(userId) {
        return await this.userService.getUserInfo(userId);
    }
    async getStoredCookie() {
        return await Promise.resolve(UserRepository.cookie);
    }
    async setStoredCookie(cookie) {
        UserRepository.cookie = cookie;
        return await Promise.resolve();
    }
}
exports.UserRepository = UserRepository;
//# sourceMappingURL=user_repository.js.map