import { Interceptor, ResponseBody, RequestBody, BuiltRequest, ResponseWrapper } from "data-utils";
export declare class IRacingHeadersInterceptor implements Interceptor {
    executeBefore<Response extends ResponseBody, RequestBodyType extends RequestBody>(apiRequest: BuiltRequest<Response, RequestBodyType>): Promise<void>;
    executeAfter<T, Response extends ResponseWrapper<T>>(response: Response): Promise<Response>;
    private parseCookies;
}
