import { CheckableList } from "components/checkable_list"
import { Column } from "components/column"
import { Row } from "components/row"
import { Text } from "components/text"
import { useSeasonRepository } from "data/season_repository"
import { useUserRepository } from "data/user_repository"
import { useEffect, useState } from "react"
import { TrackRow } from "components/track_row"
import { Track } from "../../../../shared/models/track"
import { SearchInput } from "components/search-input"
import "./tracks.css"
import { findInName } from "utils/find"

export function TracksPage() {
  const season = useSeasonRepository()
  const userRepository = useUserRepository()
  const [filteredTracks, setFilteredTracks] = useState<Track[]>([])
  const [search, setSearch] = useState("")

  useEffect(() => {
    const filtered = [...(season.data?.tracks ?? [])].filter((track) => {
      const shouldFilter =
        (userRepository.preferredLicenses.some((license) => track.licenses.find((l) => l.id === license.id)),
        userRepository.preferredCategories.some((category) => track.categories.find((c) => c.id === category.id)))
      if (search.length === 0) {
        return shouldFilter
      }
      return (
        (shouldFilter && (findInName(track.name, search) || findInName(track.category, search))) ||
        track.categories.find((c) => findInName(c.name, search))
      )
    })
    setFilteredTracks(filtered)
  }, [
    userRepository.preferredLicenses,
    userRepository.preferredCategories,
    userRepository.myTracks,
    season.data,
    search,
  ])

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
        <Row>
          <Text size="large" relevance="important">
            Pistas usadas nessa temporada
          </Text>
        </Row>
        <Row>
          <SearchInput value={search} onChange={setSearch} />
        </Row>
        <div className="list">
          <Row className="track-row list-row subtitle">
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
                selected={track.free || userRepository.myTracks?.find((c) => track.id === c.id) !== undefined}
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
