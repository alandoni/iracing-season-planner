import { LoginRequest } from "./login_request";
import { LoggedUserResponse } from "./logged_user_response";
import { MemberGetResponse } from "./member_get_response";
import { UserService } from "./user_service";
import "dotenv/config";
export declare class UserRepository {
    private userService;
    private static cookie;
    constructor(userService: UserService);
    encriptLogin(login: LoginRequest): {
        email: string;
        password: string;
    };
    login(): Promise<unknown>;
    getLoggedUser(): Promise<LoggedUserResponse>;
    getUserInfo(userId: number): Promise<MemberGetResponse>;
    getStoredCookie(): Promise<string | null>;
    setStoredCookie(cookie: string): Promise<void>;
}
