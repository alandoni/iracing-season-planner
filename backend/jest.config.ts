import { jestConfig as jc } from "../jest.config"

const jestConfig = {
  ...jc,
  rootDir: "./",
  moduleNameMapper: {
    "^src/(.*)$": "<rootDir>/src/$1",
  },
}

export default jestConfig
