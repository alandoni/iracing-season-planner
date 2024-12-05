import { SeasonRepository } from "src/data/season_repository"
import { UserPreferencesRepository } from "src/data/user_repository"
import { useState } from "react"
import { DI } from "@alandoni/utils"
import { FullSeries, useCommonViewModel } from "./common_view_model"

export function useSeasonViewModel(
  seasonRepository: SeasonRepository = DI.get(SeasonRepository),
  userPreferencesRepository: UserPreferencesRepository = DI.get(UserPreferencesRepository),
) {
  const [filteredSeries, setFilteredSeries] = useState<FullSeries[]>([])
  const [week, setDisplayedWeek] = useState(0)
  const [showOnlySeriesEligible, setShowOnlySeriesEligible] = useState(false)

  const onLoad = async () => {
    await commonViewModel.onLoad()
    goToInitialWeek()
  }

  const goToInitialWeek = () => {
    const firstSeries = commonViewModel.season?.series.find((s) => s.schedules.length > 11 && s.schedules.length < 14)
    if (!firstSeries) {
      return
    }
    const currentSchedule = firstSeries.schedules
      .sort((a, b) => a.startDate.getTime() - b.startDate.getTime())
      .find((s, i, array) => {
        if (i < array.length - 1) {
          return new Date().isBetween(s.startDate, firstSeries.schedules[i + 1].startDate)
        } else {
          return true
        }
      })
    setDisplayedWeek(currentSchedule?.raceWeekNum ?? 0)
    changeFilter()
  }

  const setWeek = (week: number) => {
    setDisplayedWeek(week)
    changeFilter()
  }

  const changeFilter = () => {
    const filtered = [...(commonViewModel.season?.series ?? [])]
      .flatMap((series) => {
        const copy = { ...series }
        copy.schedules = copy.schedules.filter((schedule) => {
          const correctWeek = week === -1 || schedule.raceWeekNum === week
          const containsCategories = (commonViewModel.preferredCategories ?? []).find(
            (c) => c.id === schedule.category.id,
          )
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
  }

  const commonViewModel = useCommonViewModel(seasonRepository, userPreferencesRepository)

  return {
    ...commonViewModel,
    onLoad,
    filteredSeries,
    showOnlySeriesEligible,
    setShowOnlySeriesEligible,
    week,
    setWeek,
  }
}
