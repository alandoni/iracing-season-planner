import { uuid } from "@alandoni/utils"
import { BuiltRequest, Interceptor, RequestBody } from "@alandoni/data-utils"

export class MPHeadersInterceptor implements Interceptor {
  executeBefore<Response extends object, RequestBodyType extends RequestBody | undefined>(
    apiRequest: BuiltRequest<Response, RequestBodyType>,
  ): Promise<void> {
    apiRequest.headers = {
      ...apiRequest.headers,
      Authorization: `Bearer ${process.env.MP_ACCESS_TOKEN}`,
      "Content-Type": "application/json",
      "X-Idempotency-Key": uuid(),
    }
    return Promise.resolve()
  }
}
