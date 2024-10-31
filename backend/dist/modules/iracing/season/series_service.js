"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SeriesService = void 0;
class SeriesService {
    httpClient;
    api;
    constructor(httpClient, api) {
        this.httpClient = httpClient;
        this.api = api;
    }
    async getSeries() {
        const requestLink = this.api.getSeriesLink().buildRequest();
        const link = await this.httpClient.request(requestLink);
        const requestClasses = this.api.getSeries(link.data.link).buildRequest();
        return (await this.httpClient.request(requestClasses)).data;
    }
}
exports.SeriesService = SeriesService;
//# sourceMappingURL=series_service.js.map