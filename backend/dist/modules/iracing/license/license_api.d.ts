import { ApiRequest } from "data-utils";
import { LinkResponse } from "../link_response";
import { LicenseResponse } from "./license_response";
export declare class LicenseApi {
    getLicensesLink(): ApiRequest<LinkResponse>;
    getLicenses(link: string): ApiRequest<LicenseResponse[]>;
}
