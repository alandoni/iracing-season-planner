import axios, { AxiosResponse, Method } from "axios"
import { useEffect, useState } from "react"

export const VITE_API_ADDRESS = import.meta.env.VITE_API_ADDRESS

export function useRequest<T>(
  endpoint: string,
  startOnUse = true,
): [
  T | undefined,
  boolean,
  boolean,
  unknown,
  <R>(method?: Method, payload?: R, headers?: Record<string, string>) => void,
  () => void,
] {
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<unknown>()
  const [data, setData] = useState<T>()

  const [shouldStart, setShouldStartState] = useState(startOnUse)

  const makeRequest = <R>(method: Method = "GET", data?: R, headers?: Record<string, string>) => {
    setLoading(true)
    setSuccess(false)
    setError(undefined)
    axios
      .request<T, AxiosResponse<T>, R>({ method, url: `${VITE_API_ADDRESS}/${endpoint}`, data, headers })
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

  const reset = () => {
    setLoading(false)
    setSuccess(false)
    setError(undefined)
    setData(undefined)
  }

  useEffect(() => {
    if (!shouldStart) {
      console.log("shouldn't do the request")
      return
    }
    console.log(`Requesting /${endpoint}`)
    makeRequest()
    setShouldStartState(false)
  }, [endpoint, shouldStart])

  return [data, loading, success, error, makeRequest, reset]
}
