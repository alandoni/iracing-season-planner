"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SeriesApi = void 0;
const data_utils_1 = require("data-utils");
const link_response_1 = require("../link_response");
const series_response_1 = require("./series_response");
class SeriesApi {
    getSeriesLink() {
        return new data_utils_1.ApiRequest(data_utils_1.HttpMethod.GET, "data/series/seasons?include_series=true", link_response_1.LinkResponse);
    }
    getSeries(link) {
        return new data_utils_1.ApiRequest(data_utils_1.HttpMethod.GET, link, series_response_1.SeriesResponse);
    }
}
exports.SeriesApi = SeriesApi;
//# sourceMappingURL=series_api.js.map