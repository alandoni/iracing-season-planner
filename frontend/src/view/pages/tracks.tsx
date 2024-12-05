import { CheckableList } from "components/checkable_list"
import { Column } from "frontend/components/atoms/column"
import { Row } from "frontend/components/atoms/row"
import { Text } from "frontend/components/atoms/text"
import { useEffect } from "react"
import { TrackRow } from "components/track_row"
import { SearchInput } from "components/search-input"
import { useTracksViewModel } from "./tracks_view_model"
import "./tracks.css"

export function TracksPage() {
  const viewModel = useTracksViewModel()

  useEffect(() => {
    viewModel.onLoad()
  }, [viewModel])

  return (
    <Row className="tracks-page" alignVertically="start">
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
            Pistas usadas nessa temporada
          </Text>
        </Row>
        <Row>
          <SearchInput value={viewModel.search} onChange={viewModel.setSearch} />
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
          {viewModel.filteredTracks.flatMap((track, index, array) => (
            <div key={`${track.id}`}>
              <TrackRow
                track={track}
                selected={track.free || viewModel.myTracks?.find((c) => track.id === c.id) !== undefined}
                onSelect={(checked) => viewModel.setTrack(checked, track)}
              />
              {index < array.length - 1 ? <hr /> : null}
            </div>
          ))}
        </div>
      </Column>
    </Row>
  )
}
