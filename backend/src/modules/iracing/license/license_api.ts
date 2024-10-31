import { ApiRequest, HttpMethod } from "data-utils"
import { LinkResponse } from "../link_response"
import { LicenseResponse } from "./license_response"

export class LicenseApi {
  public getLicensesLink(): ApiRequest<LinkResponse> {
    return new ApiRequest(HttpMethod.GET, "data/lookup/licenses", LinkResponse)
  }

  public getLicenses(link: string): ApiRequest<LicenseResponse[]> {
    return new ApiRequest(HttpMethod.GET, link, LicenseResponse)
  }
}
