import { Series } from "data/series"
import { Schedule } from "data/schedule"
import { Car } from "data/car"
import { Track } from "data/track"
import { Row } from "./row"
import { Column } from "./column"
import { Text } from "./text"
import { Checkbox } from "./check_box"
import { LicenseLetter } from "./license_letter"
import { useEffect, useRef, useState } from "react"
import { ExpandCollapseButton } from "./expand_collapse_button"
import { CarRow } from "./car_row"
import { TrackRow } from "./track_row"
import { removeDuplicates } from "utils/list"
import "./list_row.css"
import "./series_row.css"

interface SeriesRowProps {
  series: Series
  participatedRaces: Schedule[]
  ownedCars: Car[]
  onSetOwnedCar: (checked: boolean, car: Car) => void
  ownedTracks: Track[]
  onSetOwnedTrack: (checked: boolean, track: Track) => void
}

export function SeriesRow({
  series,
  participatedRaces,
  ownedCars,
  onSetOwnedCar,
  ownedTracks,
  onSetOwnedTrack,
}: SeriesRowProps) {
  const [isExpanded, setExpanded] = useState(false)
  const [height, setHeight] = useState(-1)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!ref.current) {
      return
    }

    ref.current.style.height = "auto"
    ref.current.style.display = "block"
    const h = ref.current.clientHeight

    if (height === -1) {
      setHeight(h)
      if (!isExpanded) {
        ref.current.style.display = "none"
      }
    }

    if (isExpanded) {
      ref.current.style.maxHeight = `${height}px`
    } else {
      ref.current.style.maxHeight = "0px"
    }
  }, [isExpanded, height])

  const participatedRacesInThisSeries = participatedRaces.filter((r) => r.serieId === series.id)

  return (
    <Column className={`series-row ${height > 1 ? "opaque" : ""}`}>
      <Row className="list-row">
        <Column className="class">
          <ExpandCollapseButton isExpanded={isExpanded} onSetExpanded={setExpanded} />
        </Column>
        <Column className="class">
          <LicenseLetter license={series.licenses[0]} />
        </Column>
        <Column className="main">
          <Row>
            <Text tooltip={series.id.toString()}>{series.name}</Text>
          </Row>
          <Row>
            <Text relevance="irrelevant" size="small">
              {removeDuplicates(
                series.schedules.map((s) => s.category),
                (a, b) => a === b,
              ).join(", ")}
            </Text>
          </Row>
        </Column>
        <Column className="others">
          <Row>
            <Text>
              {participatedRacesInThisSeries.length} / {series.schedules.length}
            </Text>
            <span className="checkbox-container">
              <Checkbox
                small
                enabled={false}
                isChecked={participatedRacesInThisSeries.length > 0}
                tooltip="Você já participou dessa série?"
              />
            </span>
          </Row>
        </Column>
      </Row>
      <Column className={`details ${isExpanded ? "expanded" : "collapsed"}`} ref={ref}>
        <Row>
          <Column>
            <Text relevance="important">Carros da série:</Text>
            {removeDuplicates(
              series.schedules.flatMap((s) => s.cars),
              (a, b) => a.id === b.id,
            ).map((car) => (
              <CarRow
                key={car.id}
                car={car}
                showCategory={false}
                selected={car.free || ownedCars.find((c) => car.id === c.id) !== undefined}
                onSelect={onSetOwnedCar}
              />
            ))}
          </Column>
        </Row>
        <Row>
          <Column>
            <Text relevance="important">Pistas da série:</Text>
            {removeDuplicates(
              series.schedules.flatMap((s) => s.track),
              (a, b) => a.id === b.id,
            ).map((track) => (
              <TrackRow
                key={track.id}
                track={track}
                selected={track.free || ownedTracks.find((t) => track.id === t.id) !== undefined}
                onSelect={onSetOwnedTrack}
              />
            ))}
          </Column>
        </Row>
      </Column>
    </Column>
  )
}
