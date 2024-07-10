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
  numberOfRaces: number
  numberOfSeries: number
  license: License
  selected: boolean
  onSelect: (checked: boolean, car: Car) => void
}

export function CarRow({ car, license, numberOfRaces, numberOfSeries, selected, onSelect }: CarRowProps) {
  return (
    <Row className="car-row list-row">
      <Column className="class">
        <LicenseLetter license={license} />
      </Column>
      <Column className="main">
        <Row>
          <Text tooltip={car.id}>{car.name}</Text>
        </Row>
        <Row>
          <Text relevance="irrelevant" size="small">
            {(car.categories ?? []).join(", ")}
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
          <Text tooltip={`Esse carro participará de ${numberOfRaces} corridas nessa temporada`}>{numberOfRaces}</Text>
          <Text tooltip={`Esse carro participará de ${numberOfSeries} séries nessa temporada`}>{numberOfSeries}</Text>
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
