import axios from "axios"
import { useEffect, useMemo, useState } from "react"

export const VITE_API_ADDRESS = import.meta.env.VITE_API_ADDRESS

export function useRequest<T>(
  endpoint: string,
  startOnUse = true,
): [T | undefined, boolean, boolean, unknown, () => void] {
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<unknown>()
  const [data, setData] = useState<T>()

  const [shouldStart, setShouldStartState] = useState(startOnUse)

  const makeRequest = () => () => {
    setLoading(true)
    setSuccess(false)
    setError(undefined)
    axios
      .get<T>(`${VITE_API_ADDRESS}/${endpoint}`)
      .then((data) => {
        setLoading(false)
        setData(data.data)
        setSuccess(true)
      })
      .catch((error) => {
        setSuccess(false)
        setLoading(false)
        setError(error)
      })
  }

  const request = useMemo<() => void>(makeRequest, [endpoint])

  useEffect(() => {
    if (!shouldStart) {
      console.log("shouldn't do the request")
      return
    }
    console.log(`Requesting /${endpoint}`)
    request()
    setShouldStartState(false)
  }, [endpoint, shouldStart, request])

  return [data, loading, success, error, request]
}
