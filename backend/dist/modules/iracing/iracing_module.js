"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IRacingModule = exports.IRacingHttpClient = void 0;
const utils_1 = require("utils");
const http_client_1 = require("../../data/http_client");
const ir_headers_interceptor_1 = require("./ir_headers_interceptor");
const car_api_1 = require("./cars/car_api");
const car_repository_1 = require("./cars/car_repository");
const car_service_1 = require("./cars/car_service");
const user_repository_1 = require("./user/user_repository");
const user_service_1 = require("./user/user_service");
const season_router_1 = require("./season_router");
const season_controller_1 = require("./season/season_controller");
const season_repository_1 = require("./season/season_repository");
const track_repository_1 = require("./tracks/track_repository");
const license_repository_1 = require("./license/license_repository");
const series_service_1 = require("./season/series_service");
const track_service_1 = require("./tracks/track_service");
const license_service_1 = require("./license/license_service");
const series_api_1 = require("./season/series_api");
const license_api_1 = require("./license/license_api");
const track_api_1 = require("./tracks/track_api");
const user_api_1 = require("./user/user_api");
const user_controller_1 = require("./user/user_controller");
const user_router_1 = require("./user/user_router");
const file_repository_1 = require("../../data/file_repository");
const season_api_1 = require("data/iracing/season/season_api");
const user_api_2 = require("data/iracing/user/user_api");
class IRacingHttpClient extends http_client_1.AxiosHttpClient {
    constructor() {
        super("https://members-ng.iracing.com/", [utils_1.DI.get(ir_headers_interceptor_1.IRacingHeadersInterceptor)]);
    }
}
exports.IRacingHttpClient = IRacingHttpClient;
class IRacingModule extends utils_1.DependencyInjectionModule {
    initialize() {
        return (di) => {
            di.factory(file_repository_1.FileRepository, () => new file_repository_1.FileRepository());
            di.factory(user_api_1.UserApi, () => new user_api_1.UserApi());
            di.factory(user_service_1.UserService, () => new user_service_1.UserService(di.get(IRacingHttpClient), di.get(user_api_1.UserApi)));
            di.factory(user_repository_1.UserRepository, () => new user_repository_1.UserRepository(di.get(user_service_1.UserService)));
            di.factory(user_controller_1.UserController, () => new user_controller_1.UserController(di.get(user_repository_1.UserRepository)));
            di.factory(user_api_2.UserApi, () => new user_api_2.UserApi());
            di.factory(user_router_1.UserRouter, () => new user_router_1.UserRouter(di.get(user_controller_1.UserController), di.get(user_api_2.UserApi)));
            di.factory(ir_headers_interceptor_1.IRacingHeadersInterceptor, () => new ir_headers_interceptor_1.IRacingHeadersInterceptor());
            di.factory(IRacingHttpClient, () => new IRacingHttpClient());
            di.factory(car_api_1.CarApi, () => new car_api_1.CarApi());
            di.factory(car_service_1.CarService, () => new car_service_1.CarService(di.get(IRacingHttpClient), di.get(car_api_1.CarApi)));
            di.factory(car_repository_1.CarRepository, () => new car_repository_1.CarRepository(di.get(car_service_1.CarService)));
            di.factory(track_api_1.TrackApi, () => new track_api_1.TrackApi());
            di.factory(track_service_1.TrackService, () => new track_service_1.TrackService(di.get(IRacingHttpClient), di.get(track_api_1.TrackApi)));
            di.factory(track_repository_1.TrackRepository, () => new track_repository_1.TrackRepository(di.get(track_service_1.TrackService)));
            di.factory(license_api_1.LicenseApi, () => new license_api_1.LicenseApi());
            di.factory(license_service_1.LicenseService, () => new license_service_1.LicenseService(di.get(IRacingHttpClient), di.get(license_api_1.LicenseApi)));
            di.factory(license_repository_1.LicenseRepository, () => new license_repository_1.LicenseRepository(di.get(license_service_1.LicenseService)));
            di.factory(series_api_1.SeriesApi, () => new series_api_1.SeriesApi());
            di.factory(series_service_1.SeriesService, () => new series_service_1.SeriesService(di.get(IRacingHttpClient), di.get(series_api_1.SeriesApi)));
            di.factory(season_repository_1.SeasonRepository, () => new season_repository_1.SeasonRepository(di.get(series_service_1.SeriesService), di.get(track_repository_1.TrackRepository), di.get(car_repository_1.CarRepository), di.get(license_repository_1.LicenseRepository)));
            di.factory(season_controller_1.SeasonController, () => new season_controller_1.SeasonController(di.get(season_repository_1.SeasonRepository), di.get(user_repository_1.UserRepository), di.get(file_repository_1.FileRepository)));
            di.factory(season_api_1.SeasonApi, () => new season_api_1.SeasonApi());
            di.factory(season_router_1.SeasonRouter, () => new season_router_1.SeasonRouter(di.get(season_controller_1.SeasonController), di.get(season_api_1.SeasonApi)));
        };
    }
    getEntities() {
        return [];
    }
    getRoutes() {
        return [utils_1.DI.get(season_router_1.SeasonRouter), utils_1.DI.get(user_router_1.UserRouter)];
    }
}
exports.IRacingModule = IRacingModule;
//# sourceMappingURL=iracing_module.js.map