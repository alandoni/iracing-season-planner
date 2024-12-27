import { SeasonRepository } from "src/modules/iracing/data/season_repository"
import { UserPreferencesRepository } from "src/modules/iracing/data/user_preferences_repository"
import { DI } from "@alandoni/utils"

export class ImportingOlderFileError extends Error {}

type ImportedData = {
  myCarsIds: number[]
  myTracksIds: number[]
  participatedRacesSeriesIdsAndWeekNumber: string[]
  preferredLicensesIds: number[]
  preferredCategoriesIds: number[]
  updatedDateString: string
}

export function useImportExportViewModel(
  seasonRepository: SeasonRepository = DI.get(SeasonRepository),
  userPreferencesRepository: UserPreferencesRepository = DI.get(UserPreferencesRepository),
) {
  const importData = async (path: File, force = false) => {
    const reader = new FileReader()

    const content = await new Promise<ImportedData>((resolve, reject) => {
      reader.onload = () => {
        return (e: ProgressEvent<FileReader>) => {
          const contentOfFile = JSON.parse((e.target?.result as string) ?? "")
          if (contentOfFile) {
            resolve(contentOfFile)
          } else {
            reject()
          }
        }
      }
      reader.onerror = (event: ProgressEvent<FileReader>) => {
        reject(event.target?.error)
      }
      reader.readAsText(path)
    })

    const date = userPreferencesRepository.getLastUpdatedDate()
    if (!force && date && date.getTime() > new Date(content.updatedDateString).getTime()) {
      throw new ImportingOlderFileError()
    }

    userPreferencesRepository.setUserPreferences({
      lastUpdatedDate: new Date(),
      myCarsIds: content.myCarsIds,
      myTracksIds: content.myTracksIds,
      participatedRacesIds: content.participatedRacesSeriesIdsAndWeekNumber,
      preferredCategories: content.preferredCategoriesIds,
      preferredLicenses: content.preferredLicensesIds,
    })
  }

  const exportData = async () => {
    const preferences = userPreferencesRepository.getUserPreferences()

    if (!preferences) {
      return null
    }

    const dataToExport: ImportedData = {
      myCarsIds: preferences.myCarsIds,
      myTracksIds: preferences.myTracksIds,
      participatedRacesSeriesIdsAndWeekNumber: preferences.participatedRacesIds,
      preferredLicensesIds: preferences.preferredLicenses,
      preferredCategoriesIds: preferences.preferredCategories,
      updatedDateString: preferences.lastUpdatedDate.toISOString(),
    }
    const content = JSON.stringify(dataToExport)
    const blob = new Blob([content], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    return url
  }

  const invalidateCache = async () => {
    seasonRepository.invalidateCache()
    window.location.reload()
  }

  return {
    importData,
    exportData,
    invalidateCache,
  }
}
