import { Series } from "data/season/series"
import { Row } from "./row"
import { Column } from "./column"
import { Text } from "./text"
import "./participated_series_row.css"

export const MINIMUM_NUMBER_OF_RACES_TO_GET_CREDITS = 8

export type SeriesWithSummary = Series & {
  participatedRaces: number
  ownedCars: number
  neededCars: number
  ownedTracks: number
  neededTracks: number
  eligible: number
}

interface ParticipatedSeriesRowProps {
  series: SeriesWithSummary
}

export function ParticipatedSeriesRow({ series }: ParticipatedSeriesRowProps) {
  return (
    <Row className="participated-series-row">
      <Column className="main">
        <Text relevance="important">{series.name}</Text>
        <Text relevance="irrelevant">
          Participações: {series.participatedRaces}, elegíveis: {series.eligible}, mínimo de participações:{" "}
          {MINIMUM_NUMBER_OF_RACES_TO_GET_CREDITS}
        </Text>
      </Column>
    </Row>
  )
}
