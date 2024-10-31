import { Season } from "data/iracing/season/models/season";
import { SeasonRepository } from "./season_repository";
import { UserRepository } from "../../../modules/iracing/user/user_repository";
import { FileRepository } from "../../../data/file_repository";
import { Logger } from "utils";
export declare class SeasonController {
    private seasonRepository;
    private userRepository;
    private fileRepository;
    private logger;
    static DOWNLOAD_PATH: string;
    static SEASON_FILE: string;
    constructor(seasonRepository: SeasonRepository, userRepository: UserRepository, fileRepository: FileRepository, logger?: Logger);
    invalidateCache(): Promise<void>;
    getRawSeason(): Promise<string>;
    getSeason(): Promise<Season>;
    private getCachedSeason;
    downloadSeason(): Promise<Season>;
    private buildSeason;
}
