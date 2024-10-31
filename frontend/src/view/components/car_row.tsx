import { Car } from "data/iracing/season/models/car"
import { Row } from "frontend/components/atoms/row"
import { Column } from "frontend/components/atoms/column"
import { Text } from "frontend/components/atoms/text"
import { Checkbox } from "frontend/components/atoms/checkbox"
import { LicenseLetter } from "./license_letter"
import "./car_row.css"
import "./list_row.css"

interface CarRowProps {
  car: Car
  selected: boolean
  showCategory?: boolean
  onSelect: (checked: boolean, car: Car) => void
}

export function CarRow({ car, selected, showCategory = true, onSelect }: CarRowProps) {
  return (
    <Row className="car-row list-row">
      {car.licenses && car.licenses.length > 0 ? (
        <Column className="class">
          <LicenseLetter license={car.licenses[0]} />
        </Column>
      ) : null}
      <Column className="main">
        <Row>
          <Text tooltip={car.id.toString()}>{car.name}</Text>
        </Row>
        {showCategory ? (
          <Row>
            <Text relevance="irrelevant" size="small">
              {(car.categories ?? []).map((c) => c.name).join(", ")}
            </Text>
          </Row>
        ) : null}
      </Column>
      {/* <Column className="image">
        <img src="" />
      </Column> */}
      <Column className="price">
        <Text>{car.price.formatCurrency("en-US", "USD")}</Text>
      </Column>
      <Column className="others">
        <Row>
          <Text tooltip={`Esse carro participará de ${car.numberOfRaces} corridas nessa temporada`}>
            {car.numberOfRaces}
          </Text>
          <Text tooltip={`Esse carro participará de ${car.numberOfSeries} séries nessa temporada`}>
            {car.numberOfSeries}
          </Text>
          <span className="checkbox-container">
            <Checkbox
              small
              enabled={!car.free}
              isChecked={selected}
              onChange={(checked: boolean) => onSelect(checked, car)}
              tooltip="Você já possui esse carro?"
            />
          </span>
        </Row>
      </Column>
    </Row>
  )
}
