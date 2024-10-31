import { HttpClient } from "data-utils";
import { TrackResponse } from "./track_response";
import { TrackApi } from "./track_api";
export declare class TrackService {
    private httpClient;
    private api;
    constructor(httpClient: HttpClient, api: TrackApi);
    getTracks(): Promise<TrackResponse[]>;
}
