"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("utils");
const server_interface_1 = require("backend/server_interface");
const http_client_1 = require("backend/test_utils/http_client");
const season_api_1 = require("data/iracing/season/season_api");
require("../../index");
const client = new http_client_1.TestHttpClient(utils_1.DI.get(server_interface_1.ServerConfiguration).app, "/api/v1", "");
describe("IRacing Module", () => {
    const seasonApi = new season_api_1.SeasonApi();
    it("Should download the season and format it properly", async () => {
        const response = await client.api(seasonApi.get());
        expect(response).toBe(200);
    });
});
//# sourceMappingURL=iracing_module.test.js.map