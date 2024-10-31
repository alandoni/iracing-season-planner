"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CarRepository = void 0;
const category_1 = require("data/iracing/season/models/category");
class CarRepository {
    carService;
    constructor(carService) {
        this.carService = carService;
    }
    async getCars() {
        const cars = await this.carService.getCars();
        const classes = await this.carService.getCarClasses();
        return cars.map((car) => this.fromCarResponseToCar(car, classes));
    }
    fromCarResponseToCar(car, classes) {
        const filteredClasses = classes.filter((cls) => cls.cars_in_class.find((carInClass) => carInClass.car_id === car.car_id));
        const categories = car.categories.map((c) => new category_1.Category(-1, c));
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
        };
    }
}
exports.CarRepository = CarRepository;
//# sourceMappingURL=car_repository.js.map