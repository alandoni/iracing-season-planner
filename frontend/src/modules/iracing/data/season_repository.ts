import { Season } from "racing-tools-data/iracing/season/models/season"
import { SeasonService } from "./season_service"
import { SeasonStorage } from "./season_storage"
import { SeasonRepositoryInterface } from "racing-tools-data/iracing/season/season_repository_interface"

export class SeasonRepository implements SeasonRepositoryInterface {
  constructor(private seasonService: SeasonService, private seasonStorage: SeasonStorage) {}

  async getSeason(): Promise<Season> {
    const cachedSeason = await this.seasonStorage.getSeason()
    if (!cachedSeason || !cachedSeason.validate()) {
      const season = await this.seasonService.getSeason()
      await this.seasonStorage.setSeason(season)
      return season
    }
    console.log(`Using cache, it will expire on ${cachedSeason.cachedDate}`)
    return cachedSeason
  }

  async invalidateCache(): Promise<Season> {
    this.seasonStorage.remove()
    const season = await this.seasonService.invalidateCache()
    this.seasonStorage.setSeason(season)
    return season
  }
}
