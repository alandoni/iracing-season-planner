import { ApiRequest, HttpMethod } from "data-utils"
import { LinkResponse } from "../link_response"
import { CarResponse } from "./car_response"
import { CarClassResponse } from "./car_class_response"

export class CarApi {
  public getCarsLink(): ApiRequest<LinkResponse> {
    return new ApiRequest(HttpMethod.GET, "data/car/get", LinkResponse)
  }

  public getCars(link: string): ApiRequest<CarResponse[]> {
    return new ApiRequest(HttpMethod.GET, link, CarResponse)
  }

  public getCarClassesLink(): ApiRequest<LinkResponse> {
    return new ApiRequest(HttpMethod.GET, "data/carclass/get", LinkResponse)
  }

  public getCarClasses(link: string): ApiRequest<CarClassResponse[]> {
    return new ApiRequest(HttpMethod.GET, link, CarClassResponse)
  }
}
