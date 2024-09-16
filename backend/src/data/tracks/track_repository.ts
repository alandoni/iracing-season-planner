import { HttpClient } from "../http_client"
import { TrackResponse } from "./track_response"
import { LinkResponse } from "../link_response"
import { Track } from "data/track"
import { formatCategory } from "data/category"

export class TrackRepository {
  private static URL = "https://members-ng.iracing.com/data/track/get"
  private static NURBURGRING_COMBINED_NEW_ID = 999999

  constructor(private httpClient: HttpClient) {}

  async getTracks(): Promise<Track[]> {
    const response = await this.httpClient.get<LinkResponse>(TrackRepository.URL)
    const tracks = await this.httpClient.get<TrackResponse[]>(response.link)
    return tracks.reduce((acc, track) => {
      if (track.sku === 0 && track.config_name.includes("Gesamtstrecke")) {
        track.sku = TrackRepository.NURBURGRING_COMBINED_NEW_ID
      }
      const found = acc.findIndex((t) => {
        return track.sku === t.id
      })
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
        const categoryName = formatCategory(track.category)
        acc.push({
          category: categoryName,
          categoryId: track.category_id,
          categories: [],
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
          licenses: [],
          numberOfRaces: 0,
          numberOfSeries: 0,
          seriesIds: [],
        })
      }

      return acc
    }, new Array<Track>())
  }
}
