import { ApiConfig, ApiRequest } from "data-utils";
import { LinkResponse } from "../link_response";
import { LoginRequest } from "./login_request";
import { LoggedUserResponse } from "./logged_user_response";
import { MemberGetResponse } from "./member_get_response";
type MemberGetQuery = {
    cust_ids: number;
    include_licenses: boolean;
};
export declare class UserApi {
    postAuth(): ApiRequest<LinkResponse, LoginRequest>;
    getLoggedUserLink(): ApiRequest<LinkResponse>;
    getLoggedUser(link: string): ApiRequest<LoggedUserResponse>;
    getMemberInfoLink(): ApiRequest<LinkResponse, never, ApiConfig<never, MemberGetQuery>>;
    getMemberInfo(link: string): ApiRequest<MemberGetResponse>;
}
export {};
