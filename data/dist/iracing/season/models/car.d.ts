import { License } from "./license";
import { Category } from "./category";
export declare class Car {
    id: number;
    dirpath: string;
    name: string;
    classes: {
        id: number;
        name: string;
    }[];
    abbreviation: string;
    types: string[];
    weight: number;
    hp: number;
    categories: Category[];
    forumUrl: string;
    free: boolean;
    headlights: boolean;
    price: number;
    rainEnabled: boolean;
    retired: boolean;
    licenses: License[];
    numberOfSeries: number;
    numberOfRaces: number;
    seriesIds: number[];
}
