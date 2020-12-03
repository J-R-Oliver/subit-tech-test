module.exports = {
  roots: ["<rootDir>/src/", "<rootDir>/tests/"],
  preset: "ts-jest",
  testEnvironment: "node",
  collectCoverage: true,
  setupFilesAfterEnv: ["jest-sorted"],
  coverageDirectory: "<rootDir>/coverage",
  coverageThreshold: {
    global: {
      branches: 85,
      functions: 85,
      lines: 85,
      statements: 85,
    },
  },
};
