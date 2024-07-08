import { License } from "data/license/license"
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
}
