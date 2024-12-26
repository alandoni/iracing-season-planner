import { renderHook, RenderHookResult } from "@testing-library/react"
import { UserPreferencesRepository } from "src/modules/iracing/data/user_preferences_repository"
import { useSummaryViewModel } from "./summary_view_model"
import {
  car1,
  car2,
  category1,
  category2,
  createSeason,
  license1,
  license2,
  schedule1Series1,
  seasonRepositoryMock,
  series1,
  series3,
  track1,
  track2,
  track3,
} from "src/test-utils/season_repository_mock"
import { mockLogger } from "@alandoni/utils"
import { act } from "react"

describe("SummaryViewModel", () => {
  const userPreferencesRepository = {
    getUserPreferences: () => null,
  } as UserPreferencesRepository
  let vm: RenderHookResult<ReturnType<typeof useSummaryViewModel>, never>

  beforeEach(() => {
    vm = renderHook(() => useSummaryViewModel(seasonRepositoryMock, userPreferencesRepository, mockLogger))
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it("should have correct state when instantiated", () => {
    const { result } = vm

    expect(result.current).toMatchObject({
      season: undefined,
      loading: false,
      error: undefined,
      search: "",
      myCars: [],
      myTracks: [],
      participatedSeries: [],
      bestCarsToBuy: [],
      bestTracksToBuy: [],
      almostEligibleSeriesAndContentToBuy: [],
      preferredCategories: [],
      preferredLicenses: [],
      showOnlySeriesEligible: false,
      showOwnedContent: false,
    })
  })

  describe("OnLoad", () => {
    it("should load the data with enough schedules", async () => {
      const { result } = vm

      await act(async () => {
        await result.current.onLoad()
      })

      expect(result.current).toMatchObject({
        loading: false,
        preferredCategories: [category1, category2],
        preferredLicenses: [license1, license2],
        myCars: [],
        myTracks: [],
        participatedSeries: [expect.objectContaining({ id: series1.id, name: series1.name })],
        bestCarsToBuy: [],
        bestTracksToBuy: [expect.objectContaining({ id: track3.id, name: track3.name })],
        almostEligibleSeriesAndContentToBuy: [
          {
            cars: [],
            series: expect.objectContaining({ id: series3.id, name: series3.name }),
            tracks: [track3],
          },
        ],
        showOnlySeriesEligible: false,
        showOwnedContent: false,
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
        loading: false,
        preferredCategories: [category2],
        preferredLicenses: [license1, license2],
        myCars: [],
        myTracks: [],
        participatedSeries: [],
        bestCarsToBuy: [],
        bestTracksToBuy: [expect.objectContaining({ id: track3.id, name: track3.name })],
        almostEligibleSeriesAndContentToBuy: [
          {
            cars: [],
            series: expect.objectContaining({ id: series3.id, name: series3.name }),
            tracks: [track3],
          },
        ],
        showOnlySeriesEligible: false,
        showOwnedContent: false,
      })
    })
  })

  describe("setPreferredLicenses", () => {
    it("should filter", async () => {
      const { result } = vm

      userPreferencesRepository.addOrRemovePreferredLicense = jest.fn().mockReturnValue([license1.id])
      await act(async () => {
        await result.current.onLoad()
      })

      act(() => {
        result.current.setPreferredLicense(true, license1)
      })

      expect(result.current).toMatchObject({
        loading: false,
        preferredCategories: [category1, category2],
        preferredLicenses: [license1],
        myCars: [],
        myTracks: [],
        participatedSeries: [expect.objectContaining({ id: series1.id, name: series1.name })],
        bestCarsToBuy: [],
        bestTracksToBuy: [expect.objectContaining({ id: track3.id, name: track3.name })],
        almostEligibleSeriesAndContentToBuy: [
          {
            cars: [],
            series: expect.objectContaining({ id: series3.id, name: series3.name }),
            tracks: [track3],
          },
        ],
        showOnlySeriesEligible: false,
        showOwnedContent: false,
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
        result.current.setSearch("Dallara")
      })

      expect(result.current).toMatchObject({
        search: "Dallara",
        preferredLicenses: [license2],
      })
    })
  })

  describe("setOnlyShowSeriesEligible", () => {
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
        result.current.setShowOnlySeriesEligible(true)
      })

      expect(result.current).toMatchObject({
        loading: false,
        preferredCategories: [category1, category2],
        preferredLicenses: [license1, license2],
        myCars: [car1],
        myTracks: [track1],
        participatedSeries: [expect.objectContaining({ id: series1.id, name: series1.name })],
        bestCarsToBuy: [],
        bestTracksToBuy: [
          expect.objectContaining({ id: track2.id, name: track2.name }),
          expect.objectContaining({ id: track3.id, name: track3.name }),
        ],
        almostEligibleSeriesAndContentToBuy: [
          {
            cars: [],
            series: expect.objectContaining({ id: series3.id, name: series3.name }),
            tracks: [track3],
          },
        ],
        showOnlySeriesEligible: true,
        showOwnedContent: false,
      })
    })
  })

  describe("setShowOwnedContent", () => {
    it("should show owned content", async () => {
      createSeason()
      userPreferencesRepository.getUserPreferences = jest.fn().mockReturnValueOnce({
        myCarsIds: [car1.id, car2.id],
        myTracksIds: [track1.id, track2.id],
        preferredCategories: [],
        preferredLicenses: [],
        participatedRacesIds: [`${schedule1Series1.serieId}-${schedule1Series1.raceWeekNum}`],
      })
      const { result } = vm
      await act(async () => {
        await result.current.onLoad()
      })

      act(() => {
        result.current.setShowOwnedContent(true)
      })

      expect(result.current).toMatchObject({
        loading: false,
        preferredCategories: [category1, category2],
        preferredLicenses: [license1, license2],
        myCars: [car1, car2],
        myTracks: [track1, track2],
        participatedSeries: [expect.objectContaining({ id: series1.id, name: series1.name })],
        bestCarsToBuy: [],
        bestTracksToBuy: [expect.objectContaining({ id: track3.id, name: track3.name })],
        almostEligibleSeriesAndContentToBuy: [
          {
            cars: [],
            series: expect.objectContaining({ id: series3.id, name: series3.name }),
            tracks: [track3],
          },
        ],
        showOwnedContent: true,
        showOnlySeriesEligible: false,
      })
    })
  })
})
