"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
class UserService {
    httpClient;
    api;
    constructor(httpClient, api) {
        this.httpClient = httpClient;
        this.api = api;
    }
    async login(login) {
        const request = this.api.postAuth().buildRequest({ body: login });
        return (await this.httpClient.request(request)).data;
    }
    async getLoggedUser() {
        const requestLink = this.api.getLoggedUserLink().buildRequest();
        const link = await this.httpClient.request(requestLink);
        const requestClasses = this.api.getLoggedUser(link.data.link).buildRequest();
        return (await this.httpClient.request(requestClasses)).data;
    }
    async getUserInfo(userId) {
        const requestLink = this.api
            .getMemberInfoLink()
            .buildRequest({ query: { cust_ids: userId, include_licenses: true } });
        const link = await this.httpClient.request(requestLink);
        const requestClasses = this.api.getMemberInfo(link.data.link).buildRequest();
        return (await this.httpClient.request(requestClasses)).data;
    }
}
exports.UserService = UserService;
//# sourceMappingURL=user_service.js.map