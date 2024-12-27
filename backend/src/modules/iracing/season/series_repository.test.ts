// import { UserRepository } from "../user/user_repository"
// import { HttpClient } from "data/http_client"
// import { SeasonRepository } from "./season_repository"
// import fs from "fs"

// describe("SeasonRepository", () => {
//   const httpClient = new HttpClient()
//   const user = new UserRepository(httpClient)
//   const repo = new SeasonRepository(httpClient)

//   it("should get the season", async () => {
//     await user.login()
//     const season = await repo.getSeasons()
//     fs.writeFileSync("downloaded/test-season.json", JSON.stringify(season, null, 2), "utf8")
//   }, 20000)
// })

it("t", () => {
  expect(2).toBe(1 + 1)
})
