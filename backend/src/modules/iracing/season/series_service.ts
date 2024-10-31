import { HttpClient } from "data-utils"
import { SeriesResponse } from "./series_response"
import { SeriesApi } from "./series_api"

export class SeriesService {
  constructor(private httpClient: HttpClient, private api: SeriesApi) {}

  async getSeries(): Promise<SeriesResponse[]> {
    const requestLink = this.api.getSeriesLink().buildRequest()
    const link = await this.httpClient.request(requestLink)

    const requestClasses = this.api.getSeries(link.data.link).buildRequest()
    return (await this.httpClient.request(requestClasses)).data
  }
}
