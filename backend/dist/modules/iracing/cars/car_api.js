"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CarApi = void 0;
const data_utils_1 = require("data-utils");
const link_response_1 = require("../link_response");
const car_response_1 = require("./car_response");
const car_class_response_1 = require("./car_class_response");
class CarApi {
    getCarsLink() {
        return new data_utils_1.ApiRequest(data_utils_1.HttpMethod.GET, "data/car/get", link_response_1.LinkResponse);
    }
    getCars(link) {
        return new data_utils_1.ApiRequest(data_utils_1.HttpMethod.GET, link, car_response_1.CarResponse);
    }
    getCarClassesLink() {
        return new data_utils_1.ApiRequest(data_utils_1.HttpMethod.GET, "data/carclass/get", link_response_1.LinkResponse);
    }
    getCarClasses(link) {
        return new data_utils_1.ApiRequest(data_utils_1.HttpMethod.GET, link, car_class_response_1.CarClassResponse);
    }
}
exports.CarApi = CarApi;
//# sourceMappingURL=car_api.js.map