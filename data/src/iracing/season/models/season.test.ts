import "reflect-metadata"
import { Season } from "./season"
import { Category } from "./category"
import { Car } from "./car"
import { plainToInstance } from "@alandoni/utils"

describe("Season", () => {
  it("should deserialize correctly", () => {
    const object = {
      categories: [{ id: 1, _name: "A" }],
      cars: [{ id: 1, categories: [{ id: 1, _name: "A" }] }],
    }
    const result = plainToInstance(Season, object)
    expect(result.categories[0]["_name"]).toBe("A")
    expect(result.categories[0]).toBeInstanceOf(Category)
    expect(result.categories[0].name).toBe("A")

    expect(result.cars[0]).toBeInstanceOf(Car)
    expect(result.cars[0].categories[0]["_name"]).toBe("A")
    expect(result.cars[0].categories[0]).toBeInstanceOf(Category)
    expect(result.cars[0].categories[0].name).toBe("A")
  })
})
