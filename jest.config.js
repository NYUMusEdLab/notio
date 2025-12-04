// T008-T010: Jest configuration for constitutional testing compliance
// This extends react-scripts default configuration

module.exports = {
  // Inherit from react-scripts
  preset: 'react-scripts',

  // T008: Coverage thresholds - 100% mandatory (Constitution v2.0.0)
  // T005: Enhanced thresholds for URL storage completion feature
  coverageThreshold: {
    global: {
      branches: 100,
      functions: 100,
      lines: 100,
      statements: 100,
    },
    // Critical files for feature 005 must maintain 100% coverage
    './src/services/urlEncoder.js': {
      branches: 100,
      functions: 100,
      lines: 100,
      statements: 100,
    },
    './src/contexts/ModalPositionContext.js': {
      branches: 100,
      functions: 100,
      lines: 100,
      statements: 100,
    },
    './src/components/OverlayPlugins/Overlay.js': {
      branches: 100,
      functions: 100,
      lines: 100,
      statements: 100,
    },
    './src/WholeApp.js': {
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

  // T005: Test performance requirements (Constitution compliance)
  // Integration tests should complete < 5s, E2E tests < 30s
  testTimeout: 10000, // 10 second timeout for integration tests (buffer above 5s target)

  // Transform patterns (preserve existing for vexflow/gsap)
  transformIgnorePatterns: [
    'node_modules/(?!(vexflow|@tonejs/piano|gsap)/)',
  ],
};
