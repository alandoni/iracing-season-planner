import { Category } from "./category"
import { Type } from "class-transformer"

export class Schedule {
  raceWeekNum: number
  cars: number[]
  @Type(() => Category)
  category: Category
  startDate: Date
  name: string
  serieId: number
  track: { id: number; configName: string }
}
