import { calculateMinimumParticipation, SeriesWithSummary } from "components/participated_series_row"
import { AlmostEligibleSeriesAndContentsToBuy } from "components/series_eligible_and_needed_content"
import { Car } from "racing-tools-data/iracing/season/models/car"
import { Track, TrackWithConfigName } from "racing-tools-data/iracing/season/models/track"
import { SeasonRepository } from "src/data/season_repository"
import { UserPreferencesRepository } from "src/data/user_repository"
import { useState } from "react"
import { DI } from "@alandoni/utils"
import { FullSeries, useCommonViewModel } from "./common_view_model"

export function useSummaryViewModel(
  seasonRepository: SeasonRepository = DI.get(SeasonRepository),
  userPreferencesRepository: UserPreferencesRepository = DI.get(UserPreferencesRepository),
) {
  const [participatedSeries, setParticipatedSeries] = useState<SeriesWithSummary[]>([])
  const [bestCarsToBuy, setBestCarsToBuy] = useState<Car[]>([])
  const [bestTracksToBuy, setBestTracksToBuy] = useState<TrackWithConfigName[]>([])
  const [almostEligibleseriesAndContentToBuy, setAlmostEligibleSeriesAndContentToBuy] = useState<
    AlmostEligibleSeriesAndContentsToBuy[]
  >([])
  const [showOwnedContent, setShowOwnedContent] = useState<boolean>(false)
  const [showSeriesEligible, setShowSeriesEligible] = useState<boolean>(false)

  const summarizeSeries = (series: FullSeries): SeriesWithSummary => {
    const tracks: number[] = []
    const cars: number[] = []
    const ownedTracks: number[] = []
    const ownedCars: number[] = []
    let eligible = 0

    series.schedules.forEach((s) => {
      const ownedTrack = s.track.free || commonViewModel.myTracks.find((t) => t.id === s.track.id)
      const ownedCarsInSchedule = s.cars.filter(
        (car) => car.free || commonViewModel.myCars.find((c) => car.id === c.id),
      )

      if (!tracks.includes(s.track.id)) {
        tracks.push(s.track.id)
      }
      s.cars.forEach((car) => {
        if (!cars.includes(car.id)) {
          cars.push(car.id)
        }
      })

      if (ownedTrack && !ownedTracks.includes(s.track.id)) {
        ownedTracks.push(s.track.id)
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
  }

  const filterBestBuys = <T extends Car | TrackWithConfigName>(
    filteredSeries: FullSeries[],
    propertyToFilter: "cars" | "track",
    propertyOfOwnedContent: "myCars" | "myTracks",
  ): T[] => {
    return filteredSeries
      .flatMap((series) => series.schedules.flatMap((s) => s[propertyToFilter] as T))
      .filter(
        (value) =>
          !value.free && (showOwnedContent || !commonViewModel[propertyOfOwnedContent].find((c) => value.id === c.id)),
      )
      .removeDuplicates((value, value2) => value.id === value2.id)
      .filter(
        (car) =>
          commonViewModel.preferredLicenses.some((license) => car.licenses.find((l) => l.id === license.id)) &&
          commonViewModel.preferredCategories.some((category) => car.categories.find((c) => c.id === category.id)),
      )
      .sort((a, b) => b.numberOfSeries - a.numberOfSeries || b.numberOfRaces - a.numberOfRaces)
      .filter((_, index) => index < 10) as T[]
  }

  const wouldBuyingThisContentIncreasesSeriesEligible = (series: SeriesWithSummary, content: Car | Track): boolean => {
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
  }

  const filterAlmostEligibleSeries = (
    seriesWithSummary: SeriesWithSummary[],
  ): AlmostEligibleSeriesAndContentsToBuy[] => {
    const filtered = seriesWithSummary
      .filter(
        (serie) =>
          commonViewModel.preferredLicenses.some((license) => serie.licenses.find((l) => l.id === license.id)) &&
          commonViewModel.preferredCategories.some((category) =>
            serie.schedules.find((c) => c.category.id === category.id),
          ) &&
          serie.eligible < calculateMinimumParticipation(serie),
      )
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
  }

  const changeFilter = () => {
    const seriesWithSummary = (commonViewModel.season?.series ?? []).map(summarizeSeries)
    setParticipatedSeries(
      seriesWithSummary.filter(
        (s) =>
          (calculateMinimumParticipation(s) > 0 &&
            s.eligible >= calculateMinimumParticipation(s) &&
            commonViewModel.preferredLicenses.some((license) =>
              s.licenses.find((l) => l.id === license.id && license.letter !== "R"),
            ) &&
            commonViewModel.preferredCategories.some((category) =>
              s.schedules.find((sc) => sc.category.id === category.id),
            )) ||
          s.participatedRaces > 0,
      ),
    )

    const filteredSeries = seriesWithSummary.filter(
      (a) => showSeriesEligible || a.eligible < calculateMinimumParticipation(a),
    )

    const cars = filterBestBuys<Car>(filteredSeries, "cars", "myCars")
    setBestCarsToBuy(cars)

    const tracks = filterBestBuys<TrackWithConfigName>(filteredSeries, "track", "myTracks")
    setBestTracksToBuy(tracks)

    const almostEligibleSeries = filterAlmostEligibleSeries(seriesWithSummary)
    setAlmostEligibleSeriesAndContentToBuy(almostEligibleSeries)
  }

  const commonViewModel = useCommonViewModel(seasonRepository, userPreferencesRepository)

  return {
    ...commonViewModel,
    participatedSeries,
    bestCarsToBuy,
    bestTracksToBuy,
    almostEligibleseriesAndContentToBuy,
    showOwnedContent,
    setShowOwnedContent,
    showSeriesEligible,
    setShowSeriesEligible,
    changeFilter,
  }
}
