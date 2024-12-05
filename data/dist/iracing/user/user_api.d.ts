import { RequestApiConfig, ApiRequest } from "@alandoni/data-utils";
import { User } from "./user";
export type GetUserParams = {
    id: number;
    displayName: string;
};
export declare class UserApi {
    url: string;
    getMemberInfo(): ApiRequest<User, never, RequestApiConfig<GetUserParams>>;
}
