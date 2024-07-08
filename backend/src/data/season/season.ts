import { License } from "data/license/license"
import { Track } from "data/tracks/track"
import { Car } from "data/cars/car"
import { Series } from "./series"
import { Category } from "./category"

export type Season = {
  cachedDate: Date
  cars: Car[]
  tracks: Track[]
  licenses: License[]
  series: Series[]
  categories: Category[]
}
