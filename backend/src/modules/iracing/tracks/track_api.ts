import { ApiRequest, HttpMethod } from "@alandoni/data-utils"
import { LinkResponse } from "../link_response"
import { TrackResponse } from "./track_response"

export class TrackApi {
  public getTrackLink(): ApiRequest<LinkResponse> {
    return new ApiRequest(HttpMethod.GET, "data/track/get", LinkResponse)
  }

  public getTrack(link: string): ApiRequest<TrackResponse[]> {
    return new ApiRequest(HttpMethod.GET, link, TrackResponse)
  }
}
