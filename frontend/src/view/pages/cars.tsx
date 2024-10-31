import { CheckableList } from "components/checkable_list"
import { Column } from "frontend/components/atoms/column"
import { Row } from "frontend/components/atoms/row"
import { Text } from "frontend/components/atoms/text"
import { useSeasonRepository } from "data/season_repository"
import { useUserRepository } from "data/user_repository"
import { useEffect, useState } from "react"
import { CarRow } from "components/car_row"
import { Car } from "data/iracing/season/models/car"
import { SearchInput } from "components/search-input"
import "./cars.css"

export function CarsPage() {
  const season = useSeasonRepository()
  const userRepository = useUserRepository()
  const [filteredCars, setFilteredCars] = useState<Car[]>([])
  const [search, setSearch] = useState("")

  useEffect(() => {
    const filtered = [...(season.data?.cars ?? [])].filter((car) => {
      const shouldFilter =
        userRepository.preferredLicenses.some((license) => car.licenses.find((l) => l.id === license.id)) &&
        userRepository.preferredCategories.some((category) => car.categories.find((c) => c.id === category.id))
      if (search.length === 0) {
        return shouldFilter
      }
      return (
        shouldFilter && (car.name.find(search) || car.categories.find((cat) => cat.name.find(search)) !== undefined)
      )
    })

    setFilteredCars(filtered)
  }, [userRepository.preferredLicenses, userRepository.preferredCategories, userRepository.myCars, season.data, search])

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
        <Row>
          <Text size="large" relevance="important">
            Carros usados nessa temporada
          </Text>
        </Row>
        <Row>
          <SearchInput value={search} onChange={setSearch} />
        </Row>
        <div className="list">
          <Row className="car-row list-row subtitle">
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
