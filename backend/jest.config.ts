import type { Config } from "jest";

const config: Config = {
  moduleFileExtensions: ["ts", "js"],
  transform: {
    "^.+\\.ts$": "ts-jest",
  },
  testMatch: ["**/*.test.ts"],
  moduleNameMapper: {
    "^@config$": "<rootDir>/config",
    "^@db$": "<rootDir>/db",
    "^@db/(.*)$": "<rootDir>/db/$1",
    "^@models/(.*)$": "<rootDir>/models/$1",
  },
  rootDir: ".",
};

export default config;
