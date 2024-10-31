import { Routes } from "backend/routes/routes";
import { SeasonController } from "./season/season_controller";
import { SeasonApi } from "data/iracing/season/season_api";
import { Router } from "backend/server_interface";
export declare class SeasonRouter implements Routes {
    private seasonController;
    private seasonApi;
    constructor(seasonController: SeasonController, seasonApi: SeasonApi);
    use(router: Router): void;
}
