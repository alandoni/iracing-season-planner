import { Series } from "data/series"
import { Season } from "data/season"
import { Schedule } from "data/schedule"
import { useRequest } from "./use_request"
import { useEffect, useState } from "react"

export const LOCAL_STORAGE_CACHED_DATE_KEY = "cachedDate"

export function useSeasonRepository() {
  const LOCAL_STORAGE_CARS_KEY = "cars"
  const LOCAL_STORAGE_TRACKS_KEY = "tracks"
  const LOCAL_STORAGE_SERIES_KEY = "series"
  const LOCAL_STORAGE_LICENSES_KEY = "licenses"
  const LOCAL_STORAGE_CATEGORIES_KEY = "categories"

  const [data, loading, success, error, makeRequest] = useRequest<Season>("season", false)
  const [season, setSeason] = useState<Season>()

  useEffect(() => {
    const cachedDate = new Date(localStorage.getItem(LOCAL_STORAGE_CACHED_DATE_KEY) ?? "")
    const seasonData = {
      cars: JSON.parse(localStorage.getItem(LOCAL_STORAGE_CARS_KEY) ?? "[]"),
      tracks: JSON.parse(localStorage.getItem(LOCAL_STORAGE_TRACKS_KEY) ?? "[]"),
      series: JSON.parse(localStorage.getItem(LOCAL_STORAGE_SERIES_KEY) ?? "[]").map((s: Series) => ({
        ...s,
        schedules: s.schedules.map((sc: Schedule) => ({ ...sc, startDate: new Date(sc.startDate) })),
      })),
      licenses: JSON.parse(localStorage.getItem(LOCAL_STORAGE_LICENSES_KEY) ?? "[]"),
      categories: JSON.parse(localStorage.getItem(LOCAL_STORAGE_CATEGORIES_KEY) ?? "[]"),
      cachedDate: cachedDate,
    }
    const cachedSeason = Object.assign(new Season(), seasonData)
    if (cachedSeason.validate()) {
      console.log(`Using cache, it will expire on ${cachedDate}`)
      setSeason(cachedSeason)
    } else {
      console.log("Making request")
      makeRequest()
    }
  }, [])

  useEffect(() => {
    if (season) {
      return
    }
    if (data && data.cachedDate) {
      console.log(`Data not found, requested: ${data}`)
      localStorage.setItem(LOCAL_STORAGE_CARS_KEY, JSON.stringify(data.cars))
      localStorage.setItem(LOCAL_STORAGE_TRACKS_KEY, JSON.stringify(data.tracks))
      localStorage.setItem(LOCAL_STORAGE_SERIES_KEY, JSON.stringify(data.series))
      localStorage.setItem(LOCAL_STORAGE_LICENSES_KEY, JSON.stringify(data.licenses))
      localStorage.setItem(LOCAL_STORAGE_CATEGORIES_KEY, JSON.stringify(data.categories))
      localStorage.setItem(LOCAL_STORAGE_CACHED_DATE_KEY, String(data.cachedDate) ?? "")
      setSeason(
        Object.assign(new Season(), {
          cars: data.cars,
          tracks: data.tracks,
          series: data.series.map((s: Series) => ({
            ...s,
            schedules: s.schedules.map((sc: Schedule) => ({ ...sc, startDate: new Date(sc.startDate) })),
          })),
          licenses: data.licenses,
          cachedDate: new Date(data.cachedDate),
          categories: data.categories,
        }),
      )
    }
  }, [season, data])

  return { data: season, loading, error, success }
}
