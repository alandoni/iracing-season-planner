import { RequestWrapper } from "backend/controller/request_wrapper";
import { GetUserParams } from "data/iracing/user/user_api";
import { UserRepository } from "./user_repository";
import { User } from "data/iracing/user/user";
export declare class UserController {
    private userRepository;
    constructor(userRepository: UserRepository);
    getMemberInfo(req: RequestWrapper<never, GetUserParams>): Promise<User>;
}
