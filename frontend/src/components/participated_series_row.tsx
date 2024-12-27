import { Row } from "@alandoni/frontend/components/atoms/row"
import { Column } from "@alandoni/frontend/components/atoms/column"
import { Text } from "@alandoni/frontend/components/atoms/text"
import "./participated_series_row.css"
import {
  calculateMinimumParticipation,
  SeriesWithSummary,
} from "src/modules/iracing/views/pages/summary/summary_view_model"

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
