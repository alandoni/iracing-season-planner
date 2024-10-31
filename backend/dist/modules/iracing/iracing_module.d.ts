import { DependencyInjectionModule, DependencyInjection } from "utils";
import { AxiosHttpClient } from "../../data/http_client";
import { BackendModuleInterface } from "backend/backend_module_interface";
import { Routes } from "backend/routes/routes";
export declare class IRacingHttpClient extends AxiosHttpClient {
    constructor();
}
export declare class IRacingModule extends DependencyInjectionModule implements BackendModuleInterface {
    initialize(): (di: DependencyInjection) => void;
    getEntities(): unknown[];
    getRoutes(): Routes[];
}
