import { sha256 } from "js-sha256"
import { HttpClient } from "../http_client"
import { LinkResponse } from "../link_response"
import { LoginRequest } from "./login_request"
import { LoggedUserResponse } from "./logged_user_response"
import { MemberGetResponse } from "./member_get_response"
import "dotenv/config"

export class UserRepository {
  private static URL = "https://members-ng.iracing.com/auth"
  private static MEMBER_INFO = "https://members-ng.iracing.com/data/member/info"
  private static MEMBER_GET = "https://members-ng.iracing.com/data/member/get?cust_ids={id}&include_licenses=true"

  constructor(private httpClient: HttpClient) {}

  encriptLogin(login: LoginRequest) {
    const hash = sha256(`${login.password}${login.email.toLowerCase()}`)
    const newPassword = Buffer.from(hash, "hex").toString("base64")
    return { email: login.email, password: newPassword }
  }

  async login() {
    const loginRequest = this.encriptLogin({
      email: process.env.IRACING_EMAIL,
      password: process.env.IRACING_PASSWORD,
    })
    return await this.httpClient.post(UserRepository.URL, loginRequest)
  }

  async getLoggedUser(): Promise<LoggedUserResponse> {
    const response = await this.httpClient.get<LinkResponse>(UserRepository.MEMBER_INFO)
    return await this.httpClient.get<LoggedUserResponse>(response.link)
  }

  async getUserInfo(userId: number): Promise<MemberGetResponse> {
    const response = await this.httpClient.get<LinkResponse>(
      UserRepository.MEMBER_GET.replace("{id}", userId.toString()),
    )
    return await this.httpClient.get<MemberGetResponse>(response.link)
  }
}
