import { Car } from "racing-tools-data/iracing/season/models/car"
import { Category } from "racing-tools-data/iracing/season/models/category"
import { License } from "racing-tools-data/iracing/season/models/license"
import { Season } from "racing-tools-data/iracing/season/models/season"
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

export const seasonRepositoryMock: SeasonRepositoryInterface = {
  getSeason: () => {
    license1.id = 1
    license1.name = "Rookie"

    license2.id = 2
    license2.name = "Class D"

    car1.name = "Legends Ford '34 Coupe - Rookie"
    car1.id = 1
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

    const season = new Season()
    season.cars = [car1, car2, car3]
    season.categories = [category1, category2]
    season.licenses = [license1, license2]
    season.tracks = [track1, track2, track3]
    season.series = []

    return Promise.resolve(season)
  },
}
