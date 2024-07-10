import { HttpClient } from "../http_client"
import { TrackResponse } from "./track_response"
import { LinkResponse } from "../link_response"
import { Track } from "./track"
import { formatCategory } from "data/season/category"

export class TrackRepository {
  private static URL = "https://members-ng.iracing.com/data/track/get"

  constructor(private httpClient: HttpClient) {}

  async getTracks(): Promise<Track[]> {
    const response = await this.httpClient.get<LinkResponse>(TrackRepository.URL)
    const tracks = await this.httpClient.get<TrackResponse[]>(response.link)
    return tracks.reduce((acc, track) => {
      const found = acc.findIndex((t) => track.sku === t.id)
      const config = {
        name: track.config_name,
        closes: track.closes,
        opens: track.opens,
        id: track.track_id,
        dirpath: track.track_dirpath,
        length: track.track_config_length,
        corners: track.corners_per_lap,
      }
      if (found > -1) {
        acc[found].configs.push(config)
      } else {
        acc.push({
          category: formatCategory(track.category),
          categoryId: track.category_id,
          location: track.location,
          maxCars: track.max_cars,
          name: track.track_name,
          free: track.price === 0,
          price: track.price,
          retired: track.retired,
          url: track.site_url,
          id: track.sku,
          types: track.track_types.map((type) => type.track_type),
          rainEnabled: track.rain_enabled,
          configs: [config],
        })
      }

      return acc
    }, [])
  }
}
