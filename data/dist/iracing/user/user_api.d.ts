import { ApiConfig, ApiRequest } from "data-utils";
import { User } from "./user";
export type GetUserParams = {
    id: number;
    displayName: string;
};
export declare class UserApi {
    url: string;
    getMemberInfo(): ApiRequest<User, never, ApiConfig<GetUserParams>>;
}
