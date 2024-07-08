import { UserRepository } from "../user/user_repository"
import { HttpClient } from "data/http_client"
import { LicenseRepository } from "./license_repository"
import fs from "fs"

describe("LicenseRepository", () => {
  const httpClient = new HttpClient()
  const user = new UserRepository(httpClient)
  const repo = new LicenseRepository(httpClient)

  it("should get the licenses", async () => {
    await user.login()
    const licenses = await repo.getLicenses()
    fs.writeFileSync("downloaded/test-license.json", JSON.stringify(licenses, null, 2), "utf8")
  })
})
