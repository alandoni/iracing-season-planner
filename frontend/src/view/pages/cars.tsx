import { CheckableList } from "components/checkable_list"
import { Column } from "components/column"
import { Row } from "components/row"
import { Text } from "components/text"
import { useSeasonRepository } from "data/season_repository"
import { useUserRepository } from "data/user_repository"
import { useEffect, useState } from "react"
import { CarRow } from "components/car_row"
import { Car } from "data/car"
import "./cars.css"

export function CarsPage() {
  const season = useSeasonRepository()
  const userRepository = useUserRepository()
  const [filteredCars, setFilteredCars] = useState<Car[]>([])

  useEffect(() => {
    const filtered = [...(season.data?.cars ?? [])]
      .filter((car) =>
        userRepository.preferredLicenses.some((license) => car.licenses.find((l) => l.id === license.id)),
      )
      .filter((car) =>
        userRepository.preferredCategories.some((category) => car.categories.find((c) => c.id === category.id)),
      )

    setFilteredCars(filtered)
  }, [userRepository.preferredLicenses, userRepository.preferredCategories, userRepository.myCars, season.data])

  useEffect(() => {
    if (season.data) {
      userRepository.load(season.data)
    }
  }, [season.data])

  return (
    <Row className="cars-page" alignVertically="start">
      <Column className="side-bar" alignVertically="start" alignHorizontally="start">
        <Text size="regular" relevance="info">
          Filtrar
        </Text>
        <CheckableList
          title="Licenças:"
          list={season.data?.licenses}
          checkedList={userRepository.preferredLicenses}
          onCheck={userRepository.setPreferredLicense}
        />
        <CheckableList
          title="Categorias:"
          list={season.data?.categories}
          checkedList={userRepository.preferredCategories}
          onCheck={userRepository.setPreferredCategory}
        />
      </Column>
      <Column className="content">
        <Text size="large" relevance="important">
          Carros usados nessa temporada
        </Text>
        <div className="list">
          <Row className="car-row subtitle">
            <Column className="main"></Column>
            <Column className="others">
              <Row className="others-subtitle">
                <span title="Número de corridas com esse carro na temporada">R</span>
                <span title="Número de séries com esse carro na temporada">S</span>
                <span title="Você já tem esse carro?">C?</span>
              </Row>
            </Column>
          </Row>
          {filteredCars.flatMap((car, index, array) => (
            <div key={`${car.id}`}>
              <CarRow
                car={car}
                selected={car.free || userRepository.myCars?.find((c) => car.id === c.id) !== undefined}
                onSelect={(checked) => userRepository.setCar(checked, car)}
              />
              {index < array.length - 1 ? <hr /> : null}
            </div>
          ))}
        </div>
      </Column>
    </Row>
  )
}