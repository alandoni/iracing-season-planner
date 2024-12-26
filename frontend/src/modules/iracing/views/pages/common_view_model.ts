import { Car } from "racing-tools-data/iracing/season/models/car"
import { Category } from "racing-tools-data/iracing/season/models/category"
import { License } from "racing-tools-data/iracing/season/models/license"
import { Schedule } from "racing-tools-data/iracing/season/models/schedule"
import { Season } from "racing-tools-data/iracing/season/models/season"
import { Series } from "racing-tools-data/iracing/season/models/series"
import { Track } from "racing-tools-data/iracing/season/models/track"
import { TrackWithConfigName } from "racing-tools-data/iracing/season/models/track"
import { UserPreferencesRepository } from "src/modules/iracing/data/user_preferences_repository"
import { useState } from "react"
import { assertNotNull, Logger, DI } from "@alandoni/utils"
import { ConsoleLogger } from "@alandoni/frontend/utils/logger"
import { SeasonRepositoryInterface } from "racing-tools-data/iracing/season/season_repository_interface"

export type FullSchedule = Omit<Schedule, "cars" | "track"> & { cars: Car[]; track: TrackWithConfigName }

export type FullSeries = Omit<Series, "schedules" | "calculateMinimumParticipation"> & { schedules: FullSchedule[] }

export type SeasonWithFullSchedule = Omit<Season, "series" | "validate"> & { series: FullSeries[] }

type SeasonLists = Omit<SeasonWithFullSchedule, "cachedDate" | "quarter" | "year" | "validate">

export function useCommonViewModel(
  seasonRepository: SeasonRepositoryInterface,
  userRepository: UserPreferencesRepository,
  logger: Logger = DI.get(ConsoleLogger),
) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<unknown>()
  const [season, setSeason] = useState<SeasonWithFullSchedule>()

  const [search, setSearch] = useState("")

  const [myCars, setMyCars] = useState<Car[]>([])
  const [myTracks, setMyTracks] = useState<Track[]>([])

  const [participatedSeries, setParticipatedSeries] = useState<FullSeries[]>([])
  const [participatedRaces, setParticipatedRaces] = useState<FullSchedule[]>([])

  const [preferredCategories, setPreferredCategories] = useState<Category[]>([])
  const [preferredLicenses, setPreferredLicenses] = useState<License[]>([])

  const onLoad = async () => {
    setLoading(true)
    try {
      const season = await seasonRepository.getSeason()
      const fullSeason = {
        ...season,
        series: season.series.map((series) => {
          return {
            ...series,
            schedules: series.schedules.map((s) => {
              const track = season.tracks.find((track) => {
                return track.id === s.track.id
              })
              assertNotNull(track)
              return {
                ...s,
                cars: s.cars.map((carId) => {
                  const car = season.cars.find((c) => c.id === carId)
                  assertNotNull(car)
                  return car
                }),
                track: { ...track, configName: s.track.configName },
              }
            }),
          }
        }),
      }
      setSeason(fullSeason)
      getUserPreferences(fullSeason)
    } catch (error) {
      logger.error(error)
      setError(error)
    }
    setLoading(false)
  }

  const getUserPreferences = (season: SeasonWithFullSchedule) => {
    const preferences = userRepository.getUserPreferences()
    if (!preferences) {
      setPreferredCategories(season.categories)
      setPreferredLicenses(season.licenses)
      return
    }
    setList(season, preferences.myCarsIds, "cars", setMyCars)
    setList(season, preferences.myTracksIds, "tracks", setMyTracks)
    setList(season, preferences.preferredCategories, "categories", setPreferredCategories, season?.categories)
    setList(season, preferences.preferredLicenses, "licenses", setPreferredLicenses, season?.licenses)
    setParticipatedRacesAndSeries(season, preferences.participatedRacesIds)
  }

  const onSearch = (search: string) => {
    setSearch(search)
  }

  const setParticipatedRacesAndSeries = (season: SeasonWithFullSchedule | undefined, ids: string[]) => {
    const participatedSeriesLoaded: FullSeries[] = []
    setParticipatedRaces(
      ids.flatMap(
        (id) =>
          season?.series?.flatMap(
            (series) =>
              series.schedules.flatMap((schedule) => {
                if (`${series.id}-${schedule.raceWeekNum}` === id) {
                  if (!participatedSeriesLoaded.find((s) => s.id === series.id)) {
                    participatedSeriesLoaded.push(series)
                  }
                  return [schedule]
                } else {
                  return []
                }
              }) ?? [],
          ) ?? [],
      ),
    )
    setParticipatedSeries(participatedSeriesLoaded)
  }

  const setList = <K extends keyof SeasonLists, T extends SeasonLists[K]>(
    season: SeasonLists | undefined,
    ids: number[],
    property: K,
    setState: (value: T) => void,
    defaultListIfEmpty?: T,
  ) => {
    const list: SeasonLists[K] | undefined = season?.[property]
    const theList = ids.flatMap((id) => list?.find((item) => item.id === id) ?? [])
    if (theList.length === 0) {
      setState((defaultListIfEmpty ?? []) as T)
    } else {
      setState(theList as T)
    }
  }

  const setCar = (checked: boolean, car: Car) => {
    const ids = userRepository.addOrRemoveOwnedCar(car, checked)
    setList(season, ids, "cars", setMyCars)
  }

  const setTrack = (checked: boolean, track: Track) => {
    const ids = userRepository.addOrRemoveOwnedTrack(track, checked)
    setList(season, ids, "tracks", setMyTracks)
  }

  const setPreferredCategory = (checked: boolean, category: Category) => {
    const ids = userRepository.addOrRemovePreferredCategory(category, checked)
    setList(season, ids, "categories", setPreferredCategories)
  }

  const setPreferredLicense = (checked: boolean, license: License) => {
    const ids = userRepository.addOrRemovePreferredLicense(license, checked)
    setList(season, ids, "licenses", setPreferredLicenses)
  }

  const setParticipatedRace = (checked: boolean, schedule: Schedule) => {
    const ids = userRepository.setParticipatedRace(checked, schedule)
    setParticipatedRacesAndSeries(season, ids)
  }

  return {
    loading,
    season,
    error,
    onLoad,
    preferredCategories,
    setPreferredCategory,
    preferredLicenses,
    setPreferredLicense,
    search,
    setSearch: onSearch,
    myCars,
    setCar,
    myTracks,
    setTrack,
    participatedSeries,
    participatedRaces,
    setParticipatedRace,
  }
}
