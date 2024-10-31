import { uuid } from "utils"
import { BuiltRequest, Interceptor } from "data-utils"

export class MPHeadersInterceptor implements Interceptor {
  executeBefore<Response extends object, RequestBodyType extends string | object>(
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
