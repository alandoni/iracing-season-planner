import { jestConfig as jc } from "../jest.config-frontend"

const jestConfig = {
  ...jc,
  rootDir: "./",
  moduleNameMapper: {
    "^src/(.*)$": "<rootDir>/src/$1",
    "^components/(.*)$": ["<rootDir>/src/view/components/$1"],
    "^pages/(.*)$": ["<rootDir>/src/view/pages/$1"],
    "^i18n/(.*)$": ["<rootDir>/src/view/i18n/$1"],
    "^assets/(.*)$": ["<rootDir>/src/assets/$1"],
  },
}

export default jestConfig
