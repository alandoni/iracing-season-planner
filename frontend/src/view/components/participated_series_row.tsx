import { Series } from "data/series"
import { Row } from "frontend/components/atoms/row"
import { Column } from "frontend/components/atoms/column"
import { Text } from "frontend/components/atoms/text"
import "./participated_series_row.css"

export const DEFAULT_DROPPED_WEEKS = 4

export function calculateMinimumParticipation(series: Series) {
  const droppedWeeks = series.droppedWeeks ?? DEFAULT_DROPPED_WEEKS
  const minimumParticipationWeeks = series.schedules.length - droppedWeeks
  return Math.max(minimumParticipationWeeks)
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
