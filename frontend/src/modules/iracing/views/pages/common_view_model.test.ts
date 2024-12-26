import { renderHook, RenderHookResult } from "@testing-library/react"
import { UserPreferencesRepository } from "../../data/user_preferences_repository"
import { useCommonViewModel } from "./common_view_model"
import {
  car1,
  createSeason,
  schedule1Series1,
  seasonRepositoryMock,
  series1,
  track1,
} from "src/test-utils/season_repository_mock"
import { mockLogger } from "@alandoni/utils"
import { act } from "react"
import { SeasonRepositoryInterface } from "racing-tools-data/iracing/season/season_repository_interface"

describe("CommonViewModel", () => {
  const userPreferencesRepository = {
    getUserPreferences: () => null,
    setPreferredCategories: (ids: number[]) => {
      jest.fn()(ids)
    },
    setPreferredLicenses: (ids: number[]) => {
      jest.fn()(ids)
    },
  } as UserPreferencesRepository
  let vm: RenderHookResult<ReturnType<typeof useCommonViewModel>, never>

  beforeAll(() => {
    createSeason()
  })

  beforeEach(() => {
    vm = renderHook(() => useCommonViewModel(seasonRepositoryMock, userPreferencesRepository, mockLogger))
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it("should have correct state when instantiated", () => {
    const { result } = vm
    expect(result.current).toMatchObject({
      loading: false,
      error: undefined,
      season: undefined,
      search: "",
      myCars: [],
      myTracks: [],
      participatedSeries: [],
      participatedRaces: [],
      preferredCategories: [],
      preferredLicenses: [],
    })
  })

  describe("onLoad", () => {
    it("should set error when something fails", async () => {
      const error = new Error("error")
      const repository: SeasonRepositoryInterface = {
        getSeason: jest.fn().mockRejectedValue(error),
      }
      vm = renderHook(() => useCommonViewModel(repository, userPreferencesRepository, mockLogger))
      const { result } = vm

      await act(async () => {
        await result.current.onLoad()
      })
      expect(result.current.loading).toBe(false)
      expect(result.current.error).toMatchObject(error)
      expect(result.current).toMatchObject({
        season: undefined,
        search: "",
        myCars: [],
        myTracks: [],
        participatedSeries: [],
        participatedRaces: [],
        preferredCategories: [],
        preferredLicenses: [],
      })
    })

    it("should load preferences without categories and licenses", async () => {})
  })

  describe("setCar", () => {
    it("should set the car as owned", async () => {
      const { result } = vm
      userPreferencesRepository.addOrRemoveOwnedCar = jest.fn().mockReturnValue([car1.id])

      await act(async () => {
        await result.current.onLoad()
      })

      act(() => {
        result.current.setCar(true, car1)
      })

      expect(result.current.myCars).toEqual([car1])
    })

    it("should remove the car as owned", async () => {
      const { result } = vm
      userPreferencesRepository.addOrRemoveOwnedCar = jest.fn().mockReturnValue([])

      await act(async () => {
        await result.current.onLoad()
      })

      act(() => {
        result.current.setCar(false, car1)
      })

      expect(result.current.myCars).toEqual([])
    })
  })

  describe("setTrack", () => {
    it("should set the track as owned", async () => {
      const { result } = vm
      userPreferencesRepository.addOrRemoveOwnedTrack = jest.fn().mockReturnValue([track1.id])

      await act(async () => {
        await result.current.onLoad()
      })

      act(() => {
        result.current.setTrack(true, track1)
      })

      expect(result.current.myTracks).toEqual([track1])
    })
  })

  describe("setParticipatedRace", () => {
    it("should set the car as owned", async () => {
      const { result } = vm
      userPreferencesRepository.setParticipatedRace = jest
        .fn()
        .mockReturnValue([`${series1.id}-${schedule1Series1.raceWeekNum}`])

      await act(async () => {
        await result.current.onLoad()
      })

      act(() => {
        result.current.setParticipatedRace(true, schedule1Series1)
      })

      expect(result.current.participatedRaces).toMatchObject([{ ...schedule1Series1, cars: [car1], track: track1 }])
      expect(result.current.participatedSeries).toMatchObject([expect.objectContaining({ id: series1.id })])
    })
  })
})
