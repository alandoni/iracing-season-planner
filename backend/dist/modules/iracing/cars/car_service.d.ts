import { HttpClient } from "data-utils";
import { CarClassResponse } from "./car_class_response";
import { CarResponse } from "./car_response";
import { CarApi } from "./car_api";
export declare class CarService {
    private httpClient;
    private carApi;
    constructor(httpClient: HttpClient, carApi: CarApi);
    getCarClasses(): Promise<CarClassResponse[]>;
    getCars(): Promise<CarResponse[]>;
}
