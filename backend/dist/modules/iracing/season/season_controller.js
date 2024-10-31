"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SeasonController = void 0;
const season_1 = require("data/iracing/season/models/season");
const utils_1 = require("utils");
const index_1 = require("backend/logger/index");
class SeasonController {
    seasonRepository;
    userRepository;
    fileRepository;
    logger;
    static DOWNLOAD_PATH = `downloaded`;
    static SEASON_FILE = `${SeasonController.DOWNLOAD_PATH}/file-season.json`;
    constructor(seasonRepository, userRepository, fileRepository, logger = utils_1.DI.get(index_1.WinstonLogger)) {
        this.seasonRepository = seasonRepository;
        this.userRepository = userRepository;
        this.fileRepository = fileRepository;
        this.logger = logger;
    }
    async invalidateCache() {
        return await this.fileRepository.removeFolder(SeasonController.DOWNLOAD_PATH);
    }
    async getRawSeason() {
        return await this.fileRepository.readFile(SeasonController.SEASON_FILE);
    }
    async getSeason() {
        const cache = await this.getCachedSeason();
        if (cache?.validate()) {
            this.logger.debug(`Using cache ${cache?.cachedDate}`);
            return cache;
        }
        else {
            this.logger.debug("Downloading season");
            return await this.downloadSeason();
        }
    }
    async getCachedSeason() {
        try {
            const file = await this.fileRepository.readFile(SeasonController.SEASON_FILE);
            const content = JSON.parse(file);
            content.cachedDate = new Date(content.cachedDate);
            content.series.forEach((s) => {
                s.schedules.forEach((sc) => {
                    sc.startDate = new Date(sc.startDate);
                });
            });
            return Object.assign(new season_1.Season(), content);
        }
        catch (error) {
            this.logger.error(error);
            return null;
        }
    }
    async downloadSeason() {
        const season = await this.buildSeason();
        if (!(await this.fileRepository.folderExist(SeasonController.DOWNLOAD_PATH))) {
            await this.fileRepository.createFolder("", SeasonController.DOWNLOAD_PATH);
        }
        await this.fileRepository.writeFile(SeasonController.SEASON_FILE, JSON.stringify(season, null, 2));
        return season;
    }
    async buildSeason() {
        try {
            await this.userRepository.login();
            return await this.seasonRepository.getSeason();
        }
        catch (error) {
            this.logger.error(error);
            throw error;
        }
    }
}
exports.SeasonController = SeasonController;
//# sourceMappingURL=season_controller.js.map