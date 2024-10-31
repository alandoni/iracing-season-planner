"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("utils");
const user_repository_1 = require("./user_repository");
const fs_1 = require("fs");
require("../../../index");
describe("UserRepository", () => {
    const repo = utils_1.DI.get(user_repository_1.UserRepository);
    it("should encrypt correctly", () => {
        const result = repo.encriptLogin({
            email: "CLunky@iracing.Com",
            password: "MyPassWord",
        });
        expect(result.password).toStrictEqual("xGKecAR27ALXNuMLsGaG0v5Q9pSs2tZTZRKNgmHMg+Q=");
    });
    it("should login correctly", async () => {
        const response = await repo.login();
        expect(response).not.toBeNull();
    });
    it("should get member info correctly", async () => {
        const response = await repo.getLoggedUser();
        await fs_1.promises.writeFile("downloaded/test-member-info.json", JSON.stringify(response, null, 2), "utf8");
    }, 5000);
    it("should get info from other user correctly", async () => {
        const response = await repo.getUserInfo(972648);
        await fs_1.promises.writeFile("downloaded/test-member-get.json", JSON.stringify(response, null, 2), "utf8");
    }, 5000);
});
//# sourceMappingURL=user_repository.test.js.map