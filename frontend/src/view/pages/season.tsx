import { Column } from "frontend/components/atoms/column"
import { LoadingPage } from "frontend/components/templates/loading_page"
import { Range } from "frontend/components/atoms/range"
import { Row } from "frontend/components/atoms/row"
import { ScheduleRow } from "components/schedule_row"
import { Text } from "frontend/components/atoms/text"
import { CheckableList } from "components/checkable_list"
import { Checkbox } from "frontend/components/atoms/checkbox"
import { SearchInput } from "components/search-input"
import { useSeasonViewModel } from "./season_view_model"
import "./season.css"

export function SeasonPage() {
  const viewModel = useSeasonViewModel()
  if (viewModel.loading) {
    return <LoadingPage />
  }
  if (viewModel.error) {
    return (
      <Row>
        <Text color="error">Um erro inesperado aconteceu.</Text>
      </Row>
    )
  }

  return (
    <Row className="season-page" alignVertically="start">
      <Column className="side-bar" alignVertically="start" alignHorizontally="start">
        <Text size="regular" relevance="info">
          Filtrar
        </Text>
        {viewModel.week > -1 ? <Text>Semana {viewModel.week + 1}</Text> : <Text>Todas as semanas</Text>}
        <Range min={-1} max={12} value={viewModel.week} onChange={viewModel.setWeek} />
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
        <Row alignVertically="start">
          <Checkbox small isChecked={viewModel.showOnlySeriesEligible} onChange={viewModel.setShowOnlySeriesEligible} />
          <Text size="small">Mostrar apenas séries elegíveis</Text>
        </Row>
      </Column>
      <Column className="content">
        <Row>
          <Text size="large" relevance="important">
            Séries da temporada
          </Text>
        </Row>
        <Row>
          <SearchInput value={viewModel.search} onChange={viewModel.setSearch} />
        </Row>
        <div className="list">
          <Row className="schedule-row subtitle list-row">
            <Column className="main"></Column>
            <Column className="others">
              <Row className="others-subtitle">
                <span title="Você já participou dessa corrida?">P?</span>
                <span title="Você já tem esse carro?">C?</span>
                <span title="Você já tem essa pista?">T?</span>
              </Row>
            </Column>
          </Row>
          {viewModel.filteredSeries.map((series, index, array) => {
            return (
              <div key={`${series.id}`}>
                {series.schedules?.map((schedule) => {
                  return (
                    <div key={`${series.id}-${schedule.raceWeekNum}`}>
                      <ScheduleRow
                        schedule={schedule}
                        series={series}
                        selectedTrack={
                          schedule.track.free ||
                          viewModel.myTracks?.find((track) => schedule.track.id === track.id) !== undefined
                        }
                        selectedCar={
                          schedule.cars.filter(
                            (car) => car.free || viewModel.myCars?.find((c) => car.id === c.id) !== undefined,
                          ).length > 0
                        }
                        selectedSchedule={
                          viewModel.participatedRaces?.find(
                            (s) => s.raceWeekNum === schedule.raceWeekNum && s.serieId === schedule.serieId,
                          ) !== undefined
                        }
                        onSelectParticipate={(checked) => viewModel.setParticipatedRace(checked, schedule)}
                        onSelectOwnCar={(checked) => viewModel.setCar(checked, schedule.cars[0])}
                        onSelectOwnTrack={(checked) => viewModel.setTrack(checked, schedule.track)}
                      />
                      {index < array.length - 1 ? <hr /> : null}
                    </div>
                  )
                })}
              </div>
            )
          })}
        </div>
      </Column>
    </Row>
  )
}
