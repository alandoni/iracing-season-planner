"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserApi = void 0;
const data_utils_1 = require("data-utils");
const link_response_1 = require("../link_response");
const logged_user_response_1 = require("./logged_user_response");
const member_get_response_1 = require("./member_get_response");
class UserApi {
    postAuth() {
        return new data_utils_1.ApiRequest(data_utils_1.HttpMethod.POST, "auth", link_response_1.LinkResponse);
    }
    getLoggedUserLink() {
        return new data_utils_1.ApiRequest(data_utils_1.HttpMethod.GET, "data/member/info", link_response_1.LinkResponse);
    }
    getLoggedUser(link) {
        return new data_utils_1.ApiRequest(data_utils_1.HttpMethod.GET, link, logged_user_response_1.LoggedUserResponse);
    }
    getMemberInfoLink() {
        return new data_utils_1.ApiRequest(data_utils_1.HttpMethod.GET, "data/member/get", link_response_1.LinkResponse);
    }
    getMemberInfo(link) {
        return new data_utils_1.ApiRequest(data_utils_1.HttpMethod.GET, link, member_get_response_1.MemberGetResponse);
    }
}
exports.UserApi = UserApi;
//# sourceMappingURL=user_api.js.map