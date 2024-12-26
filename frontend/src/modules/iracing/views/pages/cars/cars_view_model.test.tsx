import { renderHook, RenderHookResult } from "@testing-library/react"
import { act } from "react"
import { useCarsViewModel } from "./cars_view_model"
import { UserPreferencesRepository } from "src/modules/iracing/data/user_preferences_repository"
import { mockLogger } from "@alandoni/utils"
import {
  car1,
  car2,
  car3,
  category1,
  category2,
  license1,
  license2,
  seasonRepositoryMock,
} from "src/test-utils/season_repository_mock"

describe("CarsViewModel", () => {
  const userPreferencesRepository = {
    getUserPreferences: () => null,
  } as UserPreferencesRepository
  let vm: RenderHookResult<ReturnType<typeof useCarsViewModel>, never>

  beforeEach(() => {
    vm = renderHook(() => useCarsViewModel(seasonRepositoryMock, userPreferencesRepository, mockLogger))
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it("should have correct state when instantiated", () => {
    const { result } = vm
    expect(result.current).toMatchObject({
      season: undefined,
      filteredCars: [],
      loading: false,
      error: undefined,
      search: "",
      myCars: [],
      myTracks: [],
      participatedSeries: [],
      participatedRaces: [],
      preferredCategories: [],
      preferredLicenses: [],
    })
  })

  describe("OnLoad", () => {
    it("should load the data", async () => {
      const { result } = vm

      await act(async () => {
        await result.current.onLoad()
      })
      expect(result.current.loading).toBe(false)
      expect(result.current).toMatchObject({
        filteredCars: [car1, car2, car3],
        preferredCategories: [category1, category2],
        preferredLicenses: [license1, license2],
      })
    })
  })

  describe("OnSearch", () => {
    it("should search the data by name", async () => {
      const { result } = vm

      await act(async () => {
        await result.current.onLoad()
      })

      act(() => {
        result.current.setSearch("Legends")
      })

      expect(result.current).toMatchObject({
        search: "Legends",
        filteredCars: [car1],
      })
    })

    it("should search the data by category name", async () => {
      const { result } = vm

      await act(async () => {
        await result.current.onLoad()
      })

      await act(async () => {
        result.current.setSearch("Sports")
      })

      expect(result.current).toMatchObject({
        search: "Sports",
        filteredCars: [car2, car3],
      })
    })
  })

  describe("setPreferredCategories", () => {
    it("should filter", async () => {
      const { result } = vm

      userPreferencesRepository.addOrRemovePreferredCategory = jest.fn().mockReturnValue([category2.id])
      await act(async () => {
        await result.current.onLoad()
      })

      act(() => {
        result.current.setPreferredCategory(true, category2)
      })

      expect(result.current).toMatchObject({
        search: "",
        preferredCategories: [category2],
        filteredCars: [car2, car3],
      })
    })

    it("should search the data by name", async () => {
      const { result } = vm

      userPreferencesRepository.addOrRemovePreferredCategory = jest.fn().mockReturnValue([category2.id])
      await act(async () => {
        await result.current.onLoad()
      })

      act(() => {
        result.current.setPreferredCategory(true, category2)
      })

      act(() => {
        result.current.setSearch("Legends")
      })

      expect(result.current).toMatchObject({
        search: "Legends",
        preferredCategories: [category2],
        filteredCars: [],
      })
    })
  })

  describe("setPreferredLicenses", () => {
    it("should filter", async () => {
      const { result } = vm

      userPreferencesRepository.addOrRemovePreferredLicense = jest.fn().mockReturnValue([license2.id])
      await act(async () => {
        await result.current.onLoad()
      })

      act(() => {
        result.current.setPreferredLicense(true, license2)
      })

      expect(result.current).toMatchObject({
        search: "",
        preferredLicenses: [license2],
        filteredCars: [car3],
      })
    })

    it("should search the data by name", async () => {
      const { result } = vm

      userPreferencesRepository.addOrRemovePreferredLicense = jest.fn().mockReturnValue([license2.id])
      await act(async () => {
        await result.current.onLoad()
      })

      act(() => {
        result.current.setPreferredLicense(true, license2)
      })

      act(() => {
        result.current.setSearch("Legends")
      })

      expect(result.current).toMatchObject({
        search: "Legends",
        preferredLicenses: [license2],
        filteredCars: [],
      })
    })
  })
})
