# notio Development Guidelines

Auto-generated from all feature plans. Last updated: 2025-11-13

## Active Technologies
- JavaScript ES6+, React 18.2.0 + React Testing Library (@testing-library/react ^13.0.0), Jest (^29.0.3), Playwright (@playwright/test) (001-constitution-compliance)
- Firebase (^9.9.4) for user data, localStorage for client-side state (001-constitution-compliance)
- JavaScript ES6+, React 18.2.0 + React event system, eslint-plugin-jsx-a11y (already configured) (002-fix-a11y-errors)
- N/A (no data model changes) (002-fix-a11y-errors)
- JavaScript ES6+, React 18.2.0 + React event system (onKeyDown), existing menu components (003-menu-arrow-navigation)
- N/A (no data persistence, pure UI interaction) (003-menu-arrow-navigation)

- JavaScript ES6+, React 18.2.0 (001-constitution-compliance)

## Project Structure

```text
backend/
frontend/
tests/
```

## Commands

npm test && npm run lint

## Code Style

JavaScript ES6+, React 18.2.0: Follow standard conventions

## Accessibility Patterns (002-fix-a11y-errors)

### ARIA Implementation
All interactive components must include:
- `role="button"` for keyboard-accessible elements
- `aria-label` with descriptive text (e.g., "Play C4", "Share", "Watch tutorial video")
- `tabIndex={0}` to include in natural tab order

Example:
```jsx
<div
  role="button"
  aria-label={`Play ${note}`}
  tabIndex={0}
  onKeyDown={handleKeyDown}>
  {/* content */}
</div>
```

### Keyboard Event Handling
Handle Enter and Space keys for button activation:
```jsx
handleKeyDown = (event) => {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault(); // Prevent Space from scrolling page
    // Trigger action
  }
};
```

### Focus Management
- Use browser default focus indicators (no custom outline removal)
- Ensure focus/hover parity (same information shown on both interactions)
- Maintain focus after activation (keyboard events should not move focus)

### Testing Strategy (Constitution v2.0.0)
- **60-70% Integration Tests**: Use React Testing Library with jest-axe for accessibility audits
- **20-30% E2E Tests**: Use Playwright with @axe-core/playwright for cross-browser validation
- **10-20% Unit Tests**: Edge cases in focus management and unusual scenarios

Example integration test:
```jsx
import { axe, toHaveNoViolations } from 'jest-axe';

const { container } = render(<Component />);
const results = await axe(container);
expect(results).toHaveNoViolations();
```

### Component Requirements
Icon-only buttons must have descriptive aria-labels:
- ShareButton: `aria-label="Share"`
- VideoButton: `aria-label="Watch tutorial video"`
- HelpButton: `aria-label="Help"`
- DropdownCustomScaleMenu: `aria-label="Customize scale settings"`

## Recent Changes
- 003-menu-arrow-navigation: Added JavaScript ES6+, React 18.2.0 + React event system (onKeyDown), existing menu components
- 002-fix-a11y-errors: Added JavaScript ES6+, React 18.2.0 + React event system, eslint-plugin-jsx-a11y (already configured)
- 001-constitution-compliance: Added JavaScript ES6+, React 18.2.0 + React Testing Library (@testing-library/react ^13.0.0), Jest (^29.0.3), Playwright (@playwright/test)


<!-- MANUAL ADDITIONS START -->
<!-- MANUAL ADDITIONS END -->
