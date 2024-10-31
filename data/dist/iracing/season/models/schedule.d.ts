import { Car } from "./car";
import { Category } from "./category";
import { TrackWithConfigName } from "./track";
export type Schedule = {
    raceWeekNum: number;
    cars: Car[];
    category: Category;
    startDate: Date;
    name: string;
    serieId: number;
    track: TrackWithConfigName;
};
