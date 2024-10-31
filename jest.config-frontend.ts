import { jestConfig as jc } from "./jest.config"

export const jestConfig = {
  ...jc,
  testEnvironment: "jest-environment-jsdom",
  transform: {
    ".+\\.(ts|tsx)$": "ts-jest",
    "^.+\\.svg(\\?react)*$": "<rootDir>/src/test-utils/svg_transform.ts",
  },
  moduleNameMapper: {
    "^.+\\.svg(\\?react)*$": "<rootDir>/src/test-utils/svg_mock.tsx",
    "^.+\\.(gif|ttf|eot|png)$": "<rootDir>/src/test-utils/file_mock.ts",
    "^.+\\.(css)$": "<rootDir>/src/test-utils/css_mock.ts",
  },
  testMatch: ["<rootDir>/src/**/*.test.ts", "<rootDir>/src/**/*.test.tsx"],
}
