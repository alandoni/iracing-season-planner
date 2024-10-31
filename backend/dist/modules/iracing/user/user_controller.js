"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const data_utils_1 = require("data-utils");
const user_1 = require("data/iracing/user/user");
class UserController {
    userRepository;
    constructor(userRepository) {
        this.userRepository = userRepository;
    }
    async getMemberInfo(req) {
        const id = req.params.id;
        const name = req.params.displayName;
        const userInfo = await this.userRepository.getUserInfo(id);
        if (userInfo.members[0].display_name !== name) {
            throw new data_utils_1.AuthError("Unauthorized", data_utils_1.AuthError.NOT_ALLOWED_TO_PERFORM_ACTION);
        }
        const user = new user_1.User();
        user.id = userInfo.members[0].cust_id;
        user.name = userInfo.members[0].display_name;
        return user;
    }
}
exports.UserController = UserController;
//# sourceMappingURL=user_controller.js.map