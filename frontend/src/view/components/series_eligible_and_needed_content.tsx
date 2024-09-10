import { Car } from "data/car"
import { Track } from "data/track"
import { Row } from "./row"
import { Column } from "./column"
import { CarRow } from "./car_row"
import { TrackRow } from "./track_row"
import { ParticipatedSeriesRow, SeriesWithSummary } from "./participated_series_row"

export type AlmostEligibleSeriesAndContentsToBuy = {
  series: SeriesWithSummary
  cars: Car[]
  tracks: Track[]
}

type AlmostEligibleSeriesProps = {
  series: AlmostEligibleSeriesAndContentsToBuy
}

export function AlmostEligibleSeries({ series }: AlmostEligibleSeriesProps) {
  return (
    <Row>
      <Column>
        <ParticipatedSeriesRow series={series.series} />
        {series.cars.map((car) => {
          return (
            <div key={car.id}>
              <CarRow
                car={car}
                selected={false}
                onSelect={(checked: boolean, car: Car) => {
                  throw new Error("Function not implemented.")
                }}
              />
            </div>
          )
        })}

        {series.tracks.map((track) => {
          return (
            <div key={track.id}>
              <TrackRow
                track={track}
                selected={false}
                onSelect={(checked: boolean, track: Track) => {
                  throw new Error("Function not implemented.")
                }}
              />
            </div>
          )
        })}
      </Column>
    </Row>
  )
}
