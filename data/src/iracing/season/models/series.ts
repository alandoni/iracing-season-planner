import { License } from "./license"
import { Schedule } from "./schedule"

export type Series = {
  id: number
  name: string
  licenses: License[]
  fixedSetup: boolean
  maxWeeks: number
  multiclass: boolean
  official: boolean
  schedules: Schedule[]
  droppedWeeks: number
}
