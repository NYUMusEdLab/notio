module.exports = {
  // Use react-scripts preset as base
  ...require('react-scripts/config/jest/jest.config'),

  // T008: Coverage thresholds - 100% mandatory (Constitution v2.0.0)
  coverageThreshold: {
    global: {
      branches: 100,
      functions: 100,
      lines: 100,
      statements: 100,
    },
  },

  // T009: Include integration test patterns
  testMatch: [
    '<rootDir>/src/**/__tests__/**/*.{js,jsx,ts,tsx}',
    '<rootDir>/src/**/*.{spec,test}.{js,jsx,ts,tsx}',
    '<rootDir>/src/**/__integration__/**/*.{spec,test}.{js,jsx,ts,tsx}',
  ],

  // T010: Coverage collection patterns
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/**/*.d.ts',
    '!src/index.js',
    '!src/serviceWorker.js',
    '!src/setupTests.js',
    '!src/**/__test__/**',
    '!src/**/__tests__/**',
    '!src/**/__integration__/**',
    '!src/**/__mocks__/**',
  ],

  // Coverage reporters
  coverageReporters: ['html', 'text', 'lcov', 'json'],

  // Transform patterns (preserve existing)
  transformIgnorePatterns: [
    'node_modules/(?!(vexflow|@tonejs/piano|gsap)/)',
  ],
};
