import { Car } from "data/cars/car"
import { Track } from "data/tracks/track"

export type Schedule = {
  raceWeekNum: number
  cars: Car[]
  category: string
  categoryId: number
  startDate: Date
  name: string
  serieId: number
  track: Track & { configName: string }
}
