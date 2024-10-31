import { DI } from "utils"
import { Express } from "express"
import { ServerConfiguration } from "backend/server_interface"
import { TestHttpClient } from "backend/test_utils/http_client"
import { SeasonApi } from "data/iracing/season/season_api"
import "../../dependency_injection"

const client = new TestHttpClient(DI.get(ServerConfiguration).app as Express, "/api/v1", "")

describe("IRacing Module", () => {
  const seasonApi = new SeasonApi()

  it("Should download the season and format it properly", async () => {
    const response = await client.api(seasonApi.get())
    expect(response).toBe(200)
  })
})
