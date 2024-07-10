import { CheckableList } from "components/checkable_list"
import { Column } from "components/column"
import { Row } from "components/row"
import { Text } from "components/text"
import { useSeasonRepository } from "data/season_repository"
import { useUserRepository } from "data/user_repository"
import { useEffect, useState } from "react"
import { TrackRow } from "components/track_row"
import { License } from "data/license/license"
import { sortLicenses } from "utils/sort-licenses"
import { Track } from "data/tracks/track"
import "./tracks.css"

export function TracksPage() {
  const season = useSeasonRepository()
  const userRepository = useUserRepository()
  const [filteredTracks, setFilteredTracks] = useState<
    Track & { license: License; numberOfRaces: number; numberOfSeries: number }[]
  >([])

  useEffect(() => {
    const filteredTracksMap = [...(season.data?.series ?? [])]
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
          .flatMap((schedule) => schedule.track)
          .map((track) => {
            if (acc[track.id]) {
              if (!alreadyPassedByThisSeries) {
                acc[track.id].numberOfSeries += 1
              }
              acc[track.id].numberOfRaces += 1
            } else {
              alreadyPassedByThisSeries = true
              acc[track.id] = {
                ...{
                  ...track,
                  category: track.category,
                },
                license: sortLicenses(series.licenses)[0],
                numberOfRaces: 1,
                numberOfSeries: 1,
              }
            }
          })
        return acc
      }, {} as Record<number, { license: License; numberOfSeries: number; numberOfRaces: number }>)
    setFilteredTracks(Object.values(filteredTracksMap).sort((a, b) => a.license.id - b.license.id))
  }, [userRepository.preferredLicenses, userRepository.preferredCategories, userRepository.myTracks, season.data])

  useEffect(() => {
    if (season.data) {
      userRepository.load(season.data)
    }
  }, [season.data])

  return (
    <Row className="tracks-page" alignVertically="start">
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
          Pistas usadas nessa temporada
        </Text>
        <div className="list">
          <Row className="track-row subtitle">
            <Column className="main"></Column>
            <Column className="others">
              <Row className="others-subtitle">
                <span title="Número de corridas com essa pista na temporada">R</span>
                <span title="Número de séries com essa pista na temporada">S</span>
                <span title="Você já tem essa pista?">C?</span>
              </Row>
            </Column>
          </Row>
          {filteredTracks.flatMap((track, index, array) => (
            <div key={`${track.id}`}>
              <TrackRow
                track={track}
                numberOfRaces={track.numberOfRaces}
                numberOfSeries={track.numberOfSeries}
                license={track.license}
                selected={track.free || userRepository.myTracks?.find((c) => track.id === c.id)}
                onSelect={(checked) => userRepository.setTrack(checked, track)}
              />
              {index < array.length - 1 ? <hr /> : null}
            </div>
          ))}
        </div>
      </Column>
    </Row>
  )
}
