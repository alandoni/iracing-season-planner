// import { DI } from "@alandoni/utils"
// import { Express } from "express"
// import { ServerConfiguration } from "@alandoni/backend/server_interface"
// import { SeasonApi } from "racing-tools-data/iracing/season/season_api"
// import "../../dependency_injection"
// import { TestHttpClient } from "@alandoni/backend/test_utils/http_client"
// import { WinstonLogger } from "@alandoni/backend/logger/index"
// import { SeasonController } from "./season/season_controller"

// describe("IRacing Module", () => {
//   let client: TestHttpClient
//   let seasonApi: SeasonApi
//   const mockedSeason = {
//     cachedDate: new Date(),
//     cars: [],
//     tracks: [],
//     categories: [],
//     licenses: [],
//     series: [],
//     quarter: 3,
//     year: 4,
//     validate: jest.fn(),
//   }

//   beforeAll(() => {
//     jest.spyOn(SeasonController.prototype, "getSeason").mockResolvedValue(mockedSeason)
//     const server = DI.get(ServerConfiguration)
//     // const address = await server.startServer()
//     const app = server.app as Express
//     client = new TestHttpClient(app, "/api/v1", "")
//     // const address = Object.values(app.listeners)[0].address
//     // const port = Object.values(app.listeners)[0].port
//     // DI.get(WinstonLogger).debug(`Connecting on ${address}:${port}`)
//     seasonApi = new SeasonApi()
//   })

//   it("Should download the season and format it properly", async () => {
//     const response = await client.api(seasonApi.get())
//     expect(response.status).toBe(200)

//     const expected: Partial<typeof mockedSeason> = {
//       ...mockedSeason,
//     }
//     delete expected.validate

//     expect(response.body).toMatchObject({
//       data: {
//         ...expected,
//         cachedDate: mockedSeason.cachedDate.toISOString(),
//       },
//     })
//   })

//   afterAll(async () => {
//     const server = DI.get(ServerConfiguration)

//     await server.closeServer()
//     DI.get(WinstonLogger).debug(`Finishing test`)
//   })
// })
