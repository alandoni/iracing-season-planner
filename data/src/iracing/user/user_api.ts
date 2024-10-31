import { ApiConfig, ApiRequest, HttpMethod } from "data-utils"
import { User } from "./user"

export type GetUserParams = {
  id: number
  displayName: string
}

export class UserApi {
  url = '/user'
  
  getMemberInfo(): ApiRequest<User, never, ApiConfig<GetUserParams>> {
    return new ApiRequest(HttpMethod.GET, `/:id/:displayName`, User)
  }
}
