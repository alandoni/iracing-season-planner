import { Column } from "components/column"
import { LoadingPage } from "components/loading_page"
import { Range } from "components/range"
import { Row } from "components/row"
import { ScheduleRow } from "components/schedule_row"
import { Text } from "components/text"
import { useSeasonRepository } from "data/season_repository"
import { useEffect, useState } from "react"
import { Checkbox } from "components/check_box"
import { Series } from "data/season/series"
import { useUserRepository } from "data/user_repository"
import "./season.css"

export function SeasonPage() {
  const season = useSeasonRepository()
  const userRepository = useUserRepository()

  const [filteredSeries, setFilteredSeries] = useState<Series[]>([])

  const [week, setWeek] = useState(0)

  useEffect(() => {
    const filtered = [...(season.data?.series ?? [])]
      .flatMap((series) => {
        const copy = { ...series }
        copy.schedules = copy.schedules.filter((schedule) => {
          const correctWeek = week === -1 || schedule.raceWeekNum === week
          const containsCategories = (userRepository.preferredCategories ?? []).find(
            (c) => c.id === schedule.categoryId,
          )
          return correctWeek && containsCategories
        })
        return copy
      })
      .filter(
        (series) =>
          series.schedules.length > 0 &&
          series.licenses.some((license) => userRepository.preferredLicenses.map((l) => l.id).includes(license.id)),
      )
    setFilteredSeries(filtered)
  }, [userRepository.preferredLicenses, userRepository.preferredCategories, week, season.data])

  useEffect(() => {
    if (season.data) {
      userRepository.load(season.data)
    }
  }, [season.data])

  if (season.loading) {
    return <LoadingPage />
  }
  if (season.error) {
    return (
      <Row>
        <Text color="error">Um erro inesperado aconteceu.</Text>
      </Row>
    )
  }
  return (
    <Row className="season-page" alignVertically="start">
      <Column className="filter" alignVertically="start" alignHorizontally="start">
        <Text size="regular" relevance="info">
          Filtrar
        </Text>
        {week > -1 ? <Text>Semana {week + 1}</Text> : <Text>Todas as semanas</Text>}
        <Range min={-1} max={12} value={week} onChange={setWeek} />
        <Text>Licença:</Text>
        <ul>
          {season.data?.licenses.map((license) => {
            return (
              <Row key={license.id}>
                <Checkbox
                  small
                  isChecked={userRepository.preferredLicenses?.find((l) => license.id === l.id) ?? false}
                  onChange={(checked) => userRepository.setPreferredLicense(checked, license)}
                />
                <Text size="small">{license.name}</Text>
              </Row>
            )
          })}
        </ul>
        <Text>Categorias:</Text>
        <ul>
          {season.data?.categories.map((category) => {
            return (
              <Row key={category.id}>
                <Checkbox
                  small
                  isChecked={userRepository.preferredCategories?.find((c) => c.id === category.id) ?? false}
                  onChange={(checked) => userRepository.setPreferredCategory(checked, category)}
                />
                <Text size="small">{category.name}</Text>
              </Row>
            )
          })}
        </ul>
      </Column>
      <Column className="content">
        <div>
          <Text size="large" relevance="important">
            Séries da temporada
          </Text>
          <div className="list">
            <Row className="schedule-row subtitle">
              <Column className="main"></Column>
              <Column className="others">
                <Row className="others-subtitle">
                  <span title="Você já participou dessa corrida?">P?</span>
                  <span title="Você já tem esse carro?">C?</span>
                  <span title="Você já tem essa pista?">T?</span>
                </Row>
              </Column>
            </Row>
            {filteredSeries.flatMap((series, index, array) =>
              series.schedules?.map((schedule) => {
                return (
                  <div key={`${series.id}-${index}`}>
                    <ScheduleRow
                      schedule={schedule}
                      series={series}
                      selectedTrack={
                        schedule.track.free || userRepository.myTracks?.find((track) => schedule.track.id === track.id)
                      }
                      selectedCar={
                        schedule.cars.filter((car) => car.free || userRepository.myCars?.find((c) => car.id === c.id))
                          .length > 0
                      }
                      selectedSchedule={userRepository.participatedRaces?.find(
                        (s) => s.raceWeekNum === schedule.raceWeekNum && s.serieId === schedule.serieId,
                      )}
                      onSelectParticipate={(checked) => userRepository.setParticipatedRace(checked, series, schedule)}
                      onSelectOwnCar={(checked) => userRepository.setCar(checked, schedule.cars[0])}
                      onSelectOwnTrack={(checked) => userRepository.setTrack(checked, schedule.track)}
                    />
                    {index < array.length - 1 ? <hr /> : null}
                  </div>
                )
              }),
            )}
          </div>
        </div>
      </Column>
    </Row>
  )
}
