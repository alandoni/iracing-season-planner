import { ApiConfig, ApiRequest, HttpMethod } from "data-utils"
import { LinkResponse } from "../link_response"
import { LoginRequest } from "./login_request"
import { LoggedUserResponse } from "./logged_user_response"
import { MemberGetResponse } from "./member_get_response"

type MemberGetQuery = {
  cust_ids: number
  include_licenses: boolean
}

export class UserApi {
  public postAuth(): ApiRequest<LinkResponse, LoginRequest> {
    return new ApiRequest(HttpMethod.POST, "auth", LinkResponse)
  }

  public getLoggedUserLink(): ApiRequest<LinkResponse> {
    return new ApiRequest(HttpMethod.GET, "data/member/info", LinkResponse)
  }

  public getLoggedUser(link: string): ApiRequest<LoggedUserResponse> {
    return new ApiRequest(HttpMethod.GET, link, LoggedUserResponse)
  }

  public getMemberInfoLink(): ApiRequest<LinkResponse, never, ApiConfig<never, MemberGetQuery>> {
    return new ApiRequest(HttpMethod.GET, "data/member/get", LinkResponse)
  }

  public getMemberInfo(link: string): ApiRequest<MemberGetResponse> {
    return new ApiRequest(HttpMethod.GET, link, MemberGetResponse)
  }
}
