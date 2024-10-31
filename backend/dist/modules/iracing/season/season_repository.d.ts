import { CarRepository } from "../cars/car_repository";
import { LicenseRepository } from "../license/license_repository";
import { TrackRepository } from "../tracks/track_repository";
import { SeriesService } from "./series_service";
import { WinstonLogger } from "backend/logger/index";
import { Season } from "data/iracing/season/models/season";
export declare class SeasonRepository {
    private seriesService;
    private trackRepository;
    private carRepository;
    private licenseRepository;
    private logger;
    constructor(seriesService: SeriesService, trackRepository: TrackRepository, carRepository: CarRepository, licenseRepository: LicenseRepository, logger?: WinstonLogger);
    getSeason(): Promise<Season>;
    private fromSeriesReponseToSeries;
    private fromScheduleResponseToSchedule;
    private getScheduleCars;
    private sortByLicense;
    private sortLicenses;
    private getCarsOfTheSeason;
    private getTracksOfTheSeason;
    private getCategoriesOfTheSeason;
}
