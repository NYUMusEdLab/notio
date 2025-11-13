// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';

// T013: Import jest-axe and extend Jest matchers with toHaveNoViolations()
// This enables accessibility testing in all Jest tests
import { toHaveNoViolations } from 'jest-axe';

expect.extend(toHaveNoViolations);
