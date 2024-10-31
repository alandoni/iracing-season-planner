import { Routes } from "backend/routes/routes";
import { UserController } from "./user_controller";
import { UserApi } from "data/iracing/user/user_api";
import { Router } from "backend/server_interface";
export declare class UserRouter implements Routes {
    private userController;
    private api;
    constructor(userController: UserController, api: UserApi);
    use(router: Router): void;
}
