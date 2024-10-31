"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LicenseRepository = void 0;
class LicenseRepository {
    licenseService;
    constructor(licenseService) {
        this.licenseService = licenseService;
    }
    async getLicenses() {
        const licenses = await this.licenseService.getLicenses();
        return licenses.map(this.fromLicenseResponseToLicense);
    }
    fromLicenseResponseToLicense(license) {
        return {
            id: license.license_group,
            name: license.group_name,
            minRaces: license.min_num_races,
            minSr: license.min_sr_to_fast_track,
            letter: license.levels[0].license_letter,
            color: license.levels[0].color,
        };
    }
}
exports.LicenseRepository = LicenseRepository;
//# sourceMappingURL=license_repository.js.map