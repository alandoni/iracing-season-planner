"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRouter = void 0;
const custom_router_1 = require("backend/routes/custom_router");
class UserRouter {
    userController;
    api;
    constructor(userController, api) {
        this.userController = userController;
        this.api = api;
    }
    use(router) {
        new custom_router_1.CustomRouter(router, this.api.url, this.userController).api(this.api.getMemberInfo(), this.userController.getMemberInfo);
    }
}
exports.UserRouter = UserRouter;
//# sourceMappingURL=user_router.js.map