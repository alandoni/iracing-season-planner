import { useEffect } from "react"
import { Column } from "@alandoni/frontend/components/atoms/column"
import { Row } from "@alandoni/frontend/components/atoms/row"
import { Text } from "@alandoni/frontend/components/atoms/text"
import { Checkbox } from "@alandoni/frontend/components/atoms/checkbox"
import { CarRow } from "components/car_row"
import { TrackRow } from "components/track_row"
import { CheckableList } from "components/checkable_list"
import { ParticipatedSeriesRow } from "components/participated_series_row"
import { AlmostEligibleSeries } from "components/series_eligible_and_needed_content"
import { useSummaryViewModel } from "./summary_view_model"
import "./summary.css"

export function SummaryPage() {
  const viewModel = useSummaryViewModel()

  useEffect(() => {
    viewModel.onLoad()
  }, [viewModel])

  return (
    <Row className="summary-page" alignVertically="start">
      <Column className="content">
        <div className="title">
          <Text size="large" relevance="important">
            Séries com participação nessa temporada
          </Text>
        </div>
        <Row className="list two-columns" alignVertically="start" alignHorizontally="start">
          <Column alignVertically="start" alignHorizontally="start">
            {viewModel.participatedSeries
              .slice(0, Math.ceil(viewModel.participatedSeries.length / 2))
              .flatMap((series, index, array) => (
                <div key={`${series.id}`}>
                  <ParticipatedSeriesRow series={series} />
                  {index < array.length - 1 ? <hr /> : null}
                </div>
              ))}
          </Column>
          <Column alignVertically="start" alignHorizontally="start">
            {viewModel.participatedSeries
              .slice(Math.ceil(viewModel.participatedSeries.length / 2))
              .flatMap((series, index, array) => (
                <div key={`${series.id}`}>
                  <ParticipatedSeriesRow series={series} />
                  {index < array.length - 1 ? <hr /> : null}
                </div>
              ))}
          </Column>

          {/* <Column>
            {viewModel.participatedSeries.flatMap((series, index, array) => (
              <div key={`${series.id}`}>
                <ParticipatedSeriesRow series={series} />
                {index < array.length - 1 ? <hr /> : null}
              </div>
            ))}
          </Column> */}
        </Row>

        <div className="title">
          <Text size="large" relevance="important">
            Melhores conteúdos para comprar
          </Text>
        </div>
        <Row alignVertically="start" alignHorizontally="start">
          <Column className="side-bar" alignVertically="start" alignHorizontally="start">
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
            <Row>
              <Checkbox small isChecked={viewModel.showOwnedContent} onChange={viewModel.setShowOwnedContent} />
              <Text size="small">Mostrar conteúdos possuídos</Text>
            </Row>
            <Row className="row-with-2-lines">
              <Checkbox small isChecked={viewModel.showSeriesEligible} onChange={viewModel.setShowSeriesEligible} />
              <Text size="small">Mostrar conteúdos de séries já elegíveis</Text>
            </Row>
          </Column>
          <Column className="best-buy">
            <div className="list">
              <div className="subtitle">
                <Text size="regular" relevance="important">
                  Melhores séries com conteúdos não possuídos:
                </Text>
              </div>
              <Row className="car-row subtitle">
                <Column className="main"></Column>
                <Column className="others">
                  <Row className="others-subtitle">
                    <span title="Número de corridas com essa pista na temporada">R</span>
                    <span title="Número de séries com essa pista na temporada">S</span>
                    <span title="Você já tem essa pista?">C?</span>
                  </Row>
                </Column>
              </Row>
              {viewModel.almostEligibleseriesAndContentToBuy.flatMap((series, index, array) => (
                <div key={`${series.series.id}`}>
                  <AlmostEligibleSeries
                    series={series}
                    isCarOwned={(car) => viewModel.myCars.find((c) => c.id === car.id) !== undefined}
                    isTrackOwned={(track) => viewModel.myTracks.find((c) => c.id === track.id) !== undefined}
                    onChangeOwnedCar={viewModel.setCar}
                    onChangeOwnedTrack={viewModel.setTrack}
                  />
                  {index < array.length - 1 ? <hr /> : null}
                </div>
              ))}

              <div className="subtitle">
                <Text size="regular" relevance="important">
                  Carros:
                </Text>
              </div>
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
              {viewModel.bestCarsToBuy.flatMap((car, index, array) => (
                <div key={`${car.id}`}>
                  <CarRow
                    car={car}
                    selected={car.free || viewModel.myCars.find((c) => c.id === car.id) !== undefined}
                    onSelect={viewModel.setCar}
                  />
                  {index < array.length - 1 ? <hr /> : null}
                </div>
              ))}
              <div className="subtitle">
                <Text size="regular" relevance="important">
                  Pistas:
                </Text>
              </div>
              <Row className="car-row subtitle">
                <Column className="main"></Column>
                <Column className="others">
                  <Row className="others-subtitle">
                    <span title="Número de corridas com essa pista na temporada">R</span>
                    <span title="Número de séries com essa pista na temporada">S</span>
                    <span title="Você já tem essa pista?">C?</span>
                  </Row>
                </Column>
              </Row>
              {viewModel.bestTracksToBuy.flatMap((track, index, array) => (
                <div key={`${track.id}`}>
                  <TrackRow
                    track={track}
                    selected={track.free || viewModel.myTracks.find((c) => c.id === track.id) !== undefined}
                    onSelect={viewModel.setTrack}
                  />
                  {index < array.length - 1 ? <hr /> : null}
                </div>
              ))}
            </div>
          </Column>
        </Row>
      </Column>
    </Row>
  )
}
