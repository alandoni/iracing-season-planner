import { DI } from "@alandoni/utils"
import { UserRepository } from "./user_repository"
import { promises as fs } from "fs"
import "../../../dependency_injection"

xdescribe("UserRepository", () => {
  const repo = DI.get(UserRepository)

  it("should encrypt correctly", () => {
    const result = repo.encriptLogin({
      email: "CLunky@iracing.Com",
      password: "MyPassWord",
    })
    expect(result.password).toStrictEqual("xGKecAR27ALXNuMLsGaG0v5Q9pSs2tZTZRKNgmHMg+Q=")
  })

  it("should login correctly", async () => {
    const response = await repo.login()
    expect(response).not.toBeNull()
  })

  it("should get member info correctly", async () => {
    const response = await repo.getLoggedUser()
    await fs.writeFile("downloaded/test-member-info.json", JSON.stringify(response, null, 2), "utf8")
  }, 5000)

  it("should get info from other user correctly", async () => {
    const response = await repo.getUserInfo(972648)
    await fs.writeFile("downloaded/test-member-get.json", JSON.stringify(response, null, 2), "utf8")
  }, 5000)
})
