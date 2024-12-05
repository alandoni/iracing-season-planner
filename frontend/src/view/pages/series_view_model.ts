import { useState } from "react"
import { FullSeries, useCommonViewModel } from "./common_view_model"
import { SeasonRepository } from "src/data/season_repository"
import { UserPreferencesRepository } from "src/data/user_repository"
import { DI } from "@alandoni/utils"

export function useSeriesViewModel(
  seasonRepository: SeasonRepository = DI.get(SeasonRepository),
  userRepository: UserPreferencesRepository = DI.get(UserPreferencesRepository),
) {
  const [filteredSeries, setFilteredSeries] = useState<FullSeries[]>([])

  const changeFilter = () => {
    const filtered = [...(commonViewModel.season?.series ?? [])].filter((series) => {
      const shouldFilter =
        commonViewModel.preferredLicenses.some((license) => series.licenses.find((l) => l.id === license.id)) &&
        commonViewModel.preferredCategories.some((category) =>
          series.schedules.find((s) => s.category.id === category.id),
        ) &&
        series.schedules.length > 0
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
              c.name.find(commonViewModel.search) || c.categories.find((cat) => cat.name.find(commonViewModel.search)),
          ),
        ) !== undefined
      const findInTrack =
        series.schedules.find(
          (s) =>
            s.track.name.find(commonViewModel.search) ||
            s.track.mainCategory.name.find(commonViewModel.search) ||
            s.track.categories.find((c) => c.name.find(commonViewModel.search)) !== undefined,
        ) !== undefined

      return shouldFilter && (findInSeries || findInCar || findInTrack)
    })
    setFilteredSeries(filtered)
  }

  const commonViewModel = useCommonViewModel(seasonRepository, userRepository)

  return {
    ...commonViewModel,
    changeFilter,
    filteredSeries,
  }
}
