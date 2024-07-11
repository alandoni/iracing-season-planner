import { Track } from "data/tracks/track"
import { Row } from "./row"
import { Column } from "./column"
import { Text } from "./text"
import { Checkbox } from "./check_box"
import { LicenseLetter } from "./license_letter"
import { formatPrice } from "utils/price-formatter"
import "./track_row.css"
import "./list_row.css"

interface TrackRowProps {
  track: Track
  selected: boolean
  onSelect: (checked: boolean, track: Track) => void
}

export function TrackRow({ track, selected, onSelect }: TrackRowProps) {
  return (
    <Row className="track-row list-row">
      <Column className="class">
        <LicenseLetter license={track.licenses[0]} />
      </Column>
      <Column className="main">
        <Row>
          <Text tooltip={track.id}>{track.name}</Text>
        </Row>
        <Row>
          <Text relevance="irrelevant" size="small">
            {track.categories.map((c) => c.name).join(", ")}
          </Text>
        </Row>
      </Column>
      {/* <Column className="image">
        <img src="" />
      </Column> */}
      <Column className="price">
        <Text>{formatPrice(track.price)}</Text>
      </Column>
      <Column className="others">
        <Row>
          <Text tooltip={`Essa pista participará de ${track.numberOfRaces} corridas nessa temporada`}>
            {track.numberOfRaces}
          </Text>
          <Text tooltip={`Essa pista participará de ${track.numberOfSeries} séries nessa temporada`}>
            {track.numberOfSeries}
          </Text>
          <span className="checkbox-container">
            <Checkbox
              small
              enabled={!track.free}
              isChecked={selected}
              onChange={(checked: boolean) => onSelect(checked, track)}
              tooltip="Você já possui essa pista?"
            />
          </span>
        </Row>
      </Column>
    </Row>
  )
}
