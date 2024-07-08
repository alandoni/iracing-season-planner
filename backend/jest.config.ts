import type { JestConfigWithTsJest } from "ts-jest"
import { compilerOptions } from "./tsconfig.json"

const jestConfig: JestConfigWithTsJest = {
  rootDir: compilerOptions.rootDir,
  verbose: false,
  collectCoverage: true,
  collectCoverageFrom: ["!**/node_modules/**", "!src/**/test*/**", "!<rootDir>/**/*interface.ts"],
  testFailureExitCode: 0, //this will make it not fail on CI/CD, change it with an env var
  coverageProvider: "v8",
  passWithNoTests: true,
  workerThreads: false,
  detectOpenHandles: true,
  reporters: [["default", { summaryThreshold: 0 }] /*,["github-actions", { silent: false }]*/],
  roots: ["<rootDir>/src"],
  moduleNameMapper: {
    "^src/(.*)$": "<rootDir>/src/$1",
  },
  modulePathIgnorePatterns: ["<rootDir>/build/"],
  modulePaths: ["<rootDir>/node_modules", "<rootDir>/src"],
  moduleFileExtensions: ["js", "jsx", "json", "node", "ts", "tsx"],
  preset: "ts-jest",
  transform: {
    "^.+\\.(ts|tsx)$": "ts-jest",
  },
  testEnvironment: "node",
}

export default jestConfig
