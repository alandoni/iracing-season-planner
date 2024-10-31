export const jestConfig = {
  verbose: true,
  collectCoverage: true,
  collectCoverageFrom: ["!**/node_modules/**", "!src/**/test*/**", "!<rootDir>/**/*interface.ts"],
  coverageProvider: "v8",
  testFailureExitCode: 0, //this will make it not fail on CI/CD, change it with an env var
  passWithNoTests: true,
  workerThreads: false,
  detectOpenHandles: true,
  modulePathIgnorePatterns: ["<rootDir>/node_modules", "<rootDir>/dist"],
  modulePaths: ["<rootDir>/node_modules", "<rootDir>/src"],
  reporters: [["default", { summaryThreshold: 0 }]],
  extensionsToTreatAsEsm: [".ts"],
  moduleFileExtensions: ["js", "jsx", "json", "node", "ts", "tsx"],
  transform: {
    "^.+\\.(ts|tsx)$": ["ts-jest", { tsconfig: "<rootDir>/tsconfig.json" }],
  },
  preset: "ts-jest",
  testEnvironment: "node",
  testMatch: ["<rootDir>/src/**/*.test.ts"],
}
