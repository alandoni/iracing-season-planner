"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CarService = void 0;
class CarService {
    httpClient;
    carApi;
    constructor(httpClient, carApi) {
        this.httpClient = httpClient;
        this.carApi = carApi;
    }
    async getCarClasses() {
        const requestLink = this.carApi.getCarClassesLink().buildRequest();
        const link = await this.httpClient.request(requestLink);
        const requestClasses = this.carApi.getCarClasses(link.data.link).buildRequest();
        return (await this.httpClient.request(requestClasses)).data;
    }
    async getCars() {
        const requestLink = this.carApi.getCarsLink().buildRequest();
        const link = await this.httpClient.request(requestLink);
        const requestClasses = this.carApi.getCars(link.data.link).buildRequest();
        return (await this.httpClient.request(requestClasses)).data;
    }
}
exports.CarService = CarService;
//# sourceMappingURL=car_service.js.map