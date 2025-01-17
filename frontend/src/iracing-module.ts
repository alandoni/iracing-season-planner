import { SeasonApi } from "racing-tools-data/iracing/season/season_api"
import { SeasonRepository } from "src/modules/iracing/data/season_repository"
import { SeasonService } from "src/modules/iracing/data/season_service"
import { SeasonStorage } from "src/modules/iracing/data/season_storage"
import { UserPreferencesRepository } from "src/modules/iracing/data/user_preferences_repository"
import { UserPreferencesStorage } from "src/modules/iracing/data/user_preferences_storage"
import { HttpClientImpl } from "@alandoni/frontend/utils/http_client"
import { DependencyInjection, DependencyInjectionModule } from "@alandoni/utils"
import { CompressionRepository } from "@alandoni/data-utils"

export class IRacingModule extends DependencyInjectionModule {
  initialize() {
    return (di: DependencyInjection) => {
      di.factory(UserPreferencesStorage, () => new UserPreferencesStorage(localStorage))
      di.factory(UserPreferencesRepository, () => new UserPreferencesRepository(di.get(UserPreferencesStorage)))
      di.factory(CompressionRepository, () => new CompressionRepository())
      di.factory(SeasonApi, () => new SeasonApi())
      di.factory(SeasonStorage, () => new SeasonStorage(localStorage, di.get(CompressionRepository)))
      di.factory(SeasonService, () => new SeasonService(di.get(HttpClientImpl), di.get(SeasonApi)))
      di.factory(SeasonRepository, () => new SeasonRepository(di.get(SeasonService), di.get(SeasonStorage)))
    }
  }
}
