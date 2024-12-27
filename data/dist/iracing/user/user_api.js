"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserApi = void 0;
const data_utils_1 = require("@alandoni/data-utils");
const user_1 = require("./user");
class UserApi {
    url = "/user";
    getMemberInfo() {
        return new data_utils_1.ApiRequest(data_utils_1.HttpMethod.GET, `/:id/:displayName`, user_1.User);
    }
}
exports.UserApi = UserApi;
//# sourceMappingURL=user_api.js.map