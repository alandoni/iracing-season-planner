import { License } from "./license";
import { Track } from "./track";
import { Car } from "./car";
import { Series } from "./series";
import { Category } from "./category";

export type Season = {
  cachedDate: Date;
  cars: Car[];
  tracks: Track[];
  licenses: License[];
  series: Series[];
  categories: Category[];
};
