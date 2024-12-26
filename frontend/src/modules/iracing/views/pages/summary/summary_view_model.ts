import { Car } from "racing-tools-data/iracing/season/models/car"
import { Track, TrackWithConfigName } from "racing-tools-data/iracing/season/models/track"
import { SeasonRepository } from "src/modules/iracing/data/season_repository"
import { UserPreferencesRepository } from "src/modules/iracing/data/user_preferences_repository"
import { useCallback, useEffect, useState } from "react"
import { DI, Logger } from "@alandoni/utils"
import { FullSeries, useCommonViewModel } from "../common_view_model"
import { SeasonRepositoryInterface } from "racing-tools-data/iracing/season/season_repository_interface"
import { ConsoleLogger } from "@alandoni/frontend/utils/logger"

export type AlmostEligibleSeriesAndContentsToBuy = {
  series: SeriesWithSummary
  tracks: Track[]
  cars: Car[]
}

export const DEFAULT_DROPPED_WEEKS = 4

export function calculateMinimumParticipation(series: FullSeries) {
  const droppedWeeks = series.droppedWeeks ?? DEFAULT_DROPPED_WEEKS
  return Math.max(series.schedules.length - droppedWeeks, 0)
}

export type SeriesWithSummary = FullSeries & {
  participatedRaces: number
  totalCars: number
  ownedCars: number
  totalTracks: number
  ownedTracks: number
  eligible: number
}

export function useSummaryViewModel(
  seasonRepository: SeasonRepositoryInterface = DI.get(SeasonRepository),
  userPreferencesRepository: UserPreferencesRepository = DI.get(UserPreferencesRepository),
  logger: Logger = DI.get(ConsoleLogger),
) {
  const [participatedSeries, setParticipatedSeries] = useState<SeriesWithSummary[]>([])
  const [bestCarsToBuy, setBestCarsToBuy] = useState<Car[]>([])
  const [bestTracksToBuy, setBestTracksToBuy] = useState<TrackWithConfigName[]>([])
  const [almostEligibleSeriesAndContentToBuy, setAlmostEligibleSeriesAndContentToBuy] = useState<
    AlmostEligibleSeriesAndContentsToBuy[]
  >([])
  const [showOwnedContent, setShowOwnedContent] = useState<boolean>(false)
  const [showOnlySeriesEligible, setShowOnlySeriesEligible] = useState<boolean>(false)

  const commonViewModel = useCommonViewModel(seasonRepository, userPreferencesRepository, logger)

  const summarizeSeries = useCallback(
    (series: FullSeries): SeriesWithSummary => {
      const tracks: number[] = []
      const cars: number[] = []
      const ownedTracks: number[] = []
      const ownedCars: number[] = []
      let eligible = 0

      series.schedules.forEach((schedule) => {
        const ownedTrack = schedule.track.free || commonViewModel.myTracks.find((t) => t.id === schedule.track.id)
        const ownedCarsInSchedule = schedule.cars.filter(
          (car) => car.free || commonViewModel.myCars.find((c) => car.id === c.id),
        )

        if (!tracks.includes(schedule.track.id)) {
          tracks.push(schedule.track.id)
        }
        schedule.cars.forEach((car) => {
          if (!cars.includes(car.id)) {
            cars.push(car.id)
          }
        })

        if (ownedTrack && !ownedTracks.includes(schedule.track.id)) {
          ownedTracks.push(schedule.track.id)
        }
        if (ownedCarsInSchedule.length > 0) {
          ownedCarsInSchedule.forEach((car) => {
            if (!ownedCars.includes(car.id)) {
              ownedCars.push(car.id)
            }
          })
        }
        if (ownedCarsInSchedule.length > 0 && ownedTrack) {
          eligible++
        }
      })

      return {
        ...series,
        participatedRaces: commonViewModel.participatedRaces.filter((r) => r.serieId === series.id).length,
        ownedCars: ownedCars.length,
        totalCars: cars.length,
        ownedTracks: ownedTracks.length,
        totalTracks: tracks.length,
        eligible,
      }
    },
    [commonViewModel.myCars, commonViewModel.myTracks, commonViewModel.participatedRaces],
  )

  const filterBestBuys = useCallback(
    <T extends Car | TrackWithConfigName>(
      filteredSeries: FullSeries[],
      propertyToFilter: "cars" | "track",
      propertyOfOwnedContent: "myCars" | "myTracks",
    ): T[] => {
      return filteredSeries
        .flatMap((series) => series.schedules.flatMap((s) => s[propertyToFilter] as T))
        .filter(
          (value) =>
            !value.free &&
            (showOwnedContent || !commonViewModel[propertyOfOwnedContent].find((c) => value.id === c.id)),
        )
        .removeDuplicates((value, value2) => value.id === value2.id)
        .filter(
          (car) =>
            commonViewModel.preferredLicenses.some((license) => car.licenses.find((l) => l.id === license.id)) &&
            commonViewModel.preferredCategories.some((category) => car.categories.find((c) => c.id === category.id)),
        )
        .sort((a, b) => b.numberOfSeries - a.numberOfSeries || b.numberOfRaces - a.numberOfRaces)
        .filter((_, index) => index < 10) as T[]
    },
    [
      commonViewModel.preferredLicenses,
      commonViewModel.preferredCategories,
      commonViewModel.myCars,
      commonViewModel.myTracks,
      showOwnedContent,
    ],
  )

  const wouldBuyingThisContentIncreasesSeriesEligible = useCallback(
    (series: SeriesWithSummary, content: Car | Track): boolean => {
      return (
        series.schedules.find((s) => {
          const ownedTrack = s.track.free || commonViewModel.myTracks.find((t) => t.id === s.track.id) !== undefined
          const ownedCarsInSchedule = s.cars.filter(
            (car) => car.free || commonViewModel.myCars.find((c) => car.id === c.id),
          )

          if ("location" in content && "id" in content) {
            return !ownedTrack && s.track.id === content.id
          } else {
            return ownedCarsInSchedule.length === 0 && s.cars.find((car) => car.id === content.id)
          }
        }) !== undefined
      )
    },
    [commonViewModel.myCars, commonViewModel.myTracks],
  )

  const filterAlmostEligibleSeries = useCallback(
    (seriesWithSummary: SeriesWithSummary[]): AlmostEligibleSeriesAndContentsToBuy[] => {
      const filtered = seriesWithSummary
        .filter((series) => {
          const isInPreferredLicense = commonViewModel.preferredLicenses.some((license) =>
            series.licenses.find((l) => l.id === license.id),
          )
          const isInPreferredCategory = commonViewModel.preferredCategories.some((category) =>
            series.schedules.find((c) => c.category.id === category.id),
          )
          const isEligible = series.eligible < calculateMinimumParticipation(series)
          return isEligible && isInPreferredLicense && isInPreferredCategory
        })
        .sort(
          (b, a) =>
            a.eligible - b.eligible ||
            a.totalCars - a.ownedCars - (b.totalCars - b.ownedCars) ||
            a.totalTracks - a.ownedTracks - (b.totalTracks - b.ownedTracks),
        )
        .filter((_, index) => index < 10)

      return filtered.map((series) => {
        const allCarsOfSeries = series.schedules
          .flatMap((s) => s.cars)
          .removeDuplicates((c1, c2) => c1.id === c2.id)
          .filter((car) => wouldBuyingThisContentIncreasesSeriesEligible(series, car))
          .sort((b, a) => a.numberOfSeries - b.numberOfSeries || a.numberOfRaces - b.numberOfRaces)
          .filter((_, index) => index < 5)

        const allTracksOfSeries = series.schedules
          .map((s) => s.track)
          .removeDuplicates((t1, t2) => t1.id === t2.id)
          .filter((track) => wouldBuyingThisContentIncreasesSeriesEligible(series, track))
          .sort((b, a) => a.numberOfSeries - b.numberOfSeries || a.numberOfRaces - b.numberOfRaces)
          .filter((_, index) => index < 5)
        return {
          series,
          cars: allCarsOfSeries,
          tracks: allTracksOfSeries,
        }
      })
    },
    [
      commonViewModel.preferredCategories,
      commonViewModel.preferredLicenses,
      wouldBuyingThisContentIncreasesSeriesEligible,
    ],
  )

  const filterParticipatedSeries = useCallback(
    (series: SeriesWithSummary) => {
      const hasMinimumParticipation = calculateMinimumParticipation(series) > 0
      const isSeriesEligible = series.eligible >= calculateMinimumParticipation(series)
      const isInPreferredLicense = commonViewModel.preferredLicenses.some((license) =>
        series.licenses.find((l) => l.id === license.id && license.letter !== "R"),
      )
      const isInPreferredCategory = commonViewModel.preferredCategories.some((category) =>
        series.schedules.find((sc) => sc.category.id === category.id),
      )
      const hasParticipatedOfSeries = series.participatedRaces > 0
      return (
        (hasMinimumParticipation && isSeriesEligible && isInPreferredLicense && isInPreferredCategory) ||
        hasParticipatedOfSeries
      )
    },
    [commonViewModel.preferredCategories, commonViewModel.preferredLicenses],
  )

  useEffect(() => {
    if (!commonViewModel.season) {
      return
    }
    const seriesWithSummary = commonViewModel.season.series.map(summarizeSeries)

    const participated = seriesWithSummary.filter(filterParticipatedSeries)
    setParticipatedSeries(participated)

    const nonEligibleSeries = seriesWithSummary.filter((series) => {
      return showOnlySeriesEligible || series.eligible < calculateMinimumParticipation(series)
    })

    const cars = filterBestBuys<Car>(nonEligibleSeries, "cars", "myCars")
    setBestCarsToBuy(cars)

    const tracks = filterBestBuys<TrackWithConfigName>(nonEligibleSeries, "track", "myTracks")
    setBestTracksToBuy(tracks)

    const almostEligibleSeries = filterAlmostEligibleSeries(seriesWithSummary)
    setAlmostEligibleSeriesAndContentToBuy(almostEligibleSeries)
  }, [
    commonViewModel.preferredCategories,
    commonViewModel.preferredLicenses,
    commonViewModel.season,
    filterAlmostEligibleSeries,
    filterBestBuys,
    filterParticipatedSeries,
    showOnlySeriesEligible,
    summarizeSeries,
  ])

  return {
    ...commonViewModel,
    participatedSeries,
    bestCarsToBuy,
    bestTracksToBuy,
    almostEligibleSeriesAndContentToBuy,
    showOwnedContent,
    setShowOwnedContent,
    showOnlySeriesEligible,
    setShowOnlySeriesEligible,
  }
}
