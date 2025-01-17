import { CheckableList } from "src/components/checkable_list.js"
import { Column } from "@alandoni/frontend/components/atoms/column"
import { Row } from "@alandoni/frontend/components/atoms/row"
import { Text } from "@alandoni/frontend/components/atoms/text"
import { useEffect } from "react"
import { SeriesRow } from "src/components/series_row.js"
import { SearchInput } from "src/components/search-input.js"
import { LoadingOutlet } from "@alandoni/frontend/components/templates/loading_outlet"
import { useSeriesViewModel } from "./series_view_model.js"
import "./series.css"
import { LoadingPage } from "@alandoni/frontend/components/templates/loading_page"
import { Error } from "@alandoni/frontend/components/atoms/error"

export function SeriesPage() {
  const viewModel = useSeriesViewModel()

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
    <Row className="series-page" alignVertically="start">
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
            Séries nessa temporada
          </Text>
        </Row>
        <Row>
          <SearchInput value={viewModel.search} onChange={viewModel.setSearch} />
        </Row>
        {viewModel.loading ? (
          <LoadingOutlet />
        ) : (
          <div className="list">
            <Row className="series-row subtitle list-row">
              <Column className="main"></Column>
              <Column className="others">
                <Row className="others-subtitle">
                  <span title="Você já participou dessa série?">Ptc?</span>
                  <span title="Você já tem esse conteúdo?">P?</span>
                </Row>
              </Column>
            </Row>
            {viewModel.filteredSeries.flatMap((series, index, array) => (
              <div key={`${series.id}`}>
                <SeriesRow
                  series={series}
                  participatedRaces={viewModel.participatedRaces}
                  ownedCars={viewModel.myCars}
                  onSetOwnedCar={viewModel.setCar}
                  ownedTracks={viewModel.myTracks}
                  onSetOwnedTrack={viewModel.setTrack}
                />
                {index < array.length - 1 ? <hr /> : null}
              </div>
            ))}
          </div>
        )}
      </Column>
    </Row>
  )
}
