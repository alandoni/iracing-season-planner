import { HttpClient } from "data-utils";
import { LoginRequest } from "./login_request";
import { LoggedUserResponse } from "./logged_user_response";
import { MemberGetResponse } from "./member_get_response";
import { UserApi } from "./user_api";
export declare class UserService {
    private httpClient;
    private api;
    constructor(httpClient: HttpClient, api: UserApi);
    login(login: LoginRequest): Promise<unknown>;
    getLoggedUser(): Promise<LoggedUserResponse>;
    getUserInfo(userId: number): Promise<MemberGetResponse>;
}
