"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoggedUserResponse = void 0;
const member_response_1 = require("./member_response");
class LoggedUserResponse extends member_response_1.MemberResponse {
    on_car_name;
    last_test_track;
    last_test_car;
    last_season;
    account;
    suit;
    car_packages;
    track_packages;
    other_owned_packages;
}
exports.LoggedUserResponse = LoggedUserResponse;
//# sourceMappingURL=logged_user_response.js.map