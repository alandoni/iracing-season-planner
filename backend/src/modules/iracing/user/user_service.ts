import { HttpClient } from "@alandoni/data-utils"
import { LoginRequest } from "./login_request"
import { LoggedUserResponse } from "./logged_user_response"
import { MemberGetResponse } from "./member_get_response"
import { UserApi } from "./user_api"

export class UserService {
  constructor(private httpClient: HttpClient, private api: UserApi) {}

  async login(login: LoginRequest): Promise<unknown> {
    const request = this.api.postAuth().buildRequest({ body: login })
    return (await this.httpClient.request(request)).data
  }

  async getLoggedUser(): Promise<LoggedUserResponse> {
    const requestLink = this.api.getLoggedUserLink().buildRequest()
    const link = await this.httpClient.request(requestLink)

    const requestClasses = this.api.getLoggedUser(link.data.link).buildRequest()
    return (await this.httpClient.request(requestClasses)).data
  }

  async getUserInfo(userId: number): Promise<MemberGetResponse> {
    const requestLink = this.api
      .getMemberInfoLink()
      .buildRequest({ query: { cust_ids: userId, include_licenses: true } })
    const link = await this.httpClient.request(requestLink)

    const requestClasses = this.api.getMemberInfo(link.data.link).buildRequest()
    return (await this.httpClient.request(requestClasses)).data
  }
}
