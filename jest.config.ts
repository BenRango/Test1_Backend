import type { JestConfigWithTsJest } from 'ts-jest';

const config: JestConfigWithTsJest = {
  preset: 'ts-jest/presets/default-esm',
  testEnvironment: 'node',

  extensionsToTreatAsEsm: ['.ts', '.mts'],

  moduleNameMapper: {
    '^@/(.*)\\.js$': '<rootDir>/src/$1',
    '^@models/(.*)\\.js$': '<rootDir>/src/models/$1',
    '^@controllers/(.*)\\.js$': '<rootDir>/src/controllers/$1',
    '^@routes/(.*)\\.js$': '<rootDir>/src/routes/$1',
    '^@config/(.*)\\.js$': '<rootDir>/src/config/$1',

    '^(\\.{1,2}/.*)\\.js$': '$1',

    '^@/(.*)$': '<rootDir>/src/$1',
    '^@models/(.*)$': '<rootDir>/src/models/$1',
    '^@controllers/(.*)$': '<rootDir>/src/controllers/$1',
    '^@routes/(.*)$': '<rootDir>/src/routes/$1',
    '^@config/(.*)$': '<rootDir>/src/config/$1',
  },

  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  transform: {
    '^.+\\.m?[tj]s$': [
      'ts-jest',
      {
        useESM: true,
      },
    ],
  },
};

export default config;
