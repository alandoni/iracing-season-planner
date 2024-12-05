import { RequestWrapper } from "@alandoni/backend/controller/request_wrapper"
import { GetUserParams } from "racing-tools-data/iracing/user/user_api"
import { User } from "racing-tools-data/iracing/user/user"
import { UserRepository } from "./user_repository"
import { AuthError } from "@alandoni/data-utils"

export class UserController {
  constructor(private userRepository: UserRepository) {}

  async getMemberInfo(req: RequestWrapper<never, GetUserParams>) {
    const id = req.params.id
    const name = req.params.displayName
    const userInfo = await this.userRepository.getUserInfo(id)

    if (userInfo.members[0].display_name !== name) {
      throw new AuthError("Unauthorized", AuthError.NOT_ALLOWED_TO_PERFORM_ACTION)
    }

    const user = new User()
    user.id = userInfo.members[0].cust_id
    user.name = userInfo.members[0].display_name
    return user
  }
}
