import { License } from "./license";
import { Category } from "./category";

export type Track = {
  id: number;
  category: string;
  categoryId: number;
  categories: Category[];
  location: string;
  maxCars: number;
  name: string;
  free: boolean;
  price: number;
  retired: boolean;
  url: string;
  types: string[];
  rainEnabled: boolean;
  configs: {
    name: string;
    closes: Date;
    opens: Date;
    id: number;
    dirpath: string;
    length: number;
    corners: number;
  }[];
  licenses: License[];
  numberOfSeries: number;
  numberOfRaces: number;
  seriesIds: number[];
};

export type TrackWithConfigName = Track & {
  configName: string;
};
