import { SeasonRepository } from "src/modules/iracing/data/season_repository"
import { UserPreferencesRepository } from "src/modules/iracing/data/user_preferences_repository"
import { useEffect, useState } from "react"
import { DI, Logger } from "@alandoni/utils"
import { FullSeries, useCommonViewModel } from "../common_view_model"
import { ConsoleLogger } from "@alandoni/frontend/utils/logger"
import { SeasonRepositoryInterface } from "racing-tools-data/iracing/season/season_repository_interface"

export const MIN_RACES_IN_VALID_SERIES = 11
export const MAX_RACES_IN_VALID_SERIES = 14

export function useSeasonViewModel(
  seasonRepository: SeasonRepositoryInterface = DI.get(SeasonRepository),
  userPreferencesRepository: UserPreferencesRepository = DI.get(UserPreferencesRepository),
  logger: Logger = DI.get(ConsoleLogger),
) {
  const [filteredSeries, setFilteredSeries] = useState<FullSeries[]>([])
  const [week, setDisplayedWeek] = useState<number>()
  const [showOnlySeriesEligible, setShowOnlySeriesEligible] = useState(false)
  const commonViewModel = useCommonViewModel(seasonRepository, userPreferencesRepository, logger)

  const setWeek = (week: number) => {
    setDisplayedWeek(week)
  }

  useEffect(() => {
    if (week !== undefined || !commonViewModel.season) {
      return
    }
    const firstSeries = commonViewModel.season.series.find((s) => {
      return s.schedules.length > MIN_RACES_IN_VALID_SERIES && s.schedules.length < MAX_RACES_IN_VALID_SERIES
    })
    if (!firstSeries) {
      setDisplayedWeek(-1)
      return
    }
    const currentSchedule = firstSeries.schedules
      .sort((a, b) => a.startDate.getTime() - b.startDate.getTime())
      .find((s, i, array) => {
        if (i < array.length - 1) {
          const result = new Date().isBetween(s.startDate, firstSeries.schedules[i + 1].startDate)
          return result
        } else {
          return false
        }
      })
    setDisplayedWeek(currentSchedule?.raceWeekNum ?? -1)
  }, [commonViewModel.season, week])

  useEffect(() => {
    if (!commonViewModel.season || week === undefined) {
      return
    }
    const filtered = [...commonViewModel.season.series]
      .flatMap((series) => {
        const copy = { ...series }
        copy.schedules = copy.schedules.filter((schedule) => {
          const correctWeek = week === -1 || schedule.raceWeekNum === week
          const containsCategories = commonViewModel.preferredCategories.find((c) => c.id === schedule.category.id)
          const ownedTrack = schedule.track.free || commonViewModel.myTracks.find((t) => t.id === schedule.track.id)
          const ownedCarsInSchedule = schedule.cars.filter(
            (car) => car.free || commonViewModel.myCars.find((c) => car.id === c.id),
          )
          const eligible = ownedTrack && ownedCarsInSchedule.length > 0
          return correctWeek && containsCategories && (!showOnlySeriesEligible || (showOnlySeriesEligible && eligible))
        })
        return copy
      })
      .filter((series) => {
        const shouldFilter =
          series.schedules.length > 0 &&
          series.licenses.find((license) => commonViewModel.preferredLicenses.map((l) => l.id).includes(license.id))
        if (commonViewModel.search.length === 0) {
          return shouldFilter
        }
        const findInSeries =
          series.name.find(commonViewModel.search) ||
          series.schedules.find((s) => s.category.name.find(commonViewModel.search)) !== undefined
        const findInCar =
          series.schedules.find((s) =>
            s.cars.find(
              (c) =>
                c.name.find(commonViewModel.search) ||
                c.categories.find((cat) => cat.name.find(commonViewModel.search)),
            ),
          ) !== undefined
        const findInTrack =
          series.schedules.find(
            (s) =>
              s.track.name.find(commonViewModel.search) ||
              s.category.name.find(commonViewModel.search) ||
              s.track.categories.find((c) => c.name.find(commonViewModel.search)) !== undefined,
          ) !== undefined

        return shouldFilter && (findInSeries || findInCar || findInTrack)
      })
    setFilteredSeries([...filtered])
  }, [
    commonViewModel.myCars,
    commonViewModel.myTracks,
    commonViewModel.preferredCategories,
    commonViewModel.preferredLicenses,
    commonViewModel.search,
    commonViewModel.season,
    showOnlySeriesEligible,
    week,
  ])

  return {
    ...commonViewModel,
    filteredSeries,
    showOnlySeriesEligible,
    setShowOnlySeriesEligible,
    week,
    setWeek,
  }
}
