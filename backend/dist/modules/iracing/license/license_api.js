"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LicenseApi = void 0;
const data_utils_1 = require("data-utils");
const link_response_1 = require("../link_response");
const license_response_1 = require("./license_response");
class LicenseApi {
    getLicensesLink() {
        return new data_utils_1.ApiRequest(data_utils_1.HttpMethod.GET, "data/lookup/licenses", link_response_1.LinkResponse);
    }
    getLicenses(link) {
        return new data_utils_1.ApiRequest(data_utils_1.HttpMethod.GET, link, license_response_1.LicenseResponse);
    }
}
exports.LicenseApi = LicenseApi;
//# sourceMappingURL=license_api.js.map