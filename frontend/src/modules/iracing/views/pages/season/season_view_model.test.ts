import { renderHook, RenderHookResult } from "@testing-library/react"
import { UserPreferencesRepository } from "src/modules/iracing/data/user_preferences_repository"
import { useSeasonViewModel } from "./season_view_model"
import {
  car1,
  category1,
  category2,
  createSeason,
  license1,
  license2,
  schedule1Series1,
  schedule1Series2,
  schedule1Series3,
  schedule2Series1,
  schedule2Series2,
  schedule2Series3,
  seasonRepositoryMock,
  series1,
  series2,
  series3,
  series4,
  track1,
} from "src/test-utils/season_repository_mock"
import { mockLogger } from "@alandoni/utils"
import { act } from "react"
import { SeasonRepositoryInterface } from "racing-tools-data/iracing/season/season_repository_interface"

describe("SeasonViewModel", () => {
  const userPreferencesRepository = {
    getUserPreferences: () => null,
    setPreferredCategories: (ids: number[]) => {
      jest.fn()(ids)
    },
    setPreferredLicenses: (ids: number[]) => {
      jest.fn()(ids)
    },
  } as UserPreferencesRepository
  let vm: RenderHookResult<ReturnType<typeof useSeasonViewModel>, never>

  beforeEach(() => {
    vm = renderHook(() => useSeasonViewModel(seasonRepositoryMock, userPreferencesRepository, mockLogger))
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
      week: undefined,
      showOnlySeriesEligible: false,
    })
  })

  describe("OnLoad", () => {
    it("should load the data without enough schedules", async () => {
      const seasonRepository: SeasonRepositoryInterface = {
        getSeason: () => {
          const season = createSeason()
          season.series = [series1, series2]
          return Promise.resolve(season)
        },
      }
      const vm = renderHook(() => useSeasonViewModel(seasonRepository, userPreferencesRepository, mockLogger))
      const { result } = vm

      await act(async () => {
        await result.current.onLoad()
      })
      expect(result.current.loading).toBe(false)
      expect(result.current).toMatchObject({
        preferredCategories: [category1, category2],
        preferredLicenses: [license1, license2],
        week: -1,
        showOnlySeriesEligible: false,
      })
      expect(result.current.filteredSeries.map((s) => s.id)).toMatchObject([series1.id, series2.id])
      expect(result.current.filteredSeries[0].schedules[0].cars[0].name).toBe(car1.name)
    })

    it("should load the data with enough schedules", async () => {
      const { result } = vm

      await act(async () => {
        await result.current.onLoad()
      })

      expect(result.current).toMatchObject({
        loading: false,
        preferredCategories: [category1, category2],
        preferredLicenses: [license1, license2],
        week: 2,
        showOnlySeriesEligible: false,
      })
      expect(result.current.filteredSeries.map((s) => s.id)).toMatchObject([series1.id, series2.id, series3.id])
      expect(result.current.filteredSeries[0].schedules[0].cars[0].name).toBe(car1.name)
    })

    it("should load the data with enough schedules but they are not near the current date", async () => {
      const seasonRepository: SeasonRepositoryInterface = {
        getSeason: () => {
          const season = createSeason()
          season.series = [
            series1,
            series2,
            {
              ...series3,
              calculateMinimumParticipation: jest.fn(),
              schedules: series3.schedules.map((s) => ({ ...s, startDate: new Date("01/01/2024") })),
            },
          ]
          return Promise.resolve(season)
        },
      }
      const vm = renderHook(() => useSeasonViewModel(seasonRepository, userPreferencesRepository, mockLogger))
      const { result } = vm

      await act(async () => {
        await result.current.onLoad()
      })
      expect(result.current.loading).toBe(false)
      expect(result.current).toMatchObject({
        preferredCategories: [category1, category2],
        preferredLicenses: [license1, license2],
        week: -1,
        showOnlySeriesEligible: false,
      })
      expect(result.current.filteredSeries.map((s) => s.id)).toMatchObject([series1.id, series2.id, series3.id])
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
      expect(result.current.filteredSeries.map((s) => s.id)).toMatchObject([series1.id, series2.id, series3.id])
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
      expect(result.current.filteredSeries.map((s) => s.id)).toMatchObject([series2.id, series3.id])
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
      expect(result.current.filteredSeries.map((s) => s.id)).toMatchObject([series2.id, series3.id])
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

      act(() => {
        result.current.setWeek(-1)
      })

      expect(result.current).toMatchObject({
        search: "",
        week: -1,
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
        result.current.setWeek(-1)
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

  describe("setWeek", () => {
    it("should filter", async () => {
      const { result } = vm

      await act(async () => {
        await result.current.onLoad()
      })

      act(() => {
        result.current.setWeek(2)
      })

      expect(result.current).toMatchObject({
        search: "",
        week: 2,
      })
      expect(result.current.filteredSeries.map((s) => s.id)).toMatchObject([series1.id, series2.id, series3.id])
      expect(result.current.filteredSeries.flatMap((s) => s.schedules).flatMap((s) => s.raceWeekNum)).toMatchObject([
        schedule2Series1.raceWeekNum,
        schedule2Series2.raceWeekNum,
        schedule2Series3.raceWeekNum,
      ])
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
        result.current.setWeek(1)
      })

      act(() => {
        result.current.setSearch("Dallara")
      })

      expect(result.current).toMatchObject({
        search: "Dallara",
        preferredLicenses: [license2],
      })
      expect(result.current.filteredSeries.map((s) => s.id)).toMatchObject([series4.id])
      expect(result.current.filteredSeries.flatMap((s) => s.schedules.flatMap((s) => s.raceWeekNum))).toMatchObject([
        schedule1Series1.raceWeekNum,
        schedule1Series2.raceWeekNum,
        schedule1Series3.raceWeekNum,
      ])
    })
  })

  describe("setShowOnlySeriesEligible", () => {
    it("should show only eligible series", async () => {
      createSeason()
      userPreferencesRepository.getUserPreferences = jest.fn().mockReturnValueOnce({
        myCarsIds: [car1.id],
        myTracksIds: [track1.id],
        preferredCategories: [],
        preferredLicenses: [],
        participatedRacesIds: [],
      })
      const { result } = vm
      await act(async () => {
        await result.current.onLoad()
      })

      act(() => {
        result.current.setWeek(-1)
        result.current.setShowOnlySeriesEligible(true)
      })

      expect(result.current).toMatchObject({
        search: "",
        showOnlySeriesEligible: true,
        week: -1,
        myCars: [car1],
        myTracks: [track1],
      })
      expect(result.current.filteredSeries.map((s) => s.id)).toMatchObject([series1.id, series4.id])
      expect(result.current.filteredSeries.flatMap((s) => s.schedules).flatMap((s) => s.raceWeekNum)).toMatchObject([
        schedule1Series1.raceWeekNum,
        schedule1Series1.raceWeekNum,
      ])
    })
  })
})
