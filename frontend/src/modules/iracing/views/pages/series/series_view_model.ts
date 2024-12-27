import { useEffect, useState } from "react"
import { FullSeries, useCommonViewModel } from "../common_view_model"
import { SeasonRepository } from "src/modules/iracing/data/season_repository"
import { UserPreferencesRepository } from "src/modules/iracing/data/user_preferences_repository"
import { DI, Logger } from "@alandoni/utils"
import { ConsoleLogger } from "@alandoni/frontend/utils/logger"
import { SeasonRepositoryInterface } from "racing-tools-data/iracing/season/season_repository_interface"

export function useSeriesViewModel(
  seasonRepository: SeasonRepositoryInterface = DI.get(SeasonRepository),
  userRepository: UserPreferencesRepository = DI.get(UserPreferencesRepository),
  logger: Logger = DI.get(ConsoleLogger),
) {
  const [filteredSeries, setFilteredSeries] = useState<FullSeries[]>([])
  const commonViewModel = useCommonViewModel(seasonRepository, userRepository, logger)

  useEffect(() => {
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
  }, [
    commonViewModel.preferredCategories,
    commonViewModel.preferredLicenses,
    commonViewModel.search,
    commonViewModel.season?.series,
  ])

  return {
    ...commonViewModel,
    filteredSeries,
  }
}
