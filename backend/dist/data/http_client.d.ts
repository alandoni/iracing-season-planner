import { CommonResponse, HttpClient, Headers, RequestBody, ResponseBody, HttpMethod, Interceptor } from "data-utils";
export declare class AxiosHttpClient extends HttpClient {
    constructor(url: string, interceptors: Interceptor[]);
    fetch<Response extends ResponseBody>(url: string, config: {
        headers?: Headers;
        method: HttpMethod;
        body?: RequestBody;
    }): Promise<CommonResponse<Response>>;
    printableError(error: unknown): unknown;
}
