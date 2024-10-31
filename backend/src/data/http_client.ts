import axios, { AxiosError } from "axios"
import { CommonResponse, HttpClient, Headers, RequestBody, ResponseBody, HttpMethod, Interceptor } from "data-utils"

export class AxiosHttpClient extends HttpClient {
  constructor(url: string, interceptors: Interceptor[]) {
    super(url, interceptors)
  }

  async fetch<Response extends ResponseBody>(
    url: string,
    config: { headers?: Headers; method: HttpMethod; body?: RequestBody },
  ): Promise<CommonResponse<Response>> {
    try {
      console.log(JSON.stringify(config, null, 2))
      const response = await axios.request<Response>({
        url,
        data: config.body,
        method: config.method.toString(),
        headers: config.headers,
      })
      console.log(
        JSON.stringify(
          {
            data: response.data,
            headers: response.headers,
          },
          null,
          2,
        ),
      )
      return response
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
