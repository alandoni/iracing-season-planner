import axios, { AxiosError } from "axios"
import { CommonResponse, HttpClient, ResponseBody, Interceptor, HttpClientConfig, RequestBody } from "data-utils"
import { printableRequest } from "backend/printable_request"

export class AxiosHttpClient extends HttpClient {
  constructor(url: string, interceptors: Interceptor[]) {
    super(url, interceptors)
  }

  async fetch<Response extends ResponseBody, Body extends RequestBody>(
    url: string,
    config: HttpClientConfig<Body>,
  ): Promise<CommonResponse<Response>> {
    try {
      const response = await axios.request<Response>({
        url: config.endpoint.startsWith("https://") ? config.endpoint : url,
        data: config.body,
        method: config.method.toString(),
        headers: config.headers,
      })

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
      request: error.response ? printableRequest(error.response?.request) : undefined,
      response: {
        status: error.response?.status,
        statusText: error.response?.statusText,
        headers: error.response?.headers,
        data: error.response?.data,
      },
    }
  }
}
