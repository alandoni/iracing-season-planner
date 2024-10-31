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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AxiosHttpClient = void 0;
const axios_1 = __importStar(require("axios"));
const data_utils_1 = require("data-utils");
class AxiosHttpClient extends data_utils_1.HttpClient {
    constructor(url, interceptors) {
        super(url, interceptors);
    }
    async fetch(url, config) {
        try {
            console.log(url, config.method.toString(), config.headers);
            const response = await axios_1.default.request({
                url,
                data: config.body,
                method: config.method.toString(),
                headers: config.headers,
            });
            console.log(response.headers);
            return response;
        }
        catch (error) {
            throw this.printableError(error);
        }
    }
    printableError(error) {
        if (!(error instanceof axios_1.AxiosError)) {
            return error;
        }
        return {
            name: error.name,
            code: error.code,
            request: {
                headers: error.config?.headers,
                method: error.config?.method,
                url: error.config?.url,
                body: JSON.parse(error.config?.data ?? "null"),
            },
            response: {
                status: error.response?.status,
                statusText: error.response?.statusText,
                headers: error.response?.headers,
                data: error.response?.data,
            },
        };
    }
}
exports.AxiosHttpClient = AxiosHttpClient;
//# sourceMappingURL=http_client.js.map