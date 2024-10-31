"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SeasonApi = void 0;
const season_1 = require("./models/season");
const data_utils_1 = require("data-utils");
class SeasonApi {
    url = "season";
    constructor() { }
    get() {
        return new data_utils_1.ApiRequest(data_utils_1.HttpMethod.GET, this.url, season_1.Season);
    }
    clearCache() {
        return new data_utils_1.ApiRequest(data_utils_1.HttpMethod.GET, `${this.url}/clear-cache`, season_1.Season);
    }
    raw() {
        return new data_utils_1.ApiRequest(data_utils_1.HttpMethod.GET, `${this.url}/raw`, season_1.Season);
    }
}
exports.SeasonApi = SeasonApi;
//# sourceMappingURL=season_api.js.map