import { DI } from "@alandoni/utils"
import { Interceptor, ResponseBody, RequestBody, BuiltRequest, ResponseWrapper } from "@alandoni/data-utils"
import { UserRepository } from "src/modules/iracing/user/user_repository"

export class IRacingHeadersInterceptor implements Interceptor {
  async executeBefore<Response extends ResponseBody, RequestBodyType extends RequestBody | undefined>(
    apiRequest: BuiltRequest<Response, RequestBodyType>,
  ): Promise<void> {
    const userRepository = DI.get(UserRepository)
    const parsedCookies = await userRepository.getStoredCookie()
    if (!apiRequest.headers) {
      apiRequest.headers = {}
    }
    apiRequest.headers["content-type"] = "application/json"
    if (!parsedCookies) {
      return
    }
    apiRequest.headers.cookie = parsedCookies
  }

  async executeAfter<T, Response extends ResponseWrapper<T>>(response: Response): Promise<Response> {
    if (!response.headers || !response.headers["set-cookie"] || !Array.isArray(response.headers["set-cookie"])) {
      return response
    }
    const userRepository = DI.get(UserRepository)
    const parsedCookies = await userRepository.getStoredCookie()
    if (parsedCookies) {
      return response
    }
    await userRepository.setStoredCookie(this.parseCookies(response.headers["set-cookie"]))
    return response
  }

  private parseCookies(raw: string[]): string {
    return raw
      .map((entry) => {
        const parts = entry.split(";")
        const cookiePart = parts[0]
        return cookiePart
      })
      .join(";")
  }
}
