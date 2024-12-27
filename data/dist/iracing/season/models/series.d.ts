import { License } from "./license";
import { Schedule } from "./schedule";
export declare class Series {
    id: number;
    name: string;
    licenses: License[];
    fixedSetup: boolean;
    maxWeeks: number;
    multiclass: boolean;
    official: boolean;
    schedules: Schedule[];
    droppedWeeks: number;
    static DEFAULT_DROPPED_WEEKS: number;
    calculateMinimumParticipation(): number;
}
