import { DI, Logger } from "@alandoni/utils"
import { Car } from "racing-tools-data/iracing/season/models/car"
import { SeasonRepository } from "src/data/season_repository"
import { UserPreferencesRepository } from "src/data/user_repository"
import { useEffect, useState } from "react"
import { useCommonViewModel } from "./common_view_model"
import { ConsoleLogger } from "@alandoni/frontend/utils/logger"

export function useCarsViewModel(
  seasonRepository: SeasonRepository = DI.get(SeasonRepository),
  userRepository: UserPreferencesRepository = DI.get(UserPreferencesRepository),
  logger: Logger = DI.get(ConsoleLogger),
) {
  const commonViewModel = useCommonViewModel(seasonRepository, userRepository, logger)
  const [filteredCars, setFilteredCars] = useState<Car[]>([])

  useEffect(() => {
    if (!commonViewModel.season) {
      return
    }
    console.log(commonViewModel.season)
    const filtered = [...(commonViewModel.season?.cars ?? [])].filter((car) => {
      const shouldFilter =
        commonViewModel.preferredLicenses.some((license) => car.licenses.find((l) => l.id === license.id)) &&
        commonViewModel.preferredCategories.some((category) => car.categories.find((c) => c.id === category.id))
      console.log(shouldFilter)
      if (commonViewModel.search.length === 0) {
        return shouldFilter
      }
      return (
        shouldFilter &&
        (car.name.find(commonViewModel.search) ||
          car.categories.find((cat) => cat.name.find(commonViewModel.search)) !== undefined)
      )
    })

    setFilteredCars(filtered)
  }, [
    commonViewModel.season,
    commonViewModel.preferredCategories,
    commonViewModel.preferredLicenses,
    commonViewModel.search,
  ])

  return {
    ...commonViewModel,
    filteredCars,
  }
}
