import { License } from "./license"
import { Category } from "./category"
import { Type } from "class-transformer"

export class Car {
  id: number
  dirpath: string
  name: string
  classes: { id: number; name: string }[]
  abbreviation: string
  types: string[]
  weight: number
  hp: number
  @Type(() => Category)
  categories: Category[]
  forumUrl: string
  free: boolean
  headlights: boolean
  price: number
  rainEnabled: boolean
  retired: boolean
  licenses: License[]
  numberOfSeries: number
  numberOfRaces: number
  seriesIds: number[]
}
