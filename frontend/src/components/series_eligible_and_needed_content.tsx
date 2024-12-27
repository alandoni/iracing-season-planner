import { Car } from "racing-tools-data/iracing/season/models/car"
import { Track } from "racing-tools-data/iracing/season/models/track"
import { Row } from "@alandoni/frontend/components/atoms/row"
import { Column } from "@alandoni/frontend/components/atoms/column"
import { CarRow } from "./car_row.js"
import { TrackRow } from "./track_row.js"
import { ParticipatedSeriesRow } from "./participated_series_row.js"
import "./series_eligible_and_needed_content.css"
import { AlmostEligibleSeriesAndContentsToBuy } from "src/modules/iracing/views/pages/summary/summary_view_model.js"

type AlmostEligibleSeriesProps = {
  series: AlmostEligibleSeriesAndContentsToBuy
  isCarOwned: (car: Car) => boolean
  isTrackOwned: (track: Track) => boolean
  onChangeOwnedCar: (checked: boolean, car: Car) => void
  onChangeOwnedTrack: (checked: boolean, track: Track) => void
}

export function AlmostEligibleSeries({
  series,
  isCarOwned,
  isTrackOwned,
  onChangeOwnedCar,
  onChangeOwnedTrack,
}: AlmostEligibleSeriesProps) {
  return (
    <Row className="series-eligible-and-needed-content">
      <Column>
        <ParticipatedSeriesRow series={series.series} />
        <div className="section">
          {series.cars.map((car) => {
            return (
              <div key={car.id}>
                <CarRow car={car} selected={isCarOwned(car)} onSelect={onChangeOwnedCar} />
              </div>
            )
          })}

          {series.tracks.map((track) => {
            return (
              <div key={track.id}>
                <TrackRow track={track} selected={isTrackOwned(track)} onSelect={onChangeOwnedTrack} />
              </div>
            )
          })}
        </div>
      </Column>
    </Row>
  )
}
