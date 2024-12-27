import { License } from "./license"
import { Schedule } from "./schedule"
import { Type } from "class-transformer"

export class Series {
  id: number
  name: string
  licenses: License[]
  fixedSetup: boolean
  maxWeeks: number
  multiclass: boolean
  official: boolean
  @Type(() => Schedule)
  schedules: Schedule[]
  droppedWeeks: number

  static DEFAULT_DROPPED_WEEKS = 4

  calculateMinimumParticipation() {
    const droppedWeeks = this.droppedWeeks ?? Series.DEFAULT_DROPPED_WEEKS
    const minimumParticipationWeeks = this.schedules.length - droppedWeeks
    return Math.max(minimumParticipationWeeks)
  }
}
