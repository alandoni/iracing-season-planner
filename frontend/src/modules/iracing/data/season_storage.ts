import { CompressionRepository } from "@alandoni/data-utils"
import { Schedule } from "racing-tools-data/iracing/season/models/schedule"
import { Season } from "racing-tools-data/iracing/season/models/season"
import { Series } from "racing-tools-data/iracing/season/models/series"
import { plainToInstance } from "@alandoni/utils"

export class SeasonStorage {
  static LOCAL_STORAGE_CACHED_DATE_KEY = "cachedDate"
  static LOCAL_STORAGE_CARS_KEY = "cars"
  static LOCAL_STORAGE_TRACKS_KEY = "tracks"
  static LOCAL_STORAGE_SERIES_KEY = "series"
  static LOCAL_STORAGE_LICENSES_KEY = "licenses"
  static LOCAL_STORAGE_CATEGORIES_KEY = "categories"

  constructor(private storage: Storage, private compressionRepository: CompressionRepository) {}

  async setSeason(season: Season) {
    const buffer = await this.compressionRepository.compress(JSON.stringify(season.series))
    this.storage.setItem(SeasonStorage.LOCAL_STORAGE_SERIES_KEY, JSON.stringify(buffer))
    this.storage.setItem(SeasonStorage.LOCAL_STORAGE_CARS_KEY, JSON.stringify(season.cars))
    this.storage.setItem(SeasonStorage.LOCAL_STORAGE_TRACKS_KEY, JSON.stringify(season.tracks))
    this.storage.setItem(SeasonStorage.LOCAL_STORAGE_LICENSES_KEY, JSON.stringify(season.licenses))
    this.storage.setItem(SeasonStorage.LOCAL_STORAGE_CATEGORIES_KEY, JSON.stringify(season.categories))
    this.storage.setItem(SeasonStorage.LOCAL_STORAGE_CACHED_DATE_KEY, season.cachedDate.toISOString() ?? "")
  }

  async getSeason(): Promise<Season | null> {
    const cachedDateInLocalStorage = this.storage.getItem(SeasonStorage.LOCAL_STORAGE_CACHED_DATE_KEY)
    if (!cachedDateInLocalStorage || cachedDateInLocalStorage === "undefined") {
      return null
    }
    const cachedDate = new Date(cachedDateInLocalStorage ?? "")
    const data = await this.compressionRepository.decompress(
      JSON.parse(this.storage.getItem(SeasonStorage.LOCAL_STORAGE_SERIES_KEY) ?? "[]"),
    )
    const seasonData = {
      cars: JSON.parse(this.storage.getItem(SeasonStorage.LOCAL_STORAGE_CARS_KEY) ?? "[]"),
      tracks: JSON.parse(this.storage.getItem(SeasonStorage.LOCAL_STORAGE_TRACKS_KEY) ?? "[]"),
      series: JSON.parse(data ?? "[]").map((s: Series) => ({
        ...s,
        schedules: s.schedules.map((sc: Schedule) => ({ ...sc, startDate: new Date(sc.startDate) })),
      })),
      licenses: JSON.parse(this.storage.getItem(SeasonStorage.LOCAL_STORAGE_LICENSES_KEY) ?? "[]"),
      categories: JSON.parse(this.storage.getItem(SeasonStorage.LOCAL_STORAGE_CATEGORIES_KEY) ?? "[]"),
      cachedDate: cachedDate,
    }
    const cachedSeason = plainToInstance(Season, seasonData, { enableImplicitConversion: true })
    return cachedSeason
  }

  async remove() {
    this.storage.removeItem(SeasonStorage.LOCAL_STORAGE_CARS_KEY)
    this.storage.removeItem(SeasonStorage.LOCAL_STORAGE_TRACKS_KEY)
    this.storage.removeItem(SeasonStorage.LOCAL_STORAGE_SERIES_KEY)
    this.storage.removeItem(SeasonStorage.LOCAL_STORAGE_LICENSES_KEY)
    this.storage.removeItem(SeasonStorage.LOCAL_STORAGE_CATEGORIES_KEY)
    this.storage.removeItem(SeasonStorage.LOCAL_STORAGE_CACHED_DATE_KEY)
  }
}
