import axios, { AxiosResponse } from "axios"

export class HttpClient {
  private axiosInstance = axios.create()

  private useSetCookie(response: AxiosResponse) {
    this.axiosInstance.defaults.headers.Cookie = this.parseCookies(response)
  }

  private parseCookies(response: AxiosResponse) {
    const raw = response.headers["set-cookie"]
    return (
      raw
        ?.map((entry) => {
          const parts = entry.split(";")
          const cookiePart = parts[0]
          return cookiePart
        })
        ?.join(";") ?? ""
    )
  }

  async get<R>(url: string): Promise<R> {
    return (await this.axiosInstance(url)).data
  }

  async post<B, R>(url: string, body: B): Promise<R> {
    const response = await this.axiosInstance<R>(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      data: body,
    })
    this.useSetCookie(response)
    return response.data
  }
}
