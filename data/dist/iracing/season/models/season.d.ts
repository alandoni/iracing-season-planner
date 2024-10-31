import { License } from "./license";
import { Track } from "./track";
import { Car } from "./car";
import { Series } from "./series";
import { Category } from "./category";
export declare class Season {
    static MAX_DAYS_TO_VALIDATE_CACHE: number;
    cachedDate: Date;
    cars: Car[];
    tracks: Track[];
    licenses: License[];
    series: Series[];
    categories: Category[];
    quarter: number;
    year: number;
    validate(): boolean;
}
