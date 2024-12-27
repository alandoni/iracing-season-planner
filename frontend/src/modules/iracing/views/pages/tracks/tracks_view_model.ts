import { Track } from "racing-tools-data/iracing/season/models/track"
import { useEffect, useState } from "react"
import { useCommonViewModel } from "../common_view_model"
import { SeasonRepository } from "src/modules/iracing/data/season_repository"
import { UserPreferencesRepository } from "src/modules/iracing/data/user_preferences_repository"
import { DI, Logger } from "@alandoni/utils"
import { SeasonRepositoryInterface } from "racing-tools-data/iracing/season/season_repository_interface"
import { ConsoleLogger } from "@alandoni/frontend/utils/logger"

export function useTracksViewModel(
  seasonRepository: SeasonRepositoryInterface = DI.get(SeasonRepository),
  userRepository: UserPreferencesRepository = DI.get(UserPreferencesRepository),
  logger: Logger = DI.get(ConsoleLogger),
) {
  const [filteredTracks, setFilteredTracks] = useState<Track[]>([])
  const commonViewModel = useCommonViewModel(seasonRepository, userRepository, logger)

  useEffect(() => {
    if (!commonViewModel.season) {
      return
    }
    const filtered = [...commonViewModel.season.tracks].filter((track) => {
      const shouldFilter =
        (commonViewModel.preferredLicenses.some((license) => track.licenses.find((l) => l.id === license.id)),
        commonViewModel.preferredCategories.some((category) => track.categories.find((c) => c.id === category.id)))
      if (commonViewModel.search.length === 0) {
        return shouldFilter
      }
      return (
        (shouldFilter &&
          (track.name.find(commonViewModel.search) || track.mainCategory.name.find(commonViewModel.search))) ||
        track.categories.find(
          (c) => c.name.find(commonViewModel.search) || track.configs.find((c) => c.name.find(commonViewModel.search)),
        )
      )
    })
    setFilteredTracks(filtered)
  }, [
    commonViewModel.preferredCategories,
    commonViewModel.preferredLicenses,
    commonViewModel.search,
    commonViewModel.season,
  ])

  return {
    ...commonViewModel,
    filteredTracks,
  }
}
