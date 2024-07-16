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
          <Text tooltip={car.id}>{car.name}</Text>
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
