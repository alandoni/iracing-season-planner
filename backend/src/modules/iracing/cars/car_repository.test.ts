import { DI } from "utils"
import { UserRepository } from "../user/user_repository"
import { CarRepository } from "./car_repository"
import fs from "fs"
import "../../../dependency_injection"

describe("CarRepository", () => {
  const user = DI.get(UserRepository)
  const repo = DI.get(CarRepository)

  it("should get the cars", async () => {
    await user.login()
    const cars = await repo.getCars()
    fs.writeFileSync("downloaded/test-car.json", JSON.stringify(cars, null, 2), "utf8")
  })
})
