/**
 * Mock ModalPositionContext for Test Isolation
 *
 * This mock provides a Jest-compatible mock of ModalPositionContext
 * that can be used for test isolation without requiring the actual
 * context implementation.
 *
 * Usage:
 * 1. Automatic: Jest will auto-discover this mock when you import the real context
 * 2. Manual: jest.mock('../../contexts/ModalPositionContext')
 */

import React from 'react';

/**
 * Creates a mock context value with default structure
 * Can be customized by tests via mockContextValue parameter
 *
 * @param {Object} overrides - Properties to override in default value
 * @returns {Object} Mock context value
 */
export function createMockContextValue(overrides = {}) {
  return {
    positions: {
      video: { x: null, y: null },
      help: { x: null, y: null },
      share: { x: null, y: null },
      ...(overrides.positions || {})
    },
    updatePosition: jest.fn(),
    ...overrides
  };
}

/**
 * Mock ModalPositionContext
 *
 * Provides a Context object that behaves like the real ModalPositionContext
 * but with jest.fn() for updatePosition to enable assertion testing.
 */
export const ModalPositionContext = React.createContext(createMockContextValue());

/**
 * Mock ModalPositionProvider component
 *
 * A simplified provider that can be used in tests.
 * Allows passing custom value prop for different test scenarios.
 *
 * @param {Object} props - Provider props
 * @param {Object} props.value - Custom context value (merged with defaults)
 * @param {React.ReactNode} props.children - Child components
 */
export function ModalPositionProvider({ value = {}, children }) {
  const contextValue = {
    ...createMockContextValue(),
    ...value
  };

  return (
    <ModalPositionContext.Provider value={contextValue}>
      {children}
    </ModalPositionContext.Provider>
  );
}

/**
 * Mock useModalPosition hook
 *
 * For functional components that consume the context via hook.
 * Returns mock context value that can be customized in tests.
 */
export function useModalPosition() {
  return React.useContext(ModalPositionContext);
}

/**
 * Helper to create a spy on updatePosition
 * Useful when you need to track calls to updatePosition in tests
 *
 * @returns {jest.Mock} Spy function
 */
export function createUpdatePositionSpy() {
  return jest.fn();
}

/**
 * Default mock export
 * Jest will use this when you call jest.mock('../../contexts/ModalPositionContext')
 */
export default {
  ModalPositionContext,
  ModalPositionProvider,
  useModalPosition,
  createMockContextValue,
  createUpdatePositionSpy
};
