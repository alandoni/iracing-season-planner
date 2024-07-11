import { Car } from "data/cars/car"
import { Schedule } from "data/season/schedule"
import { Season } from "data/season/season"
import { Series } from "data/season/series"
import { useState } from "react"
import { removeFromList } from "utils/list"

export function useUserRepository() {
  const LOCAL_STORAGE_MY_CARS_KEY = "myCars"
  const LOCAL_STORAGE_MY_TRACKS_KEY = "myTracks"
  const LOCAL_STORAGE_PARTICIPATED_RACES_KEY = "participatedRaces"
  const LOCAL_STORAGE_PREFERRED_CATEGORIES_KEY = "preferredCategories"
  const LOCAL_STORAGE_PREFERRED_LICENSES_KEY = "preferredLicenses"

  const [myCars, setMyCars] = useState<Car[]>([])
  const [myTracks, setMyTracks] = useState<Track[]>([])
  const [participatedSeries, setParticipatedSeries] = useState<Series[]>([])
  const [participatedRaces, setParticipatedRaces] = useState<Schedule[]>([])

  const [preferredCategories, setPreferredCategories] = useState<Category[]>([])
  const [preferredLicenses, setPreferredLicenses] = useState<License[]>([])

  const load = (season: Season) => {
    const myCarIds: number[] = JSON.parse(localStorage.getItem(LOCAL_STORAGE_MY_CARS_KEY)) ?? []
    const myTrackIds: number[] = JSON.parse(localStorage.getItem(LOCAL_STORAGE_MY_TRACKS_KEY)) ?? []
    const participatedRacesIds: number[] = JSON.parse(localStorage.getItem(LOCAL_STORAGE_PARTICIPATED_RACES_KEY)) ?? []
    const preferredCategories: number[] = JSON.parse(localStorage.getItem(LOCAL_STORAGE_PREFERRED_CATEGORIES_KEY)) ?? []
    const preferredLicenses: number[] = JSON.parse(localStorage.getItem(LOCAL_STORAGE_PREFERRED_LICENSES_KEY)) ?? []

    setMyCars(myCarIds.map((id) => season.cars?.find((car) => car.id === id)))
    setMyTracks(myTrackIds.map((id) => season.tracks?.find((track) => track.id === id)))

    const participatedSeriesLoaded = []
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
      setPreferredCategories(preferredCategories.map((id) => season.categories?.find((cat) => cat.id === id)))
    } else {
      setPreferredCategories([...season.categories])
    }
    if (preferredLicenses.length > 0) {
      setPreferredLicenses(preferredLicenses.map((id) => season.licenses?.find((lic) => lic.id === id)))
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
  }

  const setTrack = (checked: boolean, car: Track) => {
    setMyTracks((old) => {
      if (checked) {
        old.push(car)
      } else {
        removeFromList(car, old, (c1, c2) => c1.id === c2.id)
      }
      localStorage.setItem(LOCAL_STORAGE_MY_TRACKS_KEY, JSON.stringify(old.map((i) => i.id)))
      return [...old]
    })
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
          series.schedules.map((schedule) => participatedRaces?.find((s) => schedule.id === s.id)),
        )
        if (!shouldRemoveSerie) {
          removeFromList(serie, old, (c1, c2) => c1.id === c2.id)
        }
      }
      return [...old]
    })
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
  }
}
