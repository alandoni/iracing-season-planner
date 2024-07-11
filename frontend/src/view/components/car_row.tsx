import { Car } from "data/cars/car"
import { Row } from "./row"
import { Column } from "./column"
import { Text } from "./text"
import { Checkbox } from "./check_box"
import { LicenseLetter } from "./license_letter"
import "./car_row.css"
import "./list_row.css"
import { formatPrice } from "utils/price-formatter"

interface CarRowProps {
  car: Car
  selected: boolean
  onSelect: (checked: boolean, car: Car) => void
}

export function CarRow({ car, selected, onSelect }: CarRowProps) {
  return (
    <Row className="car-row list-row">
      {car.licenses ? (
        <Column className="class">
          <LicenseLetter license={car.licenses[0]} />
        </Column>
      ) : null}
      <Column className="main">
        <Row>
          <Text tooltip={car.id}>{car.name}</Text>
        </Row>
        <Row>
          <Text relevance="irrelevant" size="small">
            {(car.categories ?? []).map((c) => c.name).join(", ")}
          </Text>
        </Row>
      </Column>
      {/* <Column className="image">
        <img src="" />
      </Column> */}
      <Column className="price">
        <Text>{formatPrice(car.price)}</Text>
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
