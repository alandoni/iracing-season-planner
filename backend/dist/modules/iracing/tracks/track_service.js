"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TrackService = void 0;
class TrackService {
    httpClient;
    api;
    constructor(httpClient, api) {
        this.httpClient = httpClient;
        this.api = api;
    }
    async getTracks() {
        const requestLink = this.api.getTrackLink().buildRequest();
        const link = await this.httpClient.request(requestLink);
        const requestClasses = this.api.getTrack(link.data.link).buildRequest();
        return (await this.httpClient.request(requestClasses)).data;
    }
}
exports.TrackService = TrackService;
//# sourceMappingURL=track_service.js.map