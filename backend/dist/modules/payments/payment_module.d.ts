import { DependencyInjection, DependencyInjectionModule } from "utils";
import { Routes } from "backend/routes/routes";
import { BackendModuleInterface } from "backend/backend_module_interface";
export declare class PaymentModule extends DependencyInjectionModule implements BackendModuleInterface {
    constructor();
    initialize(): (di: DependencyInjection) => void;
    getEntities(): unknown[];
    getRoutes(): Routes[];
}
