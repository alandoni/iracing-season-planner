import { License } from "data/license/license"
import { Category } from "data/season/category"

export type Car = {
  id: number
  dirpath: string
  name: string
  classes: { id: number; name: string }[]
  abbreviation: string
  types: string[]
  weight: number
  hp: number
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
