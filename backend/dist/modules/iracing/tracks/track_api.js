"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TrackApi = void 0;
const data_utils_1 = require("data-utils");
const link_response_1 = require("../link_response");
const track_response_1 = require("./track_response");
class TrackApi {
    getTrackLink() {
        return new data_utils_1.ApiRequest(data_utils_1.HttpMethod.GET, "data/track/get", link_response_1.LinkResponse);
    }
    getTrack(link) {
        return new data_utils_1.ApiRequest(data_utils_1.HttpMethod.GET, link, track_response_1.TrackResponse);
    }
}
exports.TrackApi = TrackApi;
//# sourceMappingURL=track_api.js.map