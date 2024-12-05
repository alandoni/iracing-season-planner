import { Track } from "racing-tools-data/iracing/season/models/track"
import { useState } from "react"
import { useCommonViewModel } from "./common_view_model"
import { SeasonRepository } from "src/data/season_repository"
import { UserPreferencesRepository } from "src/data/user_repository"
import { DI } from "@alandoni/utils"

export function useTracksViewModel(
  seasonRepository: SeasonRepository = DI.get(SeasonRepository),
  userRepository: UserPreferencesRepository = DI.get(UserPreferencesRepository),
) {
  const [filteredTracks, setFilteredTracks] = useState<Track[]>([])

  const changeFilter = () => {
    const filtered = [...(commonViewModel.season?.tracks ?? [])].filter((track) => {
      const shouldFilter =
        (commonViewModel.preferredLicenses.some((license) => track.licenses.find((l) => l.id === license.id)),
        commonViewModel.preferredCategories.some((category) => track.categories.find((c) => c.id === category.id)))
      if (commonViewModel.search.length === 0) {
        return shouldFilter
      }
      return (
        (shouldFilter &&
          (track.name.find(commonViewModel.search) || track.mainCategory.name.find(commonViewModel.search))) ||
        track.categories.find((c) => c.name.find(commonViewModel.search))
      )
    })
    setFilteredTracks(filtered)
  }

  const commonViewModel = useCommonViewModel(seasonRepository, userRepository)

  return {
    ...commonViewModel,
    filteredTracks,
    changeFilter,
  }
}
