import { DependencyInjectionModule, DependencyInjection, DI } from "utils"
import { AxiosHttpClient } from "../../data/http_client"
import { IRacingHeadersInterceptor } from "./ir_headers_interceptor"
import { CarApi } from "./cars/car_api"
import { CarRepository } from "./cars/car_repository"
import { CarService } from "./cars/car_service"
import { UserRepository } from "./user/user_repository"
import { UserService } from "./user/user_service"
import { SeasonRouter } from "./season_router"
import { SeasonController } from "./season/season_controller"
import { SeasonRepository } from "./season/season_repository"
import { TrackRepository } from "./tracks/track_repository"
import { LicenseRepository } from "./license/license_repository"
import { SeriesService } from "./season/series_service"
import { TrackService } from "./tracks/track_service"
import { LicenseService } from "./license/license_service"
import { SeriesApi } from "./season/series_api"
import { LicenseApi } from "./license/license_api"
import { TrackApi } from "./tracks/track_api"
import { UserApi as IRUserApi } from "./user/user_api"
import { UserController } from "./user/user_controller"
import { UserRouter } from "./user/user_router"
import { BackendModuleInterface } from "backend/backend_module_interface"
import { Routes } from "backend/routes/routes"
import { FileRepository } from "src/data/file_repository"
import { SeasonApi } from "data/iracing/season/season_api"
import { UserApi } from "data/iracing/user/user_api"

export class IRacingHttpClient extends AxiosHttpClient {
  constructor() {
    super("https://members-ng.iracing.com/", [DI.get(IRacingHeadersInterceptor)])
  }
}

export class IRacingModule extends DependencyInjectionModule implements BackendModuleInterface {
  initialize(): (di: DependencyInjection) => void {
    return (di) => {
      di.factory(FileRepository, () => new FileRepository())

      di.factory(IRUserApi, () => new IRUserApi())
      di.factory(UserService, () => new UserService(di.get(IRacingHttpClient), di.get(IRUserApi)))
      di.factory(UserRepository, () => new UserRepository(di.get(UserService)))
      di.factory(UserController, () => new UserController(di.get(UserRepository)))
      di.factory(UserApi, () => new UserApi())
      di.factory(UserRouter, () => new UserRouter(di.get(UserController), di.get(UserApi)))

      di.factory(IRacingHeadersInterceptor, () => new IRacingHeadersInterceptor())
      di.factory(IRacingHttpClient, () => new IRacingHttpClient())

      di.factory(CarApi, () => new CarApi())
      di.factory(CarService, () => new CarService(di.get(IRacingHttpClient), di.get(CarApi)))
      di.factory(CarRepository, () => new CarRepository(di.get(CarService)))

      di.factory(TrackApi, () => new TrackApi())
      di.factory(TrackService, () => new TrackService(di.get(IRacingHttpClient), di.get(TrackApi)))
      di.factory(TrackRepository, () => new TrackRepository(di.get(TrackService)))

      di.factory(LicenseApi, () => new LicenseApi())
      di.factory(LicenseService, () => new LicenseService(di.get(IRacingHttpClient), di.get(LicenseApi)))
      di.factory(LicenseRepository, () => new LicenseRepository(di.get(LicenseService)))

      di.factory(SeriesApi, () => new SeriesApi())
      di.factory(SeriesService, () => new SeriesService(di.get(IRacingHttpClient), di.get(SeriesApi)))

      di.factory(
        SeasonRepository,
        () =>
          new SeasonRepository(
            di.get(SeriesService),
            di.get(TrackRepository),
            di.get(CarRepository),
            di.get(LicenseRepository),
          ),
      )
      di.factory(
        SeasonController,
        () => new SeasonController(di.get(SeasonRepository), di.get(UserRepository), di.get(FileRepository)),
      )
      di.factory(SeasonApi, () => new SeasonApi())
      di.factory(SeasonRouter, () => new SeasonRouter(di.get(SeasonController), di.get(SeasonApi)))
    }
  }

  getEntities(): unknown[] {
    return []
  }

  getRoutes(): Routes[] {
    return [DI.get(SeasonRouter), DI.get(UserRouter)]
  }
}
