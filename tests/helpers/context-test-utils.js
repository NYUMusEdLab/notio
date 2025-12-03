/**
 * Context Test Utilities
 *
 * Helper functions for testing React Context providers and consumers:
 * - renderWithModalContext wrapper
 * - Mock context values
 * - Context assertions
 */

import React from 'react';
import { render } from '@testing-library/react';

/**
 * Renders a component wrapped in ModalPositionContext.Provider
 * with customizable context value for testing
 *
 * @param {React.Element} component - Component to render
 * @param {Object} contextValue - Custom context value (merged with defaults)
 * @returns {Object} React Testing Library render result
 *
 * @example
 * const { getByText } = renderWithModalContext(
 *   <MyComponent />,
 *   { positions: { video: { x: 100, y: 150 } } }
 * );
 */
export function renderWithModalContext(component, contextValue = {}) {
  // Import context dynamically to avoid circular dependencies
  const { ModalPositionContext } = require('../../src/contexts/ModalPositionContext');

  const defaultValue = {
    positions: {
      video: { x: null, y: null },
      help: { x: null, y: null },
      share: { x: null, y: null }
    },
    updatePosition: jest.fn(),
    ...contextValue
  };

  return render(
    <ModalPositionContext.Provider value={defaultValue}>
      {component}
    </ModalPositionContext.Provider>
  );
}

/**
 * Creates a mock context value with default structure
 *
 * @param {Object} overrides - Properties to override in default value
 * @returns {Object} Mock context value
 */
export function createMockContextValue(overrides = {}) {
  return {
    positions: {
      video: { x: null, y: null },
      help: { x: null, y: null },
      share: { x: null, y: null }
    },
    updatePosition: jest.fn(),
    ...overrides
  };
}

/**
 * Creates a mock context with specific modal positions
 *
 * @param {Object} modalPositions - Positions for each modal
 * @returns {Object} Mock context value with positions
 *
 * @example
 * const context = createMockPositions({
 *   video: { x: 100, y: 150 },
 *   help: { x: 200, y: 250 }
 * });
 */
export function createMockPositions(modalPositions) {
  return createMockContextValue({
    positions: {
      video: modalPositions.video || { x: null, y: null },
      help: modalPositions.help || { x: null, y: null },
      share: modalPositions.share || { x: null, y: null }
    }
  });
}

/**
 * Asserts that updatePosition was called with correct arguments
 *
 * @param {jest.Mock} mockUpdate - The mock updatePosition function
 * @param {string} modalName - Expected modal name ('video', 'help', 'share')
 * @param {Object} position - Expected position {x, y}
 */
export function assertUpdatePosition(mockUpdate, modalName, position) {
  expect(mockUpdate).toHaveBeenCalledWith(modalName, position);
}

/**
 * Verifies context value has correct structure
 *
 * @param {Object} contextValue - Context value to validate
 * @returns {boolean} True if structure is valid
 */
export function isValidContextValue(contextValue) {
  if (!contextValue || typeof contextValue !== 'object') {
    return false;
  }

  // Check positions object
  if (!contextValue.positions || typeof contextValue.positions !== 'object') {
    return false;
  }

  // Check all three modals exist
  const requiredModals = ['video', 'help', 'share'];
  for (const modal of requiredModals) {
    const pos = contextValue.positions[modal];
    if (!pos || typeof pos !== 'object') {
      return false;
    }
    if (pos.x !== null && typeof pos.x !== 'number') {
      return false;
    }
    if (pos.y !== null && typeof pos.y !== 'number') {
      return false;
    }
  }

  // Check updatePosition function
  if (typeof contextValue.updatePosition !== 'function') {
    return false;
  }

  return true;
}

/**
 * Creates a test component that consumes context
 * Useful for testing context provider behavior
 *
 * @param {Function} children - Render function receiving context value
 * @returns {React.Component} Test consumer component
 *
 * @example
 * const TestConsumer = createContextConsumer(
 *   ({ positions }) => <div>{positions.video.x}</div>
 * );
 */
export function createContextConsumer(children) {
  const { ModalPositionContext } = require('../../src/contexts/ModalPositionContext');

  return function TestConsumer() {
    const context = React.useContext(ModalPositionContext);
    return children(context);
  };
}
