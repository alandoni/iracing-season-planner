import { Category } from "./category";
export declare class Schedule {
    raceWeekNum: number;
    cars: number[];
    category: Category;
    startDate: Date;
    name: string;
    serieId: number;
    track: {
        id: number;
        configName: string;
    };
}
