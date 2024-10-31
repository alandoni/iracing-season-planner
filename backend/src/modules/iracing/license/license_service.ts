import { HttpClient } from "data-utils"
import { LicenseApi } from "./license_api"
import { LicenseResponse } from "./license_response"

export class LicenseService {
  constructor(private httpClient: HttpClient, private licenseApi: LicenseApi) {}

  async getLicenses(): Promise<LicenseResponse[]> {
    const requestLink = this.licenseApi.getLicensesLink().buildRequest()
    const link = await this.httpClient.request(requestLink)

    const requestClasses = this.licenseApi.getLicenses(link.data.link).buildRequest()
    return (await this.httpClient.request(requestClasses)).data
  }
}
