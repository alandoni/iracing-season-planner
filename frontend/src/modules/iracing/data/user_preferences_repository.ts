import { Car } from "racing-tools-data/iracing/season/models/car"
import { Schedule } from "racing-tools-data/iracing/season/models/schedule"
import { Track } from "racing-tools-data/iracing/season/models/track"
import { Category } from "racing-tools-data/iracing/season/models/category"
import { License } from "racing-tools-data/iracing/season/models/license"
import { UserPreferences, UserPreferencesStorage } from "./user_preferences_storage.js"

export class UserPreferencesRepository {
  constructor(private userStorage: UserPreferencesStorage) {}

  getUserPreferences(): UserPreferences | null {
    return this.userStorage.getUserPreferences()
  }

  setUserPreferences(content: UserPreferences) {
    return this.userStorage.setUserPreferences(content)
  }

  getLastUpdatedDate() {
    return this.userStorage.getLastChangedDate()
  }

  setPreferredCategories(categoryIds: number[]) {
    this.userStorage.setPreferredCategories(categoryIds)
  }

  setPreferredLicenses(licenseIds: number[]) {
    this.userStorage.setPreferredLicenses(licenseIds)
  }

  private addOrRemoveFromList<T extends { id: number }>(list: number[], item: T, add: boolean) {
    if (add) {
      list.push(item.id)
    } else {
      list.remove((c1) => c1 === item.id)
    }
    return [...list]
  }

  addOrRemoveOwnedCar(car: Car, add: boolean) {
    const old = this.userStorage.getOwnedCars()
    const carsIds = this.addOrRemoveFromList(old, car, add)
    this.userStorage.setOwnedCars(carsIds)
    return carsIds
  }

  addOrRemoveOwnedTrack(item: Track, add: boolean) {
    const old = this.userStorage.getOwnedTracks()
    const ids = this.addOrRemoveFromList(old, item, add)
    this.userStorage.setOwnedTracks(ids)
    return ids
  }

  addOrRemovePreferredCategory(item: Category, add: boolean) {
    const old = this.userStorage.getPreferredCategories()
    console.log(old)

    const ids = this.addOrRemoveFromList(old, item, add)
    this.userStorage.setPreferredCategories(ids)
    return ids
  }

  addOrRemovePreferredLicense(item: License, add: boolean) {
    const old = this.userStorage.getPreferredLicenses()
    const ids = this.addOrRemoveFromList(old, item, add)
    this.userStorage.setPreferredLicenses(ids)
    return ids
  }

  setParticipatedRace = (checked: boolean, schedule: Pick<Schedule, "serieId" | "raceWeekNum">) => {
    const raceIdentifier = `${schedule.serieId}-${schedule.raceWeekNum}`

    const old = this.userStorage.getParticipatedRaces()
    if (checked) {
      old.push(raceIdentifier)
    } else {
      old.remove((oldId) => oldId === raceIdentifier)
    }
    const ids = [...old]
    this.userStorage.setParticipatedRaces(ids)
    return ids
  }
}
