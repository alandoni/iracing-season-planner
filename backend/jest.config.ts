import { jestConfig as jc } from "../jest.config"

const jestConfig = {
  ...jc,
  rootDir: "./",
  setupFilesAfterEnv: ["<rootDir>/node_modules/backend/dist/test_utils/config_log_tests.js"],
  moduleNameMapper: {
    "^src/(.*)$": "<rootDir>/src/$1",
  },
}

export default jestConfig
