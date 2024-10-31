import { Season } from "./models/season";
import { ApiRequest } from "data-utils";
export declare class SeasonApi {
    url: string;
    constructor();
    get(): ApiRequest<Season>;
    clearCache(): ApiRequest<Season>;
    raw(): ApiRequest<string>;
}
