import { HttpClient } from "data/http_client"
import { LinkResponse } from "data/link_response"
import { LicenseResponse } from "./license_response"
import { License } from "./license"

export class LicenseRepository {
  static URL = "https://members-ng.iracing.com/data/lookup/licenses"

  constructor(private httpClient: HttpClient) {}

  async getLicenses(): Promise<License[]> {
    const response = await this.httpClient.get<LinkResponse>(LicenseRepository.URL)
    const licenses = await this.httpClient.get<LicenseResponse[]>(response.link)
    return licenses.map((license) => ({
      id: license.license_group,
      name: license.group_name,
      minRaces: license.min_num_races,
      minSr: license.min_sr_to_fast_track,
      letter: license.levels[0].license_letter,
      color: license.levels[0].color,
    }))
  }
}
