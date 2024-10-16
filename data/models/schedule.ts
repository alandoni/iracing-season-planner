import { Car } from "./car";
import { TrackWithConfigName } from "./track";

export type Schedule = {
  raceWeekNum: number;
  cars: Car[];
  category: string;
  categoryId: number;
  startDate: Date;
  name: string;
  serieId: number;
  track: TrackWithConfigName;
};
