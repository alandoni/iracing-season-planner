import { HttpClient } from "data-utils"
import { TrackResponse } from "./track_response"
import { TrackApi } from "./track_api"

export class TrackService {
  constructor(private httpClient: HttpClient, private api: TrackApi) {}

  async getTracks(): Promise<TrackResponse[]> {
    const requestLink = this.api.getTrackLink().buildRequest()
    const link = await this.httpClient.request(requestLink)

    const requestClasses = this.api.getTrack(link.data.link).buildRequest()
    return (await this.httpClient.request(requestClasses)).data
  }
}
