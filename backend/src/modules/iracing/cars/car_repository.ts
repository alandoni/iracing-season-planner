import { CarResponse } from "./car_response"
import { Car } from "data/iracing/season/models/car"
import { Category } from "data/iracing/season/models/category"
import { CarService } from "./car_service"
import { CarClassResponse } from "./car_class_response"

export class CarRepository {
  constructor(private carService: CarService) {}

  async getCars(): Promise<Car[]> {
    const cars = await this.carService.getCars()
    const classes = await this.carService.getCarClasses()
    return cars.map((car) => this.fromCarResponseToCar(car, classes))
  }

  private fromCarResponseToCar(car: CarResponse, classes: CarClassResponse[]) {
    const filteredClasses = classes.filter((cls) =>
      cls.cars_in_class.find((carInClass) => carInClass.car_id === car.car_id),
    )
    const categories = car.categories.map((c) => new Category(-1, c))
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
      licenses: [],
      numberOfSeries: 0,
      numberOfRaces: 0,
      seriesIds: [],
    }
  }
}
