import { SeasonApi } from "racing-tools-data/iracing/season/season_api"
import { Season } from "racing-tools-data/iracing/season/models/season"
import { HttpClient } from "@alandoni/data-utils"

export class SeasonService {
  constructor(private httpClient: HttpClient, private seasonApi: SeasonApi) {}

  async getSeason(): Promise<Season> {
    const request = this.seasonApi.get().buildRequest()
    const season = (await this.httpClient.request(request)).data
    season.cachedDate = new Date(season.cachedDate)
    season.series.forEach((series) => {
      series.schedules.forEach((schedule) => {
        schedule.startDate = new Date(schedule.startDate)
      })
    })
    return season
  }

  async invalidateCache(): Promise<Season> {
    const request = this.seasonApi.clearCache().buildRequest()
    return (await this.httpClient.request(request)).data
  }
}
