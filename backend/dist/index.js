"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importStar(require("express"));
const path_1 = __importDefault(require("path"));
const dotenv = __importStar(require("dotenv"));
dotenv.config({ path: path_1.default.resolve(__dirname, "../.env") });
const server_interface_1 = require("backend/server_interface");
const index_1 = require("backend/logger/index");
const utils_1 = require("utils");
const iracing_module_1 = require("./modules/iracing/iracing_module");
const payment_module_1 = require("./modules/payments/payment_module");
const body_parser_1 = require("body-parser");
const cors_1 = __importDefault(require("cors"));
const season_controller_1 = require("./modules/iracing/season/season_controller");
const public_routes_1 = require("./public_routes");
const modules = [new iracing_module_1.IRacingModule(), new payment_module_1.PaymentModule()];
utils_1.DependencyInjection.initialize((di) => {
    di.factory(index_1.WinstonLogger, () => new index_1.WinstonLogger());
    di.factory(public_routes_1.PublicRoute, () => new public_routes_1.PublicRoute());
    di.factory(server_interface_1.ServerConfiguration, () => {
        const app = (0, express_1.default)();
        app.use((0, cors_1.default)());
        app.use((0, body_parser_1.json)());
        const version = "/api/v1";
        const port = Number(process.env.PORT) ?? 3001;
        app.listen;
        const appConfiguration = new server_interface_1.ServerConfiguration(app, express_1.Router, port, utils_1.DI.get(index_1.WinstonLogger));
        appConfiguration.setRoutes(version, [...modules.flatMap((m) => m.getRoutes()), utils_1.DI.get(public_routes_1.PublicRoute)]);
        appConfiguration.startServer().then(async (address) => {
            const logger = utils_1.DI.get(index_1.WinstonLogger);
            logger.info(`Downloading latest info`);
            try {
                await utils_1.DI.get(season_controller_1.SeasonController).getSeason();
                logger.info("Latest info downloaded and cached");
                logger.info(`Running on: ${process.env.NODE_ENV ?? "dev"}, on: ${address}`);
            }
            catch (error) {
                logger.error(error);
            }
        });
        return appConfiguration;
    });
    di.modules(...modules);
});
//# sourceMappingURL=index.js.map