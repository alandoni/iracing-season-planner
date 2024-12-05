import { Season } from "./models/season"
import { ApiRequest, HttpMethod } from "@alandoni/data-utils"

export class SeasonApi {
  url = "season"

  constructor() {}

  get(): ApiRequest<Season> {
    return new ApiRequest(HttpMethod.GET, this.url, Season)
  }

  clearCache(): ApiRequest<Season> {
    return new ApiRequest(HttpMethod.GET, `${this.url}/clear-cache`, Season)
  }

  raw(): ApiRequest<string> {
    return new ApiRequest(HttpMethod.GET, `${this.url}/raw`, Season)
  }
}
