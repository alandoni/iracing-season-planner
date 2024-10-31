import { HttpClient } from "data-utils";
import { LicenseApi } from "./license_api";
import { LicenseResponse } from "./license_response";
export declare class LicenseService {
    private httpClient;
    private licenseApi;
    constructor(httpClient: HttpClient, licenseApi: LicenseApi);
    getLicenses(): Promise<LicenseResponse[]>;
}
