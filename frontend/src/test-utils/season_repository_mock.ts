import { Car } from "racing-tools-data/iracing/season/models/car"
import { Category } from "racing-tools-data/iracing/season/models/category"
import { License } from "racing-tools-data/iracing/season/models/license"
import { Season } from "racing-tools-data/iracing/season/models/season"
import { SeasonRepositoryInterface } from "racing-tools-data/iracing/season/season_repository_interface"

export const car1 = new Car()
export const car2 = new Car()
export const car3 = new Car()
export const category1 = new Category(1, "Oval")
export const category2 = new Category(1, "Sports Car")
export const license1 = new License()
export const license2 = new License()

export const seasonRepository: SeasonRepositoryInterface = {
  getSeason: () => {
    license1.id = 1
    license1.name = "Rookie"

    license2.id = 2
    license2.name = "Class D"

    car1.name = "Legends Ford '34 Coupe - Rookie"
    car1.categories = [category1]
    car1.licenses = [license1]

    car2.name = "[Legacy] NASCAR Truck Chevrolet Silverado - 2008"
    car2.categories = [category2]
    car2.licenses = [license1]

    car3.name = "Street Stock - Panther C1"
    car3.categories = [category1, category2]
    car3.licenses = [license1, license2]

    const season = new Season()
    season.cars = [car1, car2, car3]
    season.categories = [category1, category2]
    season.licenses = [license1, license2]
    season.series = []

    return Promise.resolve(season)
  },
}
