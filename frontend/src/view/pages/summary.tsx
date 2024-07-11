import { Column } from "components/column"
import { Row } from "components/row"
import { Text } from "components/text"
import { useSeasonRepository } from "data/season_repository"
import { useUserRepository } from "data/user_repository"
import { useEffect, useState } from "react"
import { Series } from "data/season/series"
import { Car } from "data/cars/car"
import { CarRow } from "components/car_row"
import "./summary.css"

const MINIMUM_NUMBER_OF_RACES_TO_GET_CREDITS = 8

type SeriesWithSummary = Series & {
  participatedRaces: number
  ownedCars: number
  totalCars: number
  ownedTracks: number
  totalTracks: number
  eligible: number
}

export function SummaryPage() {
  const season = useSeasonRepository()
  const userRepository = useUserRepository()
  const [participatedSeries, setParticipatedSeries] = useState<SeriesWithSummary[]>([])
  const [bestCarsToBuy, setBestCarsToBuy] = useState<Car[]>([])

  useEffect(() => {
    const seriesWithSummary = (season.data?.series ?? []).map((series) => {
      let numberOfOwnedTracks = 0
      let numberOfOwnedCars = 0
      let eligible = 0

      series.schedules.forEach((s) => {
        const ownedTrack = s.track.free || userRepository.myTracks.find((t) => t.id === s.track.id)
        const ownedCars = s.cars.filter((car) => car.free || userRepository.myCars.find((c) => car.id === c.id))

        if (ownedTrack) {
          numberOfOwnedTracks++
        }
        if (ownedCars.length > 1) {
          eligible++
          numberOfOwnedCars += ownedCars.length
        }
      })

      return {
        ...series,
        participatedRaces: userRepository.participatedRaces.filter((r) => r.serieId === series.id).length,
        ownedCars: numberOfOwnedCars,
        ownedTracks: numberOfOwnedTracks,
        eligible,
      }
    })

    setParticipatedSeries(seriesWithSummary.filter((s) => s.participatedRaces > 0))

    const cars = seriesWithSummary
      .sort((a, b) => a.eligible - b.eligible)
      .filter((a, index) => a.eligible < MINIMUM_NUMBER_OF_RACES_TO_GET_CREDITS && index < 10)
      .flatMap((series) =>
        series.schedules.flatMap((s) => {
          return s.cars
        }),
      )
      .filter((car) => !car.free)
      .filter((value, index, array) => {
        return (
          array.findIndex((value2) => {
            return value.id === value2.id
          }) === index
        )
      })
    setBestCarsToBuy(cars)
  }, [season.data, userRepository.participatedSeries])

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
        <div className="list">
          {participatedSeries.flatMap((series, index, array) => (
            <div key={`${series.id}`}>
              <Row className="summary-row">
                <Column className="main">
                  <Text relevance="important">{series.name}</Text>
                  <Text>
                    Participações: {userRepository.participatedRaces.filter((r) => r.serieId === series.id).length},
                    elegíveis:{" "}
                    {
                      series.schedules.filter((s) => {
                        const hasTracks = s.track.free || userRepository.myTracks.find((t) => t.id === s.track.id)
                        const hasCars = s.cars.find(
                          (car) => car.free || userRepository.myCars.find((c) => car.id === c.id),
                        )
                        return hasTracks && hasCars
                      }).length
                    }
                    , mínimo de participações:
                    {MINIMUM_NUMBER_OF_RACES_TO_GET_CREDITS}
                  </Text>
                </Column>
              </Row>
              {index < array.length - 1 ? <hr /> : null}
            </div>
          ))}
        </div>

        <Text size="large" relevance="important">
          Melhores conteúdos para comprar
        </Text>
        <div className="list">
          {bestCarsToBuy.flatMap((car, index, array) => (
            <div key={`${car.id}`}>
              <CarRow
                car={car}
                selected={car.free || userRepository.myCars.find((c) => c.id === car.id)}
                onSelect={(checked) => userRepository.setCar(checked, car)}
              />
              {index < array.length - 1 ? <hr /> : null}
            </div>
          ))}
        </div>
      </Column>
    </Row>
  )
}
