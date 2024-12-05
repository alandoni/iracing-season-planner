import { Season } from "./models/season"

export interface SeasonRepositoryInterface {
  getSeason(): Promise<Season>
}
