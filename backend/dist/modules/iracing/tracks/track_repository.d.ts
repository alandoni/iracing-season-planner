import { Track } from "data/iracing/season/models/track";
import { TrackService } from "./track_service";
export declare class TrackRepository {
    private trackService;
    private static NURBURGRING_COMBINED_NEW_ID;
    constructor(trackService: TrackService);
    getTracks(): Promise<Track[]>;
    private fromTrackResponseToTrack;
}
