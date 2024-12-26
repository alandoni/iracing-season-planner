export type UserPreferences = {
  myCarsIds: number[]
  myTracksIds: number[]
  participatedRacesIds: string[]
  preferredCategories: number[]
  preferredLicenses: number[]
  lastUpdatedDate: Date
}

export class UserPreferencesStorage {
  static LOCAL_STORAGE_MY_CARS_KEY = "myCars"
  static LOCAL_STORAGE_MY_TRACKS_KEY = "myTracks"
  static LOCAL_STORAGE_PARTICIPATED_RACES_KEY = "participatedRaces"
  static LOCAL_STORAGE_PREFERRED_CATEGORIES_KEY = "preferredCategories"
  static LOCAL_STORAGE_PREFERRED_LICENSES_KEY = "preferredLicenses"
  static LOCAL_STORAGE_LAST_UPDATE_KEY = "lastUpdateKey"

  constructor(private storage: Storage) {}

  getUserPreferences(): UserPreferences | null {
    const date = this.getLastChangedDate()
    if (!date) {
      return null
    }
    return {
      myCarsIds: this.getOwnedCars(),
      myTracksIds: this.getOwnedTracks(),
      participatedRacesIds: this.getParticipatedRaces(),
      preferredCategories: this.getPreferredCategories(),
      preferredLicenses: this.getPreferredLicenses(),
      lastUpdatedDate: date,
    }
  }

  setUserPreferences(content: UserPreferences) {
    this.storage.setItem(UserPreferencesStorage.LOCAL_STORAGE_MY_CARS_KEY, JSON.stringify(content.myCarsIds))
    this.storage.setItem(UserPreferencesStorage.LOCAL_STORAGE_MY_TRACKS_KEY, JSON.stringify(content.myTracksIds))
    this.storage.setItem(
      UserPreferencesStorage.LOCAL_STORAGE_PARTICIPATED_RACES_KEY,
      JSON.stringify(content.participatedRacesIds),
    )
    this.storage.setItem(
      UserPreferencesStorage.LOCAL_STORAGE_PREFERRED_CATEGORIES_KEY,
      JSON.stringify(content.preferredCategories),
    )
    this.storage.setItem(
      UserPreferencesStorage.LOCAL_STORAGE_PREFERRED_LICENSES_KEY,
      JSON.stringify(content.preferredLicenses),
    )
    this.storage.setItem(UserPreferencesStorage.LOCAL_STORAGE_LAST_UPDATE_KEY, new Date().toISOString())
    this.setLastChangedDate()
  }

  getOwnedCars(): number[] {
    return JSON.parse(this.storage.getItem(UserPreferencesStorage.LOCAL_STORAGE_MY_CARS_KEY) ?? "[]")
  }

  setOwnedCars(carsIds: number[]) {
    this.storage.setItem(UserPreferencesStorage.LOCAL_STORAGE_MY_CARS_KEY, JSON.stringify(carsIds))
    this.setLastChangedDate()
  }

  getOwnedTracks(): number[] {
    return JSON.parse(this.storage.getItem(UserPreferencesStorage.LOCAL_STORAGE_MY_TRACKS_KEY) ?? "[]")
  }

  setOwnedTracks(tracks: number[]) {
    this.storage.setItem(UserPreferencesStorage.LOCAL_STORAGE_MY_TRACKS_KEY, JSON.stringify(tracks))
    this.setLastChangedDate()
  }

  getParticipatedRaces(): string[] {
    return JSON.parse(this.storage.getItem(UserPreferencesStorage.LOCAL_STORAGE_PARTICIPATED_RACES_KEY) ?? "[]")
  }

  setParticipatedRaces(races: string[]) {
    this.storage.setItem(UserPreferencesStorage.LOCAL_STORAGE_PARTICIPATED_RACES_KEY, JSON.stringify(races))
    this.setLastChangedDate()
  }

  getPreferredLicenses(): number[] {
    return JSON.parse(this.storage.getItem(UserPreferencesStorage.LOCAL_STORAGE_PREFERRED_LICENSES_KEY) ?? "[]")
  }

  setPreferredLicenses(licenses: number[]) {
    this.storage.setItem(UserPreferencesStorage.LOCAL_STORAGE_PREFERRED_LICENSES_KEY, JSON.stringify(licenses))
    this.setLastChangedDate()
  }

  getPreferredCategories(): number[] {
    return JSON.parse(this.storage.getItem(UserPreferencesStorage.LOCAL_STORAGE_PREFERRED_CATEGORIES_KEY) ?? "[]")
  }

  setPreferredCategories(categories: number[]) {
    this.storage.setItem(UserPreferencesStorage.LOCAL_STORAGE_PREFERRED_CATEGORIES_KEY, JSON.stringify(categories))
    this.setLastChangedDate()
  }

  private setLastChangedDate() {
    this.storage.setItem(UserPreferencesStorage.LOCAL_STORAGE_LAST_UPDATE_KEY, new Date().toISOString())
  }

  getLastChangedDate(): Date | null {
    const dateStr = this.storage.getItem(UserPreferencesStorage.LOCAL_STORAGE_LAST_UPDATE_KEY)
    if (dateStr) {
      return new Date(dateStr)
    } else {
      return null
    }
  }
}
