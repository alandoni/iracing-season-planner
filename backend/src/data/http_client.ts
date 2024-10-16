import axios, { AxiosError, AxiosResponse } from "axios"

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
    try {
      return (await this.axiosInstance(url)).data
    } catch (error) {
      throw this.printableError(error)
    }
  }

  async post<B, R>(url: string, body: B): Promise<R> {
    try {
      const response = await this.axiosInstance<R>(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        data: body,
      })
      this.useSetCookie(response)
      return response.data
    } catch (error) {
      throw this.printableError(error)
    }
  }

  printableError(error: unknown) {
    if (!(error instanceof AxiosError)) {
      return error
    }
    return {
      name: error.name,
      code: error.code,
      request: {
        headers: error.config?.headers,
        method: error.config?.method,
        url: error.config?.url,
        body: JSON.parse(error.config?.data ?? "null"),
      },
      response: {
        status: error.response?.status,
        statusText: error.response?.statusText,
        headers: error.response?.headers,
        data: error.response?.data,
      },
    }
  }
}
