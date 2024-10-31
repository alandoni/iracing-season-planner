"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LicenseService = void 0;
class LicenseService {
    httpClient;
    licenseApi;
    constructor(httpClient, licenseApi) {
        this.httpClient = httpClient;
        this.licenseApi = licenseApi;
    }
    async getLicenses() {
        const requestLink = this.licenseApi.getLicensesLink().buildRequest();
        const link = await this.httpClient.request(requestLink);
        const requestClasses = this.licenseApi.getLicenses(link.data.link).buildRequest();
        return (await this.httpClient.request(requestClasses)).data;
    }
}
exports.LicenseService = LicenseService;
//# sourceMappingURL=license_service.js.map