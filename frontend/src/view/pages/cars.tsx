import { CheckableList } from "components/checkable_list"
import { Column } from "components/column"
import { Row } from "components/row"
import { Text } from "components/text"
import { useSeasonRepository } from "data/season_repository"
import { useUserRepository } from "data/user_repository"
import { useEffect, useState } from "react"
import { CarRow } from "components/car_row"
import { License } from "data/license/license"
import { sortLicenses } from "utils/sort-licenses"
import { Car } from "data/cars/car"
import "./cars.css"

export function CarsPage() {
  const season = useSeasonRepository()
  const userRepository = useUserRepository()
  const [filteredCars, setFilteredCars] = useState<
    Car & { license: License; numberOfRaces: number; numberOfSeries: number }[]
  >([])

  useEffect(() => {
    const filteredCarsMap = [...(season.data?.series ?? [])]
      .filter(
        (series) =>
          series.schedules.length > 0 &&
          series.licenses.some((license) => userRepository.preferredLicenses.map((l) => l.id).includes(license.id)),
      )
      .reduce((acc, series) => {
        const filteredSchedulesOfSeries = series.schedules.filter((schedule) => {
          const containsCategories = (userRepository.preferredCategories ?? []).find(
            (c) => c.id === schedule.categoryId,
          )
          return containsCategories
        })
        let alreadyPassedByThisSeries = false
        filteredSchedulesOfSeries
          .flatMap((schedule) => schedule.cars)
          .map((car) => {
            if (acc[car.id]) {
              if (!alreadyPassedByThisSeries) {
                acc[car.id].numberOfSeries += 1
              }
              acc[car.id].numberOfRaces += 1
            } else {
              alreadyPassedByThisSeries = true
              acc[car.id] = {
                ...{
                  ...car,
                  categories: car.categories,
                },
                license: sortLicenses(series.licenses)[0],
                numberOfRaces: 1,
                numberOfSeries: 1,
              }
            }
          })
        return acc
      }, {} as Record<number, { license: License; numberOfSeries: number; numberOfRaces: number }>)
    setFilteredCars(Object.values(filteredCarsMap).sort((a, b) => a.license.id - b.license.id))
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
                numberOfRaces={car.numberOfRaces}
                numberOfSeries={car.numberOfSeries}
                license={car.license}
                selected={car.free || userRepository.myCars?.find((c) => car.id === c.id)}
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
