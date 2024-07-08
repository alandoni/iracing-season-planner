import { HttpClient } from "data/http_client"
import { CarRepository } from "data/cars/car_repository"
import { LicenseRepository } from "data/license/license_repository"
import { SeasonController } from "data/season/season_controller"
import { SeasonRepository } from "data/season/season_repository"
import { TrackRepository } from "data/tracks/track_repository"
import { UserRepository } from "data/user/user_repository"

const httpClient = new HttpClient()

export function getHttpClient() {
  return httpClient
}

export function getUserRepository() {
  return new UserRepository(getHttpClient())
}

export function getSeasonRepository() {
  return new SeasonRepository(getHttpClient())
}

export function getLicenseRepository() {
  return new LicenseRepository(getHttpClient())
}

export function getSeasonController() {
  return new SeasonController(
    getSeasonRepository(),
    getUserRepository(),
    getCarRepository(),
    getTracksRepository(),
    getLicenseRepository(),
  )
}

export function getCarRepository() {
  return new CarRepository(getHttpClient())
}

export function getTracksRepository() {
  return new TrackRepository(getHttpClient())
}
