import { Column } from "@alandoni/frontend/components/atoms/column"
import { Row } from "@alandoni/frontend/components/atoms/row"
import { Text } from "@alandoni/frontend/components/atoms/text"
import { Checkbox } from "@alandoni/frontend/components/atoms/checkbox"
import { LicenseLetter } from "./license_letter"
import { FullSchedule, FullSeries } from "../modules/iracing/views/pages/common_view_model"
import "./schedule_row.css"

interface ScheduleRowProps {
  series: FullSeries
  schedule: FullSchedule
  selectedSchedule: boolean
  selectedCar: boolean
  selectedTrack: boolean
  onSelectParticipate: (checked: boolean) => void
  onSelectOwnTrack: (checked: boolean) => void
  onSelectOwnCar: (checked: boolean) => void
}

export function ScheduleRow({
  schedule,
  series,
  selectedCar,
  selectedTrack,
  selectedSchedule,
  onSelectParticipate,
  onSelectOwnCar,
  onSelectOwnTrack,
}: ScheduleRowProps) {
  const license = series.licenses[series.licenses.length - 1]
  return (
    <Row className="schedule-row list-row">
      <Column className="class">
        <LicenseLetter license={license} />
      </Column>
      <Column className="main">
        <Row>
          <Text tooltip={series.id.toString()}>{series.name}</Text>
        </Row>
        <Row>
          <Text relevance="irrelevant" size="small" tooltip={schedule.raceWeekNum.toString()}>
            {schedule.track.name}
            {schedule.track.configName ? ` - ${schedule.track.configName}` : ""}
            &nbsp;&nbsp;|&nbsp;&nbsp;
            {schedule.cars.map((car) => car.name).join(", ")}
          </Text>
        </Row>
      </Column>
      <Column className="image">
        <img src="" />
        <Text size="small">{schedule.category.name}</Text>
      </Column>
      <Column className="others">
        <Row>
          <Checkbox
            isChecked={selectedSchedule}
            small
            onChange={(checked: boolean) => onSelectParticipate(checked)}
            tooltip="Você participou dessa corrida?"
          />
          <Checkbox
            small
            enabled={schedule.cars.length === 1 && !schedule.cars[0].free}
            isChecked={selectedCar}
            onChange={(checked: boolean) => onSelectOwnCar(checked)}
            tooltip="Você já possui esse carro?"
          />
          <Checkbox
            small
            enabled={!schedule.track.free}
            isChecked={selectedTrack}
            onChange={(checked: boolean) => onSelectOwnTrack(checked)}
            tooltip="Você já possui essa pista?"
          />
        </Row>
      </Column>
    </Row>
  )
}
