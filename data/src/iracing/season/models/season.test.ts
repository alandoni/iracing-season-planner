import "reflect-metadata"
import { Season } from "./season"
import { Category } from "./category"
import { plainToClass } from "class-transformer"

describe("Season", () => {
  it("should deserialize correctly", () => {
    const object = {
      categories: [{ id: 1, _name: "A" }],
    }
    const result = plainToClass(Season, object)
    console.log(result)
    expect(result.categories[0]["_name"]).toBe("A")
    expect(result.categories[0]).toBeInstanceOf(Category)
    expect(result.categories[0].name).toBe("A")
  })
})
