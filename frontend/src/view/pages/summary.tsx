import { useEffect, useState } from "react"
import { Column } from "frontend/components/atoms/column"
import { Row } from "frontend/components/atoms/row"
import { Text } from "frontend/components/atoms/text"
import { Checkbox } from "frontend/components/atoms/checkbox"
import { Car } from "data/iracing/season/models/car"
import { Track, TrackWithConfigName } from "data/iracing/season/models/track"
import { Series } from "data/iracing/season/models/series"
import { useSeasonRepository } from "data/season_repository"
import { useUserRepository } from "data/user_repository"
import { CarRow } from "components/car_row"
import { TrackRow } from "components/track_row"
import { CheckableList } from "components/checkable_list"
import {
  ParticipatedSeriesRow,
  SeriesWithSummary,
  calculateMinimumParticipation,
} from "components/participated_series_row"
import {
  AlmostEligibleSeries,
  AlmostEligibleSeriesAndContentsToBuy,
} from "components/series_eligible_and_needed_content"
import "./summary.css"

export function SummaryPage() {
  const season = useSeasonRepository()
  const userRepository = useUserRepository()
  const [participatedSeries, setParticipatedSeries] = useState<SeriesWithSummary[]>([])
  const [bestCarsToBuy, setBestCarsToBuy] = useState<Car[]>([])
  const [bestTracksToBuy, setBestTracksToBuy] = useState<TrackWithConfigName[]>([])
  const [almostEligibleseriesAndContentToBuy, setAlmostEligibleSeriesAndContentToBuy] = useState<
    AlmostEligibleSeriesAndContentsToBuy[]
  >([])
  const [showOwnedContent, setShowOwnedContent] = useState<boolean>(false)
  const [showSeriesEligible, setShowSeriesEligible] = useState<boolean>(false)

  const summarizeSeries = (series: Series): SeriesWithSummary => {
    const tracks: number[] = []
    const cars: number[] = []
    const ownedTracks: number[] = []
    const ownedCars: number[] = []
    let eligible = 0

    series.schedules.forEach((s) => {
      const ownedTrack = s.track.free || userRepository.myTracks.find((t) => t.id === s.track.id)
      const ownedCarsInSchedule = s.cars.filter((car) => car.free || userRepository.myCars.find((c) => car.id === c.id))

      if (!tracks.includes(s.track.id)) {
        tracks.push(s.track.id)
      }
      s.cars.forEach((car) => {
        if (!cars.includes(car.id)) {
          cars.push(car.id)
        }
      })

      if (ownedTrack && !ownedTracks.includes(s.track.id)) {
        ownedTracks.push(s.track.id)
      }
      if (ownedCarsInSchedule.length > 0) {
        ownedCarsInSchedule.forEach((car) => {
          if (!ownedCars.includes(car.id)) {
            ownedCars.push(car.id)
          }
        })
      }
      if (ownedCarsInSchedule.length > 0 && ownedTrack) {
        eligible++
      }
    })

    return {
      ...series,
      participatedRaces: userRepository.participatedRaces.filter((r) => r.serieId === series.id).length,
      ownedCars: ownedCars.length,
      totalCars: cars.length,
      ownedTracks: ownedTracks.length,
      totalTracks: tracks.length,
      eligible,
    }
  }

  const filterBestBuys = <T extends Car | TrackWithConfigName>(
    filteredSeries: Series[],
    propertyToFilter: "cars" | "track",
    userRepository: ReturnType<typeof useUserRepository>,
    propertyOfOwnedContent: "myCars" | "myTracks",
  ): T[] => {
    return filteredSeries
      .flatMap((series) => series.schedules.flatMap((s) => s[propertyToFilter] as T))
      .filter(
        (value) =>
          !value.free && (showOwnedContent || !userRepository[propertyOfOwnedContent].find((c) => value.id === c.id)),
      )
      .removeDuplicates((value, value2) => value.id === value2.id)
      .filter(
        (car) =>
          userRepository.preferredLicenses.some((license) => car.licenses.find((l) => l.id === license.id)) &&
          userRepository.preferredCategories.some((category) => car.categories.find((c) => c.id === category.id)),
      )
      .sort((a, b) => b.numberOfSeries - a.numberOfSeries || b.numberOfRaces - a.numberOfRaces)
      .filter((_, index) => index < 10) as T[]
  }

  const wouldBuyingThisContentIncreasesSeriesEligible = (
    series: SeriesWithSummary,
    content: Car | Track,
    userRepository: ReturnType<typeof useUserRepository>,
  ): boolean => {
    return (
      series.schedules.find((s) => {
        const ownedTrack = s.track.free || userRepository.myTracks.find((t) => t.id === s.track.id) !== undefined
        const ownedCarsInSchedule = s.cars.filter(
          (car) => car.free || userRepository.myCars.find((c) => car.id === c.id),
        )

        if ("location" in content && "id" in content) {
          return !ownedTrack && s.track.id === content.id
        } else {
          return ownedCarsInSchedule.length === 0 && s.cars.find((car) => car.id === content.id)
        }
      }) !== undefined
    )
  }

  const filterAlmostEligibleSeries = (
    seriesWithSummary: SeriesWithSummary[],
    userRepository: ReturnType<typeof useUserRepository>,
  ): AlmostEligibleSeriesAndContentsToBuy[] => {
    const filtered = seriesWithSummary
      .filter(
        (serie) =>
          userRepository.preferredLicenses.some((license) => serie.licenses.find((l) => l.id === license.id)) &&
          userRepository.preferredCategories.some((category) =>
            serie.schedules.find((c) => c.category.id === category.id),
          ) &&
          serie.eligible < calculateMinimumParticipation(serie),
      )
      .sort(
        (b, a) =>
          a.eligible - b.eligible ||
          a.totalCars - a.ownedCars - (b.totalCars - b.ownedCars) ||
          a.totalTracks - a.ownedTracks - (b.totalTracks - b.ownedTracks),
      )
      .filter((_, index) => index < 10)

    return filtered.map((series) => {
      const allCarsOfSeries = series.schedules
        .flatMap((s) => s.cars)
        .removeDuplicates((c1, c2) => c1.id === c2.id)
        .filter((car) => wouldBuyingThisContentIncreasesSeriesEligible(series, car, userRepository))
        .sort((b, a) => a.numberOfSeries - b.numberOfSeries || a.numberOfRaces - b.numberOfRaces)
        .filter((_, index) => index < 5)

      const allTracksOfSeries = series.schedules
        .map((s) => s.track)
        .removeDuplicates((t1, t2) => t1.id === t2.id)
        .filter((track) => wouldBuyingThisContentIncreasesSeriesEligible(series, track, userRepository))
        .sort((b, a) => a.numberOfSeries - b.numberOfSeries || a.numberOfRaces - b.numberOfRaces)
        .filter((_, index) => index < 5)
      return {
        series,
        cars: allCarsOfSeries,
        tracks: allTracksOfSeries,
      }
    })
  }

  useEffect(() => {
    if (!season.data) {
      return
    }
    const seriesWithSummary = (season.data.series ?? []).map(summarizeSeries)
    setParticipatedSeries(
      seriesWithSummary.filter(
        (s) =>
          (calculateMinimumParticipation(s) > 0 &&
            s.eligible >= calculateMinimumParticipation(s) &&
            userRepository.preferredLicenses.some((license) =>
              s.licenses.find((l) => l.id === license.id && license.letter !== "R"),
            ) &&
            userRepository.preferredCategories.some((category) =>
              s.schedules.find((sc) => sc.category.id === category.id),
            )) ||
          s.participatedRaces > 0,
      ),
    )

    const filteredSeries = seriesWithSummary.filter(
      (a) => showSeriesEligible || a.eligible < calculateMinimumParticipation(a),
    )

    const cars = filterBestBuys<Car>(filteredSeries, "cars", userRepository, "myCars")
    setBestCarsToBuy(cars)

    const tracks = filterBestBuys<TrackWithConfigName>(filteredSeries, "track", userRepository, "myTracks")
    setBestTracksToBuy(tracks)

    const almostEligibleSeries = filterAlmostEligibleSeries(seriesWithSummary, userRepository)
    setAlmostEligibleSeriesAndContentToBuy(almostEligibleSeries)
  }, [
    season.data,
    showOwnedContent,
    showSeriesEligible,
    userRepository.preferredLicenses,
    userRepository.preferredCategories,
  ])

  useEffect(() => {
    if (season.data) {
      userRepository.load(season.data)
    }
  }, [season.data])

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

        <div className="title">
          <Text size="large" relevance="important">
            Melhores conteúdos para comprar
          </Text>
        </div>
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
            <Row className="row-with-2-lines">
              <Checkbox small isChecked={showSeriesEligible} onChange={setShowSeriesEligible} />
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
              {almostEligibleseriesAndContentToBuy.flatMap((series, index, array) => (
                <div key={`${series.series.id}`}>
                  <AlmostEligibleSeries
                    series={series}
                    isCarOwned={(car) => userRepository.myCars.find((c) => c.id === car.id) !== undefined}
                    isTrackOwned={(track) => userRepository.myTracks.find((c) => c.id === track.id) !== undefined}
                    onChangeOwnedCar={userRepository.setCar}
                    onChangeOwnedTrack={userRepository.setTrack}
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
              {bestCarsToBuy.flatMap((car, index, array) => (
                <div key={`${car.id}`}>
                  <CarRow
                    car={car}
                    selected={car.free || userRepository.myCars.find((c) => c.id === car.id) !== undefined}
                    onSelect={userRepository.setCar}
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
              {bestTracksToBuy.flatMap((track, index, array) => (
                <div key={`${track.id}`}>
                  <TrackRow
                    track={track}
                    selected={track.free || userRepository.myTracks.find((c) => c.id === track.id) !== undefined}
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
