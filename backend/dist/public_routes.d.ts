import { Routes } from "backend/routes/routes";
import { Router } from "backend/server_interface";
export declare class PublicRoute implements Routes {
    use(router: Router): void;
}
