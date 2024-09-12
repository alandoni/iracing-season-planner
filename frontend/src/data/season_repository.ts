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

  const onLoad = async () => {
    try {
      const cachedDateInLocalStorage = localStorage.getItem(LOCAL_STORAGE_CACHED_DATE_KEY)
      if (!cachedDateInLocalStorage || cachedDateInLocalStorage === "undefined") {
        makeRequest()
        return
      }
      const cachedDate = new Date(cachedDateInLocalStorage ?? "")
      const data = await decompress(JSON.parse(localStorage.getItem(LOCAL_STORAGE_SERIES_KEY) ?? "[]"))
      const seasonData = {
        cars: JSON.parse(localStorage.getItem(LOCAL_STORAGE_CARS_KEY) ?? "[]"),
        tracks: JSON.parse(localStorage.getItem(LOCAL_STORAGE_TRACKS_KEY) ?? "[]"),
        series: JSON.parse(data ?? "[]").map((s: Series) => ({
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
    } catch (error) {
      console.error(error)
      makeRequest()
    }
  }

  useEffect(() => {
    onLoad()
  }, [])

  const storeData = async (data: Season) => {
    console.log(`Data not found, requested: ${data}`)

    const buffer = await compress(JSON.stringify(data.series))
    localStorage.setItem(LOCAL_STORAGE_SERIES_KEY, JSON.stringify(buffer))

    localStorage.setItem(LOCAL_STORAGE_CARS_KEY, JSON.stringify(data.cars))
    localStorage.setItem(LOCAL_STORAGE_TRACKS_KEY, JSON.stringify(data.tracks))
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

  useEffect(() => {
    if (season) {
      return
    }
    if (data && data.cachedDate) {
      storeData(data)
    }
  }, [season, data])

  const invalidateCache = () => {
    localStorage.removeItem(LOCAL_STORAGE_CARS_KEY)
    localStorage.removeItem(LOCAL_STORAGE_TRACKS_KEY)
    localStorage.removeItem(LOCAL_STORAGE_SERIES_KEY)
    localStorage.removeItem(LOCAL_STORAGE_LICENSES_KEY)
    localStorage.removeItem(LOCAL_STORAGE_CATEGORIES_KEY)
    localStorage.removeItem(LOCAL_STORAGE_CACHED_DATE_KEY)
    makeRequest()
  }

  const compress = async (string: string): Promise<Array<number>> => {
    const byteArray = new TextEncoder().encode(string)
    const cs = new CompressionStream("gzip")
    const writer = cs.writable.getWriter()
    writer.write(byteArray)
    writer.close()
    const reader = cs.readable.getReader()
    let totalSize = 0
    //go through each chunk and add it to the output
    let finished = true
    const output: Uint8Array[] = []
    do {
      const { value, done } = await reader.read()
      if (done) break
      finished = done
      output.push(value)
      totalSize += value.byteLength
    } while (!finished)

    const concatenated = new Uint8Array(totalSize)
    let offset = 0
    //finally build the compressed array and return it
    for (const array of output) {
      concatenated.set(array, offset)
      offset += array.byteLength
    }
    return Array.from(concatenated)
  }

  const decompress = async (byteArray: Array<number>): Promise<string> => {
    if (byteArray.length === 0) {
      throw new Error("Invalid string")
    }
    const ds = new DecompressionStream("gzip")
    const writer = ds.writable.getWriter()

    const uintArray = new Uint8Array(byteArray)
    writer.write(uintArray)
    writer.close()
    //create the reader
    const reader = ds.readable.getReader()
    let totalSize = 0
    //go through each chunk and add it to the output
    let finished = true
    const output: Uint8Array[] = []
    do {
      const { value, done } = await reader.read()
      if (done) break
      finished = done
      output.push(value)
      totalSize += value.byteLength
    } while (!finished)

    const concatenated = new Uint8Array(totalSize)
    let offset = 0
    //finally build the compressed array and return it
    for (const array of output) {
      concatenated.set(array, offset)
      offset += array.byteLength
    }
    return new TextDecoder().decode(concatenated)
  }

  return { data: season, loading, error, success, invalidateCache }
}
