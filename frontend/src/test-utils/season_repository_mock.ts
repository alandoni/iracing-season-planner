import { Car } from "racing-tools-data/iracing/season/models/car"
import { Category } from "racing-tools-data/iracing/season/models/category"
import { License } from "racing-tools-data/iracing/season/models/license"
import { Schedule } from "racing-tools-data/iracing/season/models/schedule"
import { Season } from "racing-tools-data/iracing/season/models/season"
import { Series } from "racing-tools-data/iracing/season/models/series"
import { Track } from "racing-tools-data/iracing/season/models/track"
import { SeasonRepositoryInterface } from "racing-tools-data/iracing/season/season_repository_interface"

export const car1 = new Car()
export const car2 = new Car()
export const car3 = new Car()

export const track1 = new Track()
export const track2 = new Track()
export const track3 = new Track()

export const category1 = new Category(1, "Oval")
export const category2 = new Category(2, "Sports Car")

export const license1 = new License()
export const license2 = new License()

export const series1 = new Series()
export const series2 = new Series()
export const series3 = new Series()
export const series4 = new Series()

export const schedule1Series1 = new Schedule()
export const schedule2Series1 = new Schedule()
export const schedule3Series1 = new Schedule()
export const schedule1Series2 = new Schedule()
export const schedule2Series2 = new Schedule()
export const schedule3Series2 = new Schedule()
export const schedule1Series3 = new Schedule()
export const schedule2Series3 = new Schedule()
export const schedule3Series3 = new Schedule()

export function createSeason() {
  const oldDate = new Date("01/01/2024")
  const newerDates = new Date().sumDays(14)
  license1.id = 1
  license1.name = "Rookie"

  license2.id = 2
  license2.name = "Class D"

  car1.name = "Legends Ford '34 Coupe - Rookie"
  car1.id = 1
  car1.free = true
  car1.categories = [category1]
  car1.licenses = [license1]

  car2.name = "[Legacy] NASCAR Truck Chevrolet Silverado - 2008"
  car2.id = 2
  car2.categories = [category2]
  car2.licenses = [license1]

  car3.name = "Street Stock - Panther C1"
  car3.id = 3
  car3.categories = [category1, category2]
  car3.licenses = [license1, license2]

  const config = {
    closes: new Date(),
    opens: new Date(),
    id: 1,
    dirpath: "",
    length: 3,
    corners: 15,
  }

  track1.name = "[Legacy] Charlotte Motor Speedway - 2008"
  track1.id = 1
  track1.free = true
  track1.mainCategory = category1
  track1.categories = [category1]
  track1.licenses = [license2]
  track1.configs = [{ ...config, name: "Charlotte" }]

  track2.name = "Homestead Miami Speedway"
  track2.id = 2
  track2.mainCategory = category1
  track2.categories = [category1, category2]
  track2.licenses = [license1]
  track2.configs = [
    { ...config, name: "Oval" },
    { ...config, name: "Sport" },
  ]

  track3.name = "WeatherTech Raceway at Laguna Seca"
  track3.id = 3
  track3.mainCategory = category2
  track3.categories = [category2]
  track3.licenses = [license1, license2]
  track3.configs = [
    { ...config, name: "Sport" },
    { ...config, name: "Formula" },
  ]

  schedule1Series1.category = category1
  schedule1Series1.raceWeekNum = 1
  schedule1Series1.startDate = oldDate
  schedule1Series1.track = { ...track1, configName: "North" }
  schedule1Series1.cars = [car1.id]
  schedule2Series1.category = category1
  schedule2Series1.raceWeekNum = 2
  schedule2Series1.startDate = oldDate
  schedule2Series1.track = { ...track2, configName: "Full Course" }
  schedule2Series1.cars = [car1.id]
  schedule3Series1.category = category1
  schedule3Series1.raceWeekNum = 3
  schedule3Series1.startDate = oldDate
  schedule3Series1.track = { ...track2, configName: "Full Course" }
  schedule3Series1.cars = [car1.id]

  schedule1Series2.category = category2
  schedule1Series2.raceWeekNum = 1
  schedule1Series2.startDate = oldDate
  schedule1Series2.track = { ...track3, configName: "Grand Prix" }
  schedule1Series2.cars = [car1.id]
  schedule2Series2.category = category2
  schedule2Series2.raceWeekNum = 2
  schedule2Series2.startDate = oldDate
  schedule2Series2.track = { ...track3, configName: "Grand Prix" }
  schedule2Series2.cars = [car1.id]
  schedule3Series2.category = category2
  schedule3Series2.raceWeekNum = 3
  schedule3Series2.startDate = oldDate
  schedule3Series2.track = { ...track3, configName: "Grand Prix" }
  schedule3Series2.cars = [car1.id]

  schedule1Series3.category = category2
  schedule1Series3.raceWeekNum = 1
  schedule1Series3.startDate = oldDate
  schedule1Series3.track = { ...track3, configName: "Grand Prix" }
  schedule1Series3.cars = [car1.id]
  schedule2Series3.category = category2
  schedule2Series3.raceWeekNum = 2
  schedule2Series3.startDate = new Date().sumDays(-1)
  schedule2Series3.track = { ...track3, configName: "Grand Prix" }
  schedule2Series3.cars = [car1.id]
  schedule3Series3.category = category2
  schedule3Series3.raceWeekNum = 3
  schedule3Series3.startDate = new Date().sumDays(7)
  schedule3Series3.track = { ...track3, configName: "Grand Prix" }
  schedule3Series3.cars = [car1.id]

  series1.id = 1
  series1.name = "Formula A - Grand Prix Tour - Fixed - 2024 Season"
  series1.schedules = [schedule1Series1, schedule2Series1, schedule3Series1]
  series1.licenses = [license1]
  series1.droppedWeeks = 2

  series2.id = 2
  series2.name = "Carburetor Cup - 2024 Season 4"
  series2.schedules = [schedule1Series2, schedule2Series2, schedule3Series2]
  series2.licenses = [license2]

  series3.id = 3
  series3.name = "Dallara Dash - 2024 Season 4 - Fixed"
  series3.schedules = [schedule1Series3, schedule2Series3, schedule3Series3]
  series3.licenses = [license1]

  for (let i = 4; i < 14; i++) {
    const schedule = new Schedule()
    schedule.category = category2
    schedule.raceWeekNum = i
    schedule.startDate = newerDates
    schedule.track = { ...track3, configName: "Grand Prix" }
    schedule.cars = [car1.id]
    series3.schedules.push(schedule)
  }

  series4.id = 4
  series4.name = "Dallara Dash - 2024 Season 4"
  series4.schedules = [schedule1Series1, schedule1Series2, schedule1Series3]
  series4.licenses = [license1, license2]

  const season = new Season()
  season.cars = [car1, car2, car3]
  season.categories = [category1, category2]
  season.licenses = [license1, license2]
  season.tracks = [track1, track2, track3]
  season.series = [series1, series2, series3, series4]
  return season
}

export const seasonRepositoryMock: SeasonRepositoryInterface = {
  getSeason: () => {
    return Promise.resolve(createSeason())
  },
}
