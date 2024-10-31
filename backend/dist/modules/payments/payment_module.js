"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentModule = void 0;
const file_repository_1 = require("../../data/file_repository");
const http_client_1 = require("../../data/http_client");
const utils_1 = require("utils");
const mp_headers_interceptor_1 = require("./mp_headers_interceptor");
const payment_api_1 = require("data/payment/payment_api");
const payment_service_1 = require("./payment_service");
const payment_repository_1 = require("./payment_repository");
const payment_controller_1 = require("./payment_controller");
const mp_payment_api_1 = require("./mp_payment_api");
const payment_router_1 = require("./payment_router");
class MPHttpClient extends http_client_1.AxiosHttpClient {
    constructor() {
        super("https://api.mercadopago.com/v1/", [utils_1.DI.get(mp_headers_interceptor_1.MPHeadersInterceptor)]);
    }
}
class PaymentModule extends utils_1.DependencyInjectionModule {
    constructor() {
        super();
    }
    initialize() {
        return (di) => {
            di.factory(file_repository_1.FileRepository, () => new file_repository_1.FileRepository());
            di.factory(payment_api_1.PaymentApi, () => new payment_api_1.PaymentApi());
            di.factory(mp_payment_api_1.MPPaymentApi, () => new mp_payment_api_1.MPPaymentApi());
            di.factory(payment_service_1.PaymentService, () => new payment_service_1.PaymentService(di.get(MPHttpClient), di.get(mp_payment_api_1.MPPaymentApi)));
            di.factory(payment_repository_1.PaymentRepository, () => new payment_repository_1.PaymentRepository(di.get(payment_service_1.PaymentService)));
            di.factory(mp_headers_interceptor_1.MPHeadersInterceptor, () => new mp_headers_interceptor_1.MPHeadersInterceptor());
            di.factory(MPHttpClient, () => new MPHttpClient());
            di.factory(payment_controller_1.PaymentController, () => new payment_controller_1.PaymentController(di.get(payment_repository_1.PaymentRepository)));
            di.factory(payment_router_1.PaymentRouter, () => new payment_router_1.PaymentRouter(di.get(payment_controller_1.PaymentController), di.get(payment_api_1.PaymentApi)));
        };
    }
    getEntities() {
        return [];
    }
    getRoutes() {
        return [utils_1.DI.get(payment_router_1.PaymentRouter)];
    }
}
exports.PaymentModule = PaymentModule;
//# sourceMappingURL=payment_module.js.map