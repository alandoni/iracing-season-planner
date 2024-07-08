import { HttpClient } from "./../http_client"
import { LinkResponse } from "./../link_response"
import { SeasonResponse } from "./season_response"

export class SeasonRepository {
  private static URL = "https://members-ng.iracing.com/data/series/seasons?include_series=true"

  constructor(private httpClient: HttpClient) {}

  async getSeasons(): Promise<SeasonResponse[]> {
    const response = await this.httpClient.get<LinkResponse>(SeasonRepository.URL)
    return await this.httpClient.get<SeasonResponse[]>(response.link)
  }
}
