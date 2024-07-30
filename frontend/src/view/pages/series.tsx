import { CheckableList } from "components/checkable_list"
import { Column } from "components/column"
import { Row } from "components/row"
import { Text } from "components/text"
import { useSeasonRepository } from "data/season_repository"
import { useUserRepository } from "data/user_repository"
import { useEffect, useState } from "react"
import { SeriesRow } from "components/series_row"
import { Series } from "data/series"
import "./series.css"

export function SeriesPage() {
  const season = useSeasonRepository()
  const userRepository = useUserRepository()
  const [filteredSeries, setFilteredSeries] = useState<Series[]>([])

  useEffect(() => {
    const filtered = [...(season.data?.series ?? [])]
      .filter((series) =>
        userRepository.preferredLicenses.some((license) => series.licenses.find((l) => l.id === license.id)),
      )
      .filter((series) =>
        userRepository.preferredCategories.some((category) =>
          series.schedules.find((s) => s.categoryId === category.id),
        ),
      )
    setFilteredSeries(filtered)
  }, [userRepository.preferredLicenses, userRepository.preferredCategories, season.data])

  useEffect(() => {
    if (season.data) {
      userRepository.load(season.data)
    }
  }, [season.data])

  return (
    <Row className="series-page" alignVertically="start">
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
          Séries nessa temporada
        </Text>
        <div className="list">
          {filteredSeries.flatMap((series, index, array) => (
            <div key={`${series.id}`}>
              <SeriesRow
                series={series}
                participatedRaces={userRepository.participatedRaces}
                ownedCars={userRepository.myCars}
                onSetOwnedCar={userRepository.setCar}
                ownedTracks={userRepository.myTracks}
                onSetOwnedTrack={userRepository.setTrack}
              />
              {index < array.length - 1 ? <hr /> : null}
            </div>
          ))}
        </div>
      </Column>
    </Row>
  )
}
