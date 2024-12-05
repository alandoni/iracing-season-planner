import { License } from "./license"
import { Category } from "./category"
import { Type } from "class-transformer"

export class Track {
  id: number
  @Type(() => Category)
  mainCategory: Category
  @Type(() => Category)
  categories: Category[]
  location: string
  maxCars: number
  name: string
  free: boolean
  price: number
  retired: boolean
  url: string
  types: string[]
  rainEnabled: boolean
  configs: {
    name: string
    closes: Date
    opens: Date
    id: number
    dirpath: string
    length: number
    corners: number
  }[]
  licenses: License[]
  numberOfSeries: number
  numberOfRaces: number
  seriesIds: number[]
}

export type TrackWithConfigName = Track & {
  configName: string
}
