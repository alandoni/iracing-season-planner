import { HttpClient } from "@alandoni/data-utils"
import { CarClassResponse } from "./car_class_response"
import { CarResponse } from "./car_response"
import { CarApi } from "./car_api"

export class CarService {
  constructor(private httpClient: HttpClient, private carApi: CarApi) {}

  async getCarClasses(): Promise<CarClassResponse[]> {
    const requestLink = this.carApi.getCarClassesLink().buildRequest()
    const link = await this.httpClient.request(requestLink)

    const requestClasses = this.carApi.getCarClasses(link.data.link).buildRequest()
    return (await this.httpClient.request(requestClasses)).data
  }

  async getCars(): Promise<CarResponse[]> {
    const requestLink = this.carApi.getCarsLink().buildRequest()
    const link = await this.httpClient.request(requestLink)
    const requestClasses = this.carApi.getCars(link.data.link).buildRequest()
    const response = await this.httpClient.request(requestClasses)
    return response.data
  }
}
