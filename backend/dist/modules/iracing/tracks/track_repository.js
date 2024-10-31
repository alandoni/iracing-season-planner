"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TrackRepository = void 0;
const category_1 = require("data/iracing/season/models/category");
class TrackRepository {
    trackService;
    static NURBURGRING_COMBINED_NEW_ID = 999999;
    constructor(trackService) {
        this.trackService = trackService;
    }
    async getTracks() {
        const tracks = await this.trackService.getTracks();
        return tracks.reduce(this.fromTrackResponseToTrack, new Array());
    }
    fromTrackResponseToTrack(trackArray, track) {
        if (track.sku === 0 && track.config_name.includes("Gesamtstrecke")) {
            track.sku = TrackRepository.NURBURGRING_COMBINED_NEW_ID;
            track.price = 5.0;
        }
        const found = trackArray.findIndex((t) => {
            return track.sku === t.id;
        });
        const config = {
            name: track.config_name,
            closes: track.closes,
            opens: track.opens,
            id: track.track_id,
            dirpath: track.track_dirpath,
            length: track.track_config_length,
            corners: track.corners_per_lap,
        };
        if (found > -1) {
            trackArray[found].configs.push(config);
        }
        else {
            trackArray.push({
                mainCategory: new category_1.Category(track.category_id, track.category),
                categories: [],
                location: track.location,
                maxCars: track.max_cars,
                name: track.track_name,
                free: track.price === 0,
                price: track.price,
                retired: track.retired,
                url: track.site_url,
                id: track.sku,
                types: track.track_types.map((type) => type.track_type),
                rainEnabled: track.rain_enabled,
                configs: [config],
                licenses: [],
                numberOfRaces: 0,
                numberOfSeries: 0,
                seriesIds: [],
            });
        }
        return trackArray;
    }
}
exports.TrackRepository = TrackRepository;
//# sourceMappingURL=track_repository.js.map