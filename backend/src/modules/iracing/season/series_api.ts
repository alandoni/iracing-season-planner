import { ApiRequest, HttpMethod } from "@alandoni/data-utils"
import { LinkResponse } from "../link_response"
import { SeriesResponse } from "./series_response"

export class SeriesApi {
  public getSeriesLink(): ApiRequest<LinkResponse> {
    return new ApiRequest(HttpMethod.GET, "data/series/seasons?include_series=true", LinkResponse)
  }

  public getSeries(link: string): ApiRequest<SeriesResponse[]> {
    return new ApiRequest(HttpMethod.GET, link, SeriesResponse)
  }
}
