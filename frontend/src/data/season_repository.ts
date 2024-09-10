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
    if (localStorage.getItem(LOCAL_STORAGE_CACHED_DATE_KEY) === "undefined") {
      makeRequest()
      return
    }
    const cachedDate = new Date(localStorage.getItem(LOCAL_STORAGE_CACHED_DATE_KEY) ?? "")

    decompress(localStorage.getItem(LOCAL_STORAGE_SERIES_KEY) ?? "")
      .then((data) => {
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
      })
      .catch(() => {
        makeRequest()
      })
  }, [])

  useEffect(() => {
    if (season) {
      return
    }
    if (data && data.cachedDate) {
      console.log(`Data not found, requested: ${data}`)

      compress(JSON.stringify(data.series)).then((buffer) => {
        localStorage.setItem(LOCAL_STORAGE_SERIES_KEY, buffer)
      })

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

  const compress = async (string: string): Promise<string> => {
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
    return concatenated.join()
  }

  const decompress = async (byteArrayInBase64: string): Promise<string> => {
    if (byteArrayInBase64.length === 0) {
      throw new Error("Invalid string")
    }
    const cs = new DecompressionStream("gzip")
    const writer = cs.writable.getWriter()
    writer.write(byteArrayInBase64)
    writer.close()
    //create the reader
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
    return concatenated.join()
  }

  return { data: season, loading, error, success, invalidateCache }
}
