import { Column } from "components/column"
import { Row } from "components/row"
import { Text } from "components/text"
import { useSeasonRepository } from "data/season_repository"
import { useUserRepository } from "data/user_repository"
import { useEffect, useState } from "react"
import { Car } from "data/cars/car"
import { CarRow } from "components/car_row"
import { TrackRow } from "components/track_row"
import { CheckableList } from "components/checkable_list"
import {
  ParticipatedSeriesRow,
  SeriesWithSummary,
  MINIMUM_NUMBER_OF_RACES_TO_GET_CREDITS,
} from "components/participated_series_row"
import { Checkbox } from "components/check_box"
import { Series } from "data/season/series"
import { Schedule } from "data/season/schedule"
import { Season } from "data/season/season"
import "./summary.css"

export function SummaryPage() {
  const season = useSeasonRepository()
  const userRepository = useUserRepository()
  const [participatedSeries, setParticipatedSeries] = useState<SeriesWithSummary[]>([])
  const [bestCarsToBuy, setBestCarsToBuy] = useState<Car[]>([])
  const [bestTracksToBuy, setBestTracksToBuy] = useState<Track[]>([])
  const [showOwnedContent, setShowOwnedContent] = useState<boolean>(true)

  const summarizeSeries = (series: Series) => {
    let numberOfOwnedTracks = 0
    let numberOfOwnedCars = 0
    let eligible = 0

    series.schedules.forEach((s) => {
      const ownedTrack = s.track.free || userRepository.myTracks.find((t) => t.id === s.track.id)
      const ownedCars = s.cars.filter((car) => car.free || userRepository.myCars.find((c) => car.id === c.id))

      if (ownedTrack) {
        numberOfOwnedTracks++
      }
      if (ownedCars.length > 0) {
        numberOfOwnedCars += ownedCars.length
      }
      if (ownedCars.length > 0 && ownedTrack) {
        eligible++
      }
    })

    return {
      ...series,
      participatedRaces: userRepository.participatedRaces.filter((r) => r.serieId === series.id).length,
      ownedCars: numberOfOwnedCars,
      ownedTracks: numberOfOwnedTracks,
      eligible,
    }
  }

  const filterBestBuys = (
    filteredSeries: Series[],
    propertyToFilter: keyof Schedule,
    propertyToSearchFor: keyof Season,
    userRepository: ReturnType<typeof useSeasonRepository>,
    propertyOfOwnedContent: keyof typeof userRepository.data,
  ) => {
    return filteredSeries
      .flatMap((series) => series.schedules.flatMap((s) => s[propertyToFilter]))
      .filter(
        (car) =>
          !car.free && (showOwnedContent || !userRepository[propertyOfOwnedContent].find((c) => car.id === c.id)),
      )
      .filter((value, index, array) => {
        return (
          array.findIndex((value2) => {
            return value.id === value2.id
          }) === index
        )
      })
      .map((car) => season.data[propertyToSearchFor].find((c) => c.id === car.id))
      .filter((car) =>
        userRepository.preferredLicenses.some((license) => car.licenses.find((l) => l.id === license.id)),
      )
      .filter((car) =>
        userRepository.preferredCategories.some((category) => car.categories.find((c) => c.id === category.id)),
      )
      .filter((_, index) => index < 10)
      .sort((a, b) => b.numberOfSeries - a.numberOfSeries)
      .sort((a, b) => b.numberOfRaces - a.numberOfRaces)
  }

  useEffect(() => {
    const seriesWithSummary = (season.data?.series ?? []).map(summarizeSeries)
    setParticipatedSeries(seriesWithSummary.filter((s) => s.participatedRaces > 0))
    const filteredSeries = seriesWithSummary.filter((a) => a.eligible < MINIMUM_NUMBER_OF_RACES_TO_GET_CREDITS)
    const cars = filterBestBuys(filteredSeries, "cars", "cars", userRepository, "myCars")
    setBestCarsToBuy(cars)

    const tracks = filterBestBuys(filteredSeries, "track", "tracks", userRepository, "myTracks")
    setBestTracksToBuy(tracks)
  }, [
    season.data,
    userRepository.participatedSeries,
    userRepository.participatedRaces,
    userRepository.preferredCategories,
    userRepository.preferredLicenses,
    userRepository.myCars,
    userRepository.myTracks,
    showOwnedContent,
  ])

  useEffect(() => {
    if (season.data) {
      userRepository.load(season.data)
    }
  }, [season.data])

  return (
    <Row className="summary-page" alignVertically="start">
      <Column className="content">
        <Text size="large" relevance="important">
          Séries com participação nessa temporada
        </Text>
        <Row className="list two-columns" alignVertically="start" alignHorizontally="start">
          <Column alignVertically="start" alignHorizontally="start">
            {participatedSeries.slice(0, Math.ceil(participatedSeries.length / 2)).flatMap((series, index, array) => (
              <div key={`${series.id}`}>
                <ParticipatedSeriesRow series={series} />
                {index < array.length - 1 ? <hr /> : null}
              </div>
            ))}
          </Column>
          <Column alignVertically="start" alignHorizontally="start">
            {participatedSeries.slice(Math.ceil(participatedSeries.length / 2)).flatMap((series, index, array) => (
              <div key={`${series.id}`}>
                <ParticipatedSeriesRow series={series} />
                {index < array.length - 1 ? <hr /> : null}
              </div>
            ))}
          </Column>

          {/* <Column>
            {participatedSeries.flatMap((series, index, array) => (
              <div key={`${series.id}`}>
                <ParticipatedSeriesRow series={series} />
                {index < array.length - 1 ? <hr /> : null}
              </div>
            ))}
          </Column> */}
        </Row>

        <Text size="large" relevance="important">
          Melhores conteúdos para comprar
        </Text>
        <Row alignVertically="start" alignHorizontally="start">
          <Column className="side-bar" alignVertically="start" alignHorizontally="start">
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
            <Row>
              <Checkbox small isChecked={showOwnedContent} onChange={setShowOwnedContent} />
              <Text size="small">Mostrar conteúdos possuídos</Text>
            </Row>
          </Column>
          <Column className="best-buy">
            <div className="list">
              <Text size="regular" relevance="important">
                Carros:
              </Text>
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
              {bestCarsToBuy.flatMap((car, index, array) => (
                <div key={`${car.id}`}>
                  <CarRow
                    car={car}
                    selected={car.free || userRepository.myCars.find((c) => c.id === car.id)}
                    onSelect={userRepository.setCar}
                  />
                  {index < array.length - 1 ? <hr /> : null}
                </div>
              ))}
              <Text size="regular" relevance="important">
                Pistas:
              </Text>
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
              {bestTracksToBuy.flatMap((track, index, array) => (
                <div key={`${track.id}`}>
                  <TrackRow
                    track={track}
                    selected={track.free || userRepository.myTracks.find((c) => c.id === track.id)}
                    onSelect={userRepository.setTrack}
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
