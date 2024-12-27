import { RequestApiConfig, ApiRequest, HttpMethod } from "@alandoni/data-utils"
import { User } from "./user"

export type GetUserParams = {
  id: number
  displayName: string
}

export class UserApi {
  url = "/user"

  getMemberInfo(): ApiRequest<User, never, RequestApiConfig<GetUserParams>> {
    return new ApiRequest(HttpMethod.GET, `/:id/:displayName`, User)
  }
}
