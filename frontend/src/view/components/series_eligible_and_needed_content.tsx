import { Car } from "data/car"
import { Track } from "data/track"
import { Row } from "./row"
import { Column } from "./column"
import { CarRow } from "./car_row"
import { TrackRow } from "./track_row"
import { ParticipatedSeriesRow, SeriesWithSummary } from "./participated_series_row"
import "./series_eligible_and_needed_content.css"

export type AlmostEligibleSeriesAndContentsToBuy = {
  series: SeriesWithSummary
  tracks: Track[]
  cars: Car[]
}

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
