import { License } from "data/iracing/season/models/license";
import { LicenseService } from "./license_service";
export declare class LicenseRepository {
    private licenseService;
    constructor(licenseService: LicenseService);
    getLicenses(): Promise<License[]>;
    private fromLicenseResponseToLicense;
}
