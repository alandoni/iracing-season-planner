import { BuiltRequest, Interceptor } from "data-utils";
export declare class MPHeadersInterceptor implements Interceptor {
    executeBefore<Response extends object, RequestBodyType extends string | object>(apiRequest: BuiltRequest<Response, RequestBodyType>): Promise<void>;
}
