import { sha256 } from "js-sha256"
import { LoginRequest } from "./login_request"
import { LoggedUserResponse } from "./logged_user_response"
import { MemberGetResponse } from "./member_get_response"
import { UserService } from "./user_service"
import "dotenv/config"

export class UserRepository {
  private static cookie: string | null

  constructor(private userService: UserService) {}

  encriptLogin(login: LoginRequest) {
    const hash = sha256(`${login.password}${login.email.toLowerCase()}`)
    const newPassword = Buffer.from(hash, "hex").toString("base64")
    return { email: login.email, password: newPassword }
  }

  async login() {
    const loginRequest = this.encriptLogin({
      email: process.env.IRACING_EMAIL ?? "",
      password: process.env.IRACING_PASSWORD ?? "",
    })
    return await this.userService.login(loginRequest)
  }

  async getLoggedUser(): Promise<LoggedUserResponse> {
    return await this.userService.getLoggedUser()
  }

  async getUserInfo(userId: number): Promise<MemberGetResponse> {
    return await this.userService.getUserInfo(userId)
  }

  async getStoredCookie(): Promise<string | null> {
    return await Promise.resolve(UserRepository.cookie)
  }

  async setStoredCookie(cookie: string): Promise<void> {
    UserRepository.cookie = cookie
    return await Promise.resolve()
  }
}
