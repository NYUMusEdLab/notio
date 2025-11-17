// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';

// T013: Import jest-axe and extend Jest matchers with toHaveNoViolations()
// This enables accessibility testing in all Jest tests
import { toHaveNoViolations } from 'jest-axe';

expect.extend(toHaveNoViolations);

// Create required DOM elements for React portals
beforeEach(() => {
  // Create plugin_root for Overlay component portals
  const pluginRoot = document.createElement('div');
  pluginRoot.setAttribute('id', 'plugin_root');
  document.body.appendChild(pluginRoot);
});

afterEach(() => {
  // Clean up plugin_root after each test
  const pluginRoot = document.getElementById('plugin_root');
  if (pluginRoot) {
    document.body.removeChild(pluginRoot);
  }
});
