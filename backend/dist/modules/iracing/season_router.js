"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SeasonRouter = void 0;
const custom_router_1 = require("backend/routes/custom_router");
class SeasonRouter {
    seasonController;
    seasonApi;
    constructor(seasonController, seasonApi) {
        this.seasonController = seasonController;
        this.seasonApi = seasonApi;
    }
    use(router) {
        new custom_router_1.CustomRouter(router, this.seasonApi.url, this.seasonController)
            .api(this.seasonApi.get(), this.seasonController.getSeason)
            .api(this.seasonApi.raw(), this.seasonController.getRawSeason)
            .api(this.seasonApi.clearCache(), this.seasonController.downloadSeason);
    }
}
exports.SeasonRouter = SeasonRouter;
//# sourceMappingURL=season_router.js.map