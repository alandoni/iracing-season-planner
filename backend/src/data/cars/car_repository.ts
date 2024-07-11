import { HttpClient } from "../http_client"
import { CarResponse } from "./car_response"
import { LinkResponse } from "../link_response"
import { Car } from "./car"
import { CarClassResponse } from "./car_class_response"
import { formatCategory } from "data/season/category"

export class CarRepository {
  private static URL = "https://members-ng.iracing.com/data/car/get"
  private static CLASS_URL = "https://members-ng.iracing.com/data/carclass/get"

  constructor(private httpClient: HttpClient) {}

  async getCarClasses() {
    const response = await this.httpClient.get<LinkResponse>(CarRepository.CLASS_URL)
    const classes = await this.httpClient.get<CarClassResponse[]>(response.link)
    return classes
  }

  async getCars(): Promise<Car[]> {
    const response = await this.httpClient.get<LinkResponse>(CarRepository.URL)
    const cars = await this.httpClient.get<CarResponse[]>(response.link)
    const classes = await this.getCarClasses()

    return cars.map((car) => {
      const filteredClasses = classes.filter((cls) =>
        cls.cars_in_class.find((carInClass) => carInClass.car_id === car.car_id),
      )
      const categories = car.categories.map(formatCategory).map((c) => ({ id: -1, name: c }))
      return {
        id: car.car_id,
        classes: filteredClasses.map((cls) => ({
          id: cls.car_class_id,
          name: cls.name,
        })),
        dirpath: car.car_dirpath,
        name: car.car_name,
        abbreviation: car.car_name_abbreviated,
        types: car.car_types.map((type) => type.car_type),
        weight: car.car_weight,
        hp: car.hp,
        categories,
        forumUrl: car.forum_url,
        free: car.free_with_subscription,
        headlights: car.has_headlights,
        price: car.price,
        rainEnabled: car.rain_enabled,
        retired: car.retired,
        licenses: [
          {
            id: -1,
            name: "Fake",
            minRaces: -1,
            minSr: -1,
            letter: "fake",
            color: "fake",
          },
        ], // This license will be replaced
        numberOfSeries: 0,
        numberOfRaces: 0,
      }
    })
  }
}
