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
  numberOfRaces: number
  numberOfSeries: number
  license: License
  selected: boolean
  onSelect: (checked: boolean, track: Track) => void
}

export function TrackRow({ track, license, numberOfRaces, numberOfSeries, selected, onSelect }: TrackRowProps) {
  return (
    <Row className="track-row list-row">
      <Column className="class">
        <LicenseLetter license={license} />
      </Column>
      <Column className="main">
        <Row>
          <Text tooltip={track.id}>{track.name}</Text>
        </Row>
        <Row>
          <Text relevance="irrelevant" size="small">
            {track.category}
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
          <Text tooltip={`Essa pista participará de ${numberOfRaces} corridas nessa temporada`}>{numberOfRaces}</Text>
          <Text tooltip={`Essa pista participará de ${numberOfSeries} séries nessa temporada`}>{numberOfSeries}</Text>
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
