"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PublicRoute = void 0;
const path_1 = __importDefault(require("path"));
const express_1 = __importDefault(require("express"));
class PublicRoute {
    use(router) {
        const buildPath = process.env.NODE_ENV === "production" ? "../../" : "../../build";
        router.use(express_1.default.static(path_1.default.resolve(__dirname, buildPath)));
        router.get("/*", (_req, res) => {
            res.sendFile(path_1.default.resolve(__dirname, buildPath, "index.html"));
        });
    }
}
exports.PublicRoute = PublicRoute;
//# sourceMappingURL=public_routes.js.map