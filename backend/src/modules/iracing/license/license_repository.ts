import { LicenseResponse } from "./license_response"
import { License } from "racing-tools-data/iracing/season/models/license"
import { LicenseService } from "./license_service"

export class LicenseRepository {
  constructor(private licenseService: LicenseService) {}

  async getLicenses(): Promise<License[]> {
    const licenses = await this.licenseService.getLicenses()
    return licenses.map(this.fromLicenseResponseToLicense)
  }

  private fromLicenseResponseToLicense(license: LicenseResponse) {
    return {
      id: license.license_group,
      name: license.group_name,
      minRaces: license.min_num_races,
      minSr: license.min_sr_to_fast_track,
      letter: license.levels[0].license_letter,
      color: license.levels[0].color,
    }
  }
}
