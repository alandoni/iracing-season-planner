import { CheckableList } from "components/checkable_list"
import { Column } from "components/column"
import { Row } from "components/row"
import { Text } from "components/text"
import { useSeasonRepository } from "data/season_repository"
import { useUserRepository } from "data/user_repository"
import { useEffect, useState } from "react"
import { SeriesRow } from "components/series_row"
import { Series } from "data/series"
import { SearchInput } from "components/search-input"
import { findInName } from "utils/find"
import { LoadingOutlet } from "components/loading_outlet"
import "./series.css"

export function SeriesPage() {
  const season = useSeasonRepository()
  const userRepository = useUserRepository()
  const [filteredSeries, setFilteredSeries] = useState<Series[]>([])
  const [search, setSearch] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const filtered = [...(season.data?.series ?? [])].filter((series) => {
      const shouldFilter =
        userRepository.preferredLicenses.some((license) => series.licenses.find((l) => l.id === license.id)) &&
        userRepository.preferredCategories.some((category) =>
          series.schedules.find((s) => s.categoryId === category.id),
        )
      if (search.length === 0) {
        return shouldFilter
      }
      const findInSeries =
        findInName(series.name, search) || series.schedules.find((s) => findInName(s.category, search)) !== undefined
      const findInCar =
        series.schedules.find((s) =>
          s.cars.find((c) => findInName(c.name, search) || c.categories.find((cat) => findInName(cat.name, search))),
        ) !== undefined
      const findInTrack =
        series.schedules.find(
          (s) =>
            findInName(s.track.name, search) ||
            findInName(s.track.category, search) ||
            s.track.categories.find((c) => findInName(c.name, search)) !== undefined,
        ) !== undefined

      return shouldFilter && (findInSeries || findInCar || findInTrack)
    })
    setFilteredSeries(filtered)
    setLoading(false)
  }, [userRepository.preferredLicenses, userRepository.preferredCategories, season.data, search])

  useEffect(() => {
    setLoading(true)
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
        <Row>
          <Text size="large" relevance="important">
            Séries nessa temporada
          </Text>
        </Row>
        <Row>
          <SearchInput value={search} onChange={setSearch} />
        </Row>
        {loading ? (
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
        )}
      </Column>
    </Row>
  )
}
