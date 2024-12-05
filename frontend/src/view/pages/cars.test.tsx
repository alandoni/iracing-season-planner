import "reflect-metadata"
import { renderHook, RenderHookResult } from "@testing-library/react"
import { act } from "react"
import { useCarsViewModel } from "./cars_view_model"
import { SeasonRepository } from "src/data/season_repository"
import { UserPreferencesRepository } from "src/data/user_repository"
import { Car } from "racing-tools-data/iracing/season/models/car"
import { Category } from "racing-tools-data/iracing/season/models/category"
import { License } from "racing-tools-data/iracing/season/models/license"
import { mockLogger } from "@alandoni/utils"

describe("Cars Page", () => {
  const seasonRepository = {} as SeasonRepository
  const userPreferencesRepository = {} as UserPreferencesRepository
  let vm: RenderHookResult<ReturnType<typeof useCarsViewModel>, never>

  beforeAll(() => {
    vm = renderHook(() => useCarsViewModel(seasonRepository, userPreferencesRepository, mockLogger))
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it("should have correct state when instantiated", () => {
    const { result } = vm
    expect(result.current).toMatchObject({ filteredCars: [] })
  })

  it("should load the data", async () => {
    const { result } = vm
    const category = new Category(1, "test")
    const license = new License()
    license.id = 1
    const car = new Car()
    car.categories = [category]
    car.licenses = [license]

    userPreferencesRepository.getUserPreferences = jest.fn().mockReturnValue(null)
    seasonRepository.getSeason = jest.fn().mockResolvedValue({
      cars: [car],
      categories: [category],
      licenses: [license],
      series: [],
    })
    await act(async () => {
      await result.current.onLoad()
    })
    expect(result.current).toMatchObject({ filteredCars: [] })
  })
})
