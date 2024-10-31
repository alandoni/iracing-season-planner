import { HttpClient } from "data-utils";
import { SeriesResponse } from "./series_response";
import { SeriesApi } from "./series_api";
export declare class SeriesService {
    private httpClient;
    private api;
    constructor(httpClient: HttpClient, api: SeriesApi);
    getSeries(): Promise<SeriesResponse[]>;
}
