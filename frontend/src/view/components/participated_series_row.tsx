import { Series } from "data/series"
import { Row } from "./row"
import { Column } from "./column"
import { Text } from "./text"
import "./participated_series_row.css"

export const MINIMUM_NUMBER_OF_RACES_TO_GET_CREDITS = 8
const DEFAULT_NUMBER_OF_WEEKS = 12

export function calculateMinimumParticipation(series: Series) {
  if (series.schedules.length >= DEFAULT_NUMBER_OF_WEEKS) {
    return MINIMUM_NUMBER_OF_RACES_TO_GET_CREDITS
  } else {
    const diff = DEFAULT_NUMBER_OF_WEEKS - series.schedules.length
    return Math.max(0, MINIMUM_NUMBER_OF_RACES_TO_GET_CREDITS - diff)
  }
}

export type SeriesWithSummary = Series & {
  participatedRaces: number
  totalCars: number
  ownedCars: number
  totalTracks: number
  ownedTracks: number
  eligible: number
}

interface ParticipatedSeriesRowProps {
  series: SeriesWithSummary
}

export function ParticipatedSeriesRow({ series }: ParticipatedSeriesRowProps) {
  return (
    <Row className="participated-series-row">
      <Column className="main">
        <Text relevance="regular">{series.name}</Text>
        <Text relevance="irrelevant">
          Participações: {series.participatedRaces}, elegíveis: {series.eligible}, mínimo de participações:{" "}
          {calculateMinimumParticipation(series)}
        </Text>
      </Column>
    </Row>
  )
}
