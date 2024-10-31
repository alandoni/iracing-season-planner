import { ApiRequest } from "data-utils";
import { LinkResponse } from "../link_response";
import { CarResponse } from "./car_response";
import { CarClassResponse } from "./car_class_response";
export declare class CarApi {
    getCarsLink(): ApiRequest<LinkResponse>;
    getCars(link: string): ApiRequest<CarResponse[]>;
    getCarClassesLink(): ApiRequest<LinkResponse>;
    getCarClasses(link: string): ApiRequest<CarClassResponse[]>;
}
