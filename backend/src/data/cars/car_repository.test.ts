import { UserRepository } from "../user/user_repository"
import { HttpClient } from "data/http_client"
import { CarRepository } from "data/cars/car_repository"
import fs from "fs"

describe("CarRepository", () => {
  const httpClient = new HttpClient()
  const user = new UserRepository(httpClient)
  const repo = new CarRepository(httpClient)

  it("should get the cars", async () => {
    await user.login()
    const cars = await repo.getCars()
    fs.writeFileSync("downloaded/test-car.json", JSON.stringify(cars, null, 2), "utf8")
  })
})
