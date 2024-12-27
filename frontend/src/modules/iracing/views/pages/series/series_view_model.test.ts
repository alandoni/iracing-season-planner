import { renderHook, RenderHookResult } from "@testing-library/react"
import { UserPreferencesRepository } from "src/modules/iracing/data/user_preferences_repository"
import { useSeriesViewModel } from "./series_view_model"
import {
  car1,
  category1,
  category2,
  license1,
  license2,
  seasonRepositoryMock,
  series1,
  series2,
  series3,
  series4,
} from "src/test-utils/season_repository_mock"
import { mockLogger } from "@alandoni/utils"
import { act } from "react"

describe("SeriesViewModel", () => {
  const userPreferencesRepository = {
    getUserPreferences: () => null,
    setPreferredCategories: (ids: number[]) => {
      jest.fn()(ids)
    },
    setPreferredLicenses: (ids: number[]) => {
      jest.fn()(ids)
    },
  } as UserPreferencesRepository
  let vm: RenderHookResult<ReturnType<typeof useSeriesViewModel>, never>

  beforeEach(() => {
    vm = renderHook(() => useSeriesViewModel(seasonRepositoryMock, userPreferencesRepository, mockLogger))
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it("should have correct state when instantiated", () => {
    const { result } = vm
    expect(result.current).toMatchObject({
      season: undefined,
      filteredSeries: [],
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
        preferredCategories: [category1, category2],
        preferredLicenses: [license1, license2],
      })
      expect(result.current.filteredSeries.map((s) => s.id)).toMatchObject([
        series1.id,
        series2.id,
        series3.id,
        series4.id,
      ])
      expect(result.current.filteredSeries[0].schedules[0].cars[0].name).toBe(car1.name)
    })
  })

  describe("OnSearch", () => {
    it("should search the data by name", async () => {
      const { result } = vm

      await act(async () => {
        await result.current.onLoad()
      })

      act(() => {
        result.current.setSearch("Formula")
      })

      expect(result.current).toMatchObject({
        search: "Formula",
      })
      expect(result.current.filteredSeries.map((s) => s.id)).toMatchObject([series1.id])
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
      })
      expect(result.current.filteredSeries.map((s) => s.id)).toMatchObject([
        series1.id,
        series2.id,
        series3.id,
        series4.id,
      ])
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
      })
      expect(result.current.filteredSeries.map((s) => s.id)).toMatchObject([series2.id, series3.id, series4.id])
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
      })
      expect(result.current.filteredSeries.map((s) => s.id)).toMatchObject([series2.id, series3.id, series4.id])
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
      })
      expect(result.current.filteredSeries.map((s) => s.id)).toMatchObject([series2.id, series4.id])
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
        result.current.setSearch("Dallara")
      })

      expect(result.current).toMatchObject({
        search: "Dallara",
        preferredLicenses: [license2],
      })
      expect(result.current.filteredSeries.map((s) => s.id)).toMatchObject([series4.id])
    })
  })
})
