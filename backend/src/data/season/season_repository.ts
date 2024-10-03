import { HttpClient } from "./../http_client"
import { LinkResponse } from "./../link_response"
import { SeasonResponse } from "./season_response"
import fs from "fs"

export class SeasonRepository {
  private static URL = "https://members-ng.iracing.com/data/series/seasons?include_series=true"

  constructor(private httpClient: HttpClient) {}

  async getSeasons(): Promise<SeasonResponse[]> {
    const response = await this.httpClient.get<LinkResponse>(SeasonRepository.URL)
    const season = await this.httpClient.get<SeasonResponse[]>(response.link)
    //fs.writeFileSync("downloaded/test-season-reponse.json", JSON.stringify(season, null, 2))
    return season
  }
}
