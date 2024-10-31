import { ApiRequest } from "data-utils";
import { LinkResponse } from "../link_response";
import { TrackResponse } from "./track_response";
export declare class TrackApi {
    getTrackLink(): ApiRequest<LinkResponse>;
    getTrack(link: string): ApiRequest<TrackResponse[]>;
}
