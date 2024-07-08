import { UserRepository } from "../user/user_repository"
import { HttpClient } from "data/http_client"
import { TrackRepository } from "data/tracks/track_repository"
import fs from "fs"

describe("TrackRepository", () => {
  const httpClient = new HttpClient()
  const user = new UserRepository(httpClient)
  const repo = new TrackRepository(httpClient)

  it("should get the tracks", async () => {
    await user.login()
    const tracks = await repo.getTracks()
    fs.writeFileSync("generated/test-track.json", JSON.stringify(tracks, null, 2), "utf8")
  })
})
