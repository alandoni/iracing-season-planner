import { Car } from "data/car"
import { Schedule } from "data/schedule"
import { Season } from "data/season"
import { Series } from "data/series"
import { Track } from "data/track"
import { Category } from "data/category"
import { License } from "data/license"
import { useState } from "react"
import { removeFromList } from "utils/list"
import { LOCAL_STORAGE_CACHED_DATE_KEY } from "./season_repository"

export class ImportingOlderFileError extends Error {}

type ImportedData = {
  myCarsIds: number[]
  myTracksIds: number[]
  participatedRacesSeriesIdsAndWeekNumber: string[]
  preferredLicensesIds: number[]
  preferredCategoriesIds: number[]
  cachedDateString: string
  updatedDateString: string
}

export function useUserRepository() {
  const LOCAL_STORAGE_MY_CARS_KEY = "myCars"
  const LOCAL_STORAGE_MY_TRACKS_KEY = "myTracks"
  const LOCAL_STORAGE_PARTICIPATED_RACES_KEY = "participatedRaces"
  const LOCAL_STORAGE_PREFERRED_CATEGORIES_KEY = "preferredCategories"
  const LOCAL_STORAGE_PREFERRED_LICENSES_KEY = "preferredLicenses"
  const LOCAL_STORAGE_LAST_UPDATE_KEY = "lastUpdateKey"

  const [myCars, setMyCars] = useState<Car[]>([])
  const [myTracks, setMyTracks] = useState<Track[]>([])
  const [participatedSeries, setParticipatedSeries] = useState<Series[]>([])
  const [participatedRaces, setParticipatedRaces] = useState<Schedule[]>([])

  const [preferredCategories, setPreferredCategories] = useState<Category[]>([])
  const [preferredLicenses, setPreferredLicenses] = useState<License[]>([])

  const load = (season: Season) => {
    const myCarIds: number[] = JSON.parse(localStorage.getItem(LOCAL_STORAGE_MY_CARS_KEY) ?? "[]")
    const myTrackIds: number[] = JSON.parse(localStorage.getItem(LOCAL_STORAGE_MY_TRACKS_KEY) ?? "[]")
    const participatedRacesIds: string[] = JSON.parse(
      localStorage.getItem(LOCAL_STORAGE_PARTICIPATED_RACES_KEY) ?? "[]",
    )
    const preferredCategories: number[] = JSON.parse(
      localStorage.getItem(LOCAL_STORAGE_PREFERRED_CATEGORIES_KEY) ?? "[]",
    )
    const preferredLicenses: number[] = JSON.parse(localStorage.getItem(LOCAL_STORAGE_PREFERRED_LICENSES_KEY) ?? "[]")

    setMyCars(myCarIds.flatMap((id) => season.cars?.find((car) => car.id === id) ?? []))
    setMyTracks(myTrackIds.flatMap((id) => season.tracks?.find((track) => track.id === id) ?? []))

    const participatedSeriesLoaded: Series[] = []
    setParticipatedRaces(
      participatedRacesIds.flatMap((id) =>
        season.series?.flatMap(
          (series) =>
            series.schedules.flatMap((schedule) => {
              if (`${series.id}-${schedule.raceWeekNum}` === id) {
                if (!participatedSeriesLoaded.find((s) => s.id === series.id)) {
                  participatedSeriesLoaded.push(series)
                }
                return [schedule]
              } else {
                return []
              }
            }) ?? [],
        ),
      ),
    )

    setParticipatedSeries(participatedSeriesLoaded)

    if (preferredCategories.length > 0) {
      setPreferredCategories(preferredCategories.flatMap((id) => season.categories?.find((cat) => cat.id === id) ?? []))
    } else {
      setPreferredCategories([...season.categories])
    }
    if (preferredLicenses.length > 0) {
      setPreferredLicenses(preferredLicenses.flatMap((id) => season.licenses?.find((lic) => lic.id === id) ?? []))
    } else {
      setPreferredLicenses([...season.licenses])
    }
  }

  const setCar = (checked: boolean, car: Car) => {
    setMyCars((old) => {
      if (checked) {
        old.push(car)
      } else {
        removeFromList(car, old, (c1, c2) => c1.id === c2.id)
      }
      localStorage.setItem(LOCAL_STORAGE_MY_CARS_KEY, JSON.stringify(old.map((i) => i.id)))
      return [...old]
    })
    updateLastChangedDate()
  }

  const setTrack = (checked: boolean, track: Track) => {
    setMyTracks((old) => {
      if (checked) {
        old.push(track)
      } else {
        removeFromList(track, old, (c1, c2) => c1.id === c2.id)
      }
      localStorage.setItem(LOCAL_STORAGE_MY_TRACKS_KEY, JSON.stringify(old.map((i) => i.id)))
      return [...old]
    })
    updateLastChangedDate()
  }

  const setParticipatedRace = (checked: boolean, serie: Series, schedule: Schedule) => {
    setParticipatedRaces((old) => {
      if (checked) {
        old.push(schedule)
      } else {
        removeFromList(schedule, old, (c1, c2) => c1.serieId === c2.serieId && c1.raceWeekNum === c2.raceWeekNum)
      }
      localStorage.setItem(
        LOCAL_STORAGE_PARTICIPATED_RACES_KEY,
        JSON.stringify(old?.map((i) => `${i.serieId}-${i.raceWeekNum}`)),
      )
      return [...old]
    })

    setParticipatedSeries((old) => {
      if (checked) {
        old.push(serie)
      } else {
        const shouldRemoveSerie = old?.some((series) =>
          series.schedules.flatMap(
            (schedule) =>
              participatedRaces?.find(
                (s) => schedule.serieId === s.serieId && schedule.raceWeekNum && schedule.raceWeekNum,
              ) ?? [],
          ),
        )
        if (!shouldRemoveSerie) {
          removeFromList(serie, old, (c1, c2) => c1.id === c2.id)
        }
      }
      return [...old]
    })
    updateLastChangedDate()
  }

  const setPreferredLicense = (checked: boolean, license: License) => {
    setPreferredLicenses((old) => {
      if (checked) {
        old.push(license)
      } else {
        removeFromList(license, old, (c1, c2) => c1.id === c2.id)
      }
      localStorage.setItem(LOCAL_STORAGE_PREFERRED_LICENSES_KEY, JSON.stringify(old.map((i) => i.id)))
      return [...old]
    })
  }

  const setPreferredCategory = (checked: boolean, license: Category) => {
    setPreferredCategories((old) => {
      if (checked) {
        old.push(license)
      } else {
        removeFromList(license, old, (c1, c2) => c1.id === c2.id)
      }
      localStorage.setItem(LOCAL_STORAGE_PREFERRED_CATEGORIES_KEY, JSON.stringify(old.map((i) => i.id)))
      return [...old]
    })
  }

  const updateLastChangedDate = () => {
    localStorage.setItem(LOCAL_STORAGE_LAST_UPDATE_KEY, new Date().toISOString())
  }

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
    console.log(content)
    const date = new Date(localStorage.getItem(LOCAL_STORAGE_LAST_UPDATE_KEY) ?? "")
    if (!force && date.getTime() > new Date(content.cachedDateString).getTime()) {
      throw new ImportingOlderFileError()
    }

    localStorage.setItem(LOCAL_STORAGE_MY_CARS_KEY, JSON.stringify(content.myCarsIds))
    localStorage.setItem(LOCAL_STORAGE_MY_TRACKS_KEY, JSON.stringify(content.myTracksIds))
    localStorage.setItem(
      LOCAL_STORAGE_PARTICIPATED_RACES_KEY,
      JSON.stringify(content.participatedRacesSeriesIdsAndWeekNumber),
    )
    localStorage.setItem(LOCAL_STORAGE_PREFERRED_CATEGORIES_KEY, JSON.stringify(content.preferredCategoriesIds))
    localStorage.setItem(LOCAL_STORAGE_PREFERRED_LICENSES_KEY, JSON.stringify(content.preferredLicensesIds))
    localStorage.setItem(LOCAL_STORAGE_LAST_UPDATE_KEY, new Date().toISOString())
  }

  const exportData = async () => {
    const myCarsIds: number[] = JSON.parse(localStorage.getItem(LOCAL_STORAGE_MY_CARS_KEY) ?? "[]")
    const myTracksIds: number[] = JSON.parse(localStorage.getItem(LOCAL_STORAGE_MY_TRACKS_KEY) ?? "[]")
    const participatedRacesIds: string[] = JSON.parse(
      localStorage.getItem(LOCAL_STORAGE_PARTICIPATED_RACES_KEY) ?? "[]",
    )
    const preferredCategories: number[] = JSON.parse(
      localStorage.getItem(LOCAL_STORAGE_PREFERRED_CATEGORIES_KEY) ?? "[]",
    )
    const preferredLicenses: number[] = JSON.parse(localStorage.getItem(LOCAL_STORAGE_PREFERRED_LICENSES_KEY) ?? "[]")

    const dataToExport: ImportedData = {
      myCarsIds,
      myTracksIds,
      participatedRacesSeriesIdsAndWeekNumber: participatedRacesIds,
      preferredLicensesIds: preferredLicenses,
      preferredCategoriesIds: preferredCategories,
      cachedDateString: localStorage.getItem(LOCAL_STORAGE_CACHED_DATE_KEY) ?? "",
      updatedDateString: localStorage.getItem(LOCAL_STORAGE_LAST_UPDATE_KEY) ?? "",
    }
    const content = JSON.stringify(dataToExport)
    const blob = new Blob([content], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    return url
  }

  return {
    load,
    myCars,
    setCar,
    myTracks,
    setTrack,
    participatedRaces,
    setParticipatedRace,
    participatedSeries,
    preferredLicenses,
    setPreferredLicense,
    preferredCategories,
    setPreferredCategory,
    importData,
    exportData,
  }
}
