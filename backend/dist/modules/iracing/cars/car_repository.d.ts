import { Car } from "data/iracing/season/models/car";
import { CarService } from "./car_service";
export declare class CarRepository {
    private carService;
    constructor(carService: CarService);
    getCars(): Promise<Car[]>;
    private fromCarResponseToCar;
}
