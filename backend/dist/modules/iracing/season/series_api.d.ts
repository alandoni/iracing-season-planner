import { ApiRequest } from "data-utils";
import { LinkResponse } from "../link_response";
import { SeriesResponse } from "./series_response";
export declare class SeriesApi {
    getSeriesLink(): ApiRequest<LinkResponse>;
    getSeries(link: string): ApiRequest<SeriesResponse[]>;
}
