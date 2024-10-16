import { License } from "./license";
import { Track } from "./track";
import { Car } from "./car";
import { Series } from "./series";
import { Category } from "./category";

export class Season {
  static MAX_DAYS_TO_VALIDATE_CACHE = 7;

  cachedDate: Date;
  cars: Car[];
  tracks: Track[];
  licenses: License[];
  series: Series[];
  categories: Category[];

  public validate(): boolean {
    const sortedSeries = this.series.sort(
      (a, b) => b.schedules.length - a.schedules.length
    );
    if (sortedSeries.length === 0) {
      return false;
    }
    const longestSerie = sortedSeries[0];
    const sortedSchedules = longestSerie.schedules.sort((a, b) => {
      return b.startDate.getTime() - a.startDate.getTime(); //inverted
    });
    if (sortedSchedules.length === 0) {
      return false;
    }
    const lastSchedule = sortedSchedules[0];
    const lastScheduleLastDate = new Date(
      lastSchedule.startDate.setDate(
        lastSchedule.startDate.getDate() + Season.MAX_DAYS_TO_VALIDATE_CACHE - 1
      )
    );
    const cacheDate = new Date(this.cachedDate);
    const lastValidDate = new Date(
      cacheDate.setDate(cacheDate.getDate() + Season.MAX_DAYS_TO_VALIDATE_CACHE)
    );

    return (
      new Date().getTime() < lastValidDate.getTime() &&
      new Date().getTime() < lastScheduleLastDate.getTime()
    );
  }
}
