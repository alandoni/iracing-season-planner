import { jestConfig as jc } from "./jest.config";

export const jestConfig = {
  ...jc,
  testEnvironment: "jest-environment-jsdom",
  transformIgnorePatterns: [`node_modules/(frontend)`],
  transform: {
    ".+\\.(js|jsx|ts|tsx)$": [
      "ts-jest",
      { tsconfig: "<rootDir>/tsconfig.json" },
    ],
    "^.+\\.svg(\\?react)*$":
      "<rootDir>/node_modules/@alandoni/utils/dist/test-utils/svg_transform.js",
  },
  moduleNameMapper: {
    "^.+\\.svg(\\?react)*$": "<rootDir>/src/test-utils/svg_mock.tsx",
    "^.+\\.(gif|ttf|eot|png)$": "<rootDir>/src/test-utils/file_mock.ts",
    "^.+\\.(css)$": "<rootDir>/src/test-utils/css_mock.ts",
  },
  testMatch: ["<rootDir>/src/**/*.test.ts", "<rootDir>/src/**/*.test.tsx"],
};
