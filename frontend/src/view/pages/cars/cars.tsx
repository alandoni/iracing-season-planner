import { CheckableList } from "components/checkable_list"
import { Column } from "@alandoni/frontend/components/atoms/column"
import { Row } from "@alandoni/frontend/components/atoms/row"
import { Text } from "@alandoni/frontend/components/atoms/text"
import { useEffect } from "react"
import { CarRow } from "components/car_row"
import { SearchInput } from "components/search-input"
import { useCarsViewModel } from "./cars_view_model"
import { Error } from "@alandoni/frontend/components/atoms/error"
import { LoadingPage } from "@alandoni/frontend/components/templates/loading_page"
import "./cars.css"

export function CarsPage() {
  const viewModel = useCarsViewModel()

  useEffect(() => {
    viewModel.onLoad()
  }, [])

  if (viewModel.loading) {
    return <LoadingPage />
  }

  if (viewModel.error) {
    return (
      <Row className="cars-page" alignVertically="start">
        <Error error="Um erro inesperado aconteceu!" />
      </Row>
    )
  }

  return (
    <Row className="cars-page" alignVertically="start">
      <Column className="side-bar" alignVertically="start" alignHorizontally="start">
        <Text size="regular" relevance="info">
          Filtrar
        </Text>
        <CheckableList
          title="Licenças:"
          list={viewModel.season?.licenses}
          checkedList={viewModel.preferredLicenses}
          onCheck={viewModel.setPreferredLicense}
        />
        <CheckableList
          title="Categorias:"
          list={viewModel.season?.categories}
          checkedList={viewModel.preferredCategories}
          onCheck={viewModel.setPreferredCategory}
        />
      </Column>
      <Column className="content">
        <Row>
          <Text size="large" relevance="important">
            Carros usados nessa temporada
          </Text>
        </Row>
        <Row>
          <SearchInput value={viewModel.search} onChange={viewModel.setSearch} />
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
          {viewModel.filteredCars.flatMap((car, index, array) => (
            <div key={`${car.id}`}>
              <CarRow
                car={car}
                selected={car.free || viewModel.myCars?.find((c) => car.id === c.id) !== undefined}
                onSelect={(checked) => viewModel.setCar(checked, car)}
              />
              {index < array.length - 1 ? <hr /> : null}
            </div>
          ))}
        </div>
      </Column>
    </Row>
  )
}
