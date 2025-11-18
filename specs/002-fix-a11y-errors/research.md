# Research: Accessibility Implementation for React Components

**Date**: 2025-11-14
**Feature**: 002-fix-a11y-errors
**Purpose**: Resolve technical unknowns for implementing keyboard accessibility and ARIA attributes

---

## 1. Keyboard Event Patterns for React Components

### Decision: Use onKeyDown with Enter/Space key detection

**Pattern**:
```jsx
const handleKeyDown = (event) => {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault(); // Prevent space from scrolling page
    handleClick(); // Call same handler as onClick
  }
};

<div
  onClick={handleClick}
  onKeyDown={handleKeyDown}
  tabIndex={0}
  role="button"
>
  Content
</div>
```

**Rationale**:
- **Enter key**: Universal activation key for all interactive elements
- **Space key**: Expected for button-like elements per ARIA Authoring Practices Guide
- **Prevent default on Space**: Prevents page scroll when activating buttons
- **Call same handler**: Ensures identical behavior between mouse click and keyboard activation
- **WCAG 2.1.1 (Level A)**: Keyboard operable - all functionality available from keyboard

**Alternatives Considered**:
- **onKeyPress (rejected)**: Deprecated in React 18, inconsistent browser support
- **Only Enter key (rejected)**: Users expect Space for buttons, violates ARIA button pattern
- **Separate logic for keyboard (rejected)**: Creates maintenance burden and potential divergence

**Examples**:

```jsx
// ColorKey.js - Element with click and hover
const handleKeyDown = (event) => {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault();
    this.clickedMouse(event); // Reuse existing click handler
  }
};

<div
  onMouseDown={this.clickedMouse}
  onKeyDown={this.handleKeyDown}
  onFocus={this.onMouseOver}  // Reuse hover handler
  onBlur={this.onMouseOut}    // Reuse unhover handler
  tabIndex={0}
  role="button"
>
```

**References**:
- [ARIA Authoring Practices - Button Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/button/)
- [WCAG 2.1 - 2.1.1 Keyboard (Level A)](https://www.w3.org/WAI/WCAG21/Understanding/keyboard.html)
- [React SyntheticEvent - keyboard](https://react.dev/reference/react-dom/components/common#react-event-object)

### Decision: Use tabIndex={0} for custom interactive elements

**Pattern**:
```jsx
<div tabIndex={0} role="button" onClick={handleClick}>
  Custom Button
</div>
```

**Rationale**:
- **tabIndex={0}**: Places element in natural tab order (follows DOM order)
- **Avoid positive integers**: tabIndex="1", "2", etc. create confusing tab order
- **tabIndex={-1}**: Only for programmatic focus (not keyboard navigable)
- **Native elements preferred**: `<button>` already focusable, no tabIndex needed

**Tab Order Values**:
- **tabIndex="0"**: Natural tab order, element focusable (use for custom interactive elements)
- **tabIndex="-1"**: Programmatic focus only (use for skip links, focus management)
- **tabIndex="1+"**: Custom tab order (avoid - creates maintenance burden)
- **No tabIndex**: Native interactive elements (button, a, input) are automatically focusable

**Examples**:

```jsx
// PianoKey.js - Non-native button element
<div
  className="piano-key"
  tabIndex={0}          // Make focusable
  role="button"         // Announce as button
  onClick={playNote}
  onKeyDown={handleKeyDown}
>
  C
</div>

// DropdownCustomScaleMenu.js - Menu item
<div
  className="menu-item"
  tabIndex={0}          // Make focusable
  role="menuitem"       // Announce as menu item
  onClick={selectScale}
  onKeyDown={handleKeyDown}
>
  Major Scale
</div>
```

**References**:
- [MDN - tabindex](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/tabindex)
- [WebAIM - Keyboard Accessibility](https://webaim.org/techniques/keyboard/tabindex)

### Decision: Match focus handlers to hover handlers

**Pattern**:
```jsx
// ColorKey.js - Shows info on hover, must show on focus too
<div
  onMouseOver={this.onMouseOver}
  onMouseOut={this.onMouseOut}
  onFocus={this.onMouseOver}    // Same as onMouseOver
  onBlur={this.onMouseOut}      // Same as onMouseOut
  tabIndex={0}
>
  Content
</div>
```

**Rationale**:
- **WCAG 1.4.13 (Level AA)**: Content on hover must also appear on focus
- **Keyboard parity**: Keyboard users must access all information mouse users see
- **jsx-a11y rule**: `onMouseOver` must be accompanied by `onFocus`
- **Consistent UX**: Same visual feedback regardless of input method

**Alternatives Considered**:
- **Separate focus/hover logic (rejected)**: Maintenance burden, potential divergence
- **Remove hover effects (rejected)**: Degrades UX for all users
- **CSS :hover + :focus (considered)**: Good for purely visual effects, but JS handlers needed for state changes

**References**:
- [WCAG 1.4.13 - Content on Hover or Focus](https://www.w3.org/WAI/WCAG21/Understanding/content-on-hover-or-focus.html)
- [eslint-plugin-jsx-a11y - mouse-events-have-key-events](https://github.com/jsx-eslint/eslint-plugin-jsx-a11y/blob/main/docs/rules/mouse-events-have-key-events.md)

---

## 2. ARIA Roles and Attributes

### Decision: Use semantic ARIA roles for non-native interactive elements

**Role Mapping**:

| Component | Element Type | ARIA Role | Rationale |
|-----------|-------------|-----------|-----------|
| ColorKey.js | Clickable div | `role="button"` | Activates note selection |
| PianoKey.js | Clickable div | `role="button"` | Plays musical note |
| DropdownCustomScaleMenu.js | Menu item div | `role="menuitem"` | Selects scale option |
| ShareButton.js | Clickable div | `role="button"` | Triggers share action |
| SubMenu.js | Menu item div | `role="menuitem"` | Navigates submenu |
| VideoButton.js | Clickable div | `role="button"` | Opens video |

**Pattern**:
```jsx
// Button pattern
<div
  role="button"
  tabIndex={0}
  onClick={handleClick}
  onKeyDown={handleKeyDown}
  aria-label="Play middle C"  // If no visible text
>
  {visibleLabel || icon}
</div>

// Menu item pattern
<div
  role="menuitem"
  tabIndex={0}
  onClick={handleSelect}
  onKeyDown={handleKeyDown}
>
  Major Scale
</div>
```

**Rationale**:
- **role="button"**: Most common role for clickable non-native elements
- **role="menuitem"**: For items within dropdown/popup menus
- **jsx-a11y rule**: Non-interactive elements with click handlers must have role
- **Screen readers**: Announce element type and expected interaction

**Alternatives Considered**:
- **Refactor to native elements (ideal but out of scope)**: Would require CSS refactoring
- **role="link" (rejected)**: Links navigate, these elements perform actions
- **No role (rejected)**: Fails ESLint, confuses screen readers

**References**:
- [ARIA Roles - W3C](https://www.w3.org/TR/wai-aria-1.2/#role_definitions)
- [ARIA Authoring Practices - Patterns](https://www.w3.org/WAI/ARIA/apg/patterns/)
- [eslint-plugin-jsx-a11y - no-static-element-interactions](https://github.com/jsx-eslint/eslint-plugin-jsx-a11y/blob/main/docs/rules/no-static-element-interactions.md)

### Decision: Use aria-label only when visible text is insufficient

**Pattern**:
```jsx
// Visible text - no aria-label needed
<div role="button" tabIndex={0}>
  Play
</div>

// Icon only - aria-label required
<div role="button" tabIndex={0} aria-label="Play middle C">
  <PlayIcon />
</div>

// Visible text + context - aria-label for clarity
<div role="button" tabIndex={0} aria-label="Share on Twitter">
  Share
</div>
```

**Rationale**:
- **Prefer visible text**: Benefits all users, not just screen reader users
- **aria-label overrides**: Screen readers announce aria-label instead of visible text
- **Context matters**: Generic "Share" unclear, "Share on Twitter" specific
- **Avoid redundancy**: Don't use aria-label if visible text is already descriptive

**Examples**:

```jsx
// ColorKey.js - Note name visible, no aria-label needed
<div role="button" tabIndex={0}>
  C
</div>

// VideoButton.js - Icon only, needs aria-label
<div role="button" tabIndex={0} aria-label="Watch tutorial video">
  <VideoIcon />
</div>
```

**References**:
- [ARIA Labels and Descriptions](https://www.w3.org/WAI/ARIA/apg/practices/names-and-descriptions/)
- [WebAIM - Invisible Content](https://webaim.org/techniques/css/invisiblecontent/)

### Decision: Avoid ARIA state attributes for initial implementation

**Rationale**:
- **Scope limitation**: ARIA states (aria-pressed, aria-expanded) not required by current ESLint errors
- **Complexity**: State management (updating aria-pressed on click) adds implementation burden
- **YAGNI principle**: Only implement what's needed to pass build
- **Future enhancement**: Can add state attributes incrementally if user testing shows need

**Not implementing (yet)**:
- `aria-pressed="true/false"` for toggle buttons
- `aria-expanded="true/false"` for dropdown menus
- `aria-selected="true/false"` for selectable items

**References**:
- [ARIA States and Properties](https://www.w3.org/TR/wai-aria-1.2/#state_prop_def)

---

## 3. Focus Visibility Standards

### Decision: Rely on browser default focus indicators initially

**Pattern**:
```css
/* Let browser show default focus outline */
.color-key:focus,
.piano-key:focus,
.menu-item:focus {
  /* No custom styles initially - browser default is WCAG compliant */
}

/* Optional enhancement (future):
.color-key:focus {
  outline: 2px solid #4A90E2;
  outline-offset: 2px;
}
*/
```

**Rationale**:
- **Browser defaults are accessible**: Modern browsers provide WCAG-compliant focus indicators
- **Avoid outline:none**: Never remove focus indicators without replacement
- **WCAG 2.4.7 (Level AA)**: Focus must be visible - browser defaults meet this
- **YAGNI**: Custom focus styles not required by current spec, can add later

**WCAG Contrast Requirements (if implementing custom focus)**:
- **Contrast ratio**: 3:1 minimum against adjacent colors (WCAG 2.4.11 Level AA)
- **Visible thickness**: At least 2 CSS pixels recommended
- **Outline offset**: 2px separation from element helps visibility

**Alternatives Considered**:
- **Custom focus styles (future enhancement)**: Could match app theme, but adds complexity
- **:focus-visible (modern browsers)**: Shows focus only for keyboard, not mouse clicks
- **CSS-in-JS focus styles (rejected)**: Current components use CSS classes, stay consistent

**Examples**:

```jsx
// ColorKey.js - Browser default focus
<div
  className="color-key"
  tabIndex={0}
  role="button"
>
  {/* Browser shows outline on focus */}
</div>

// Future custom focus (if needed):
// .color-key:focus {
//   outline: 2px solid #4A90E2;
//   outline-offset: 2px;
//   box-shadow: 0 0 0 3px rgba(74, 144, 226, 0.3);
// }
```

**References**:
- [WCAG 2.4.7 - Focus Visible](https://www.w3.org/WAI/WCAG21/Understanding/focus-visible.html)
- [WCAG 2.4.11 - Focus Appearance (Level AA)](https://www.w3.org/WAI/WCAG22/Understanding/focus-appearance.html)
- [MDN - :focus-visible](https://developer.mozilla.org/en-US/docs/Web/CSS/:focus-visible)

### Decision: Preserve user's OS/browser focus preferences

**Rationale**:
- **Respect user settings**: Some users configure custom focus colors for accessibility
- **Avoid !important**: Don't override user stylesheets
- **System preferences**: macOS accessibility, Windows High Contrast mode
- **Best practice**: Augment, don't replace, browser defaults

**References**:
- [Respecting User Preferences](https://www.w3.org/WAI/perspective-videos/customizable/)

---

## 4. Testing Accessibility in React

### Decision: Use jest-axe for integration tests, @axe-core/playwright for E2E

**Integration Test Pattern (jest-axe)**:
```javascript
import { render } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';

expect.extend(toHaveNoViolations);

test('ColorKey has no accessibility violations', async () => {
  const { container } = render(<ColorKey note="C" />);
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});
```

**E2E Test Pattern (@axe-core/playwright)**:
```javascript
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('Piano keyboard is accessible', async ({ page }) => {
  await page.goto('/');
  const accessibilityScanResults = await new AxeBuilder({ page }).analyze();
  expect(accessibilityScanResults.violations).toEqual([]);
});
```

**Rationale**:
- **jest-axe**: Fast, runs in Jest, covers component-level accessibility
- **@axe-core/playwright**: Full page context, cross-browser, realistic environment
- **Automated + manual**: Automated tests catch ~57% of issues, manual testing still needed
- **Both already installed**: No new dependencies

**Testing Focus Order**:
```javascript
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

test('Tab order follows visual layout', async () => {
  const { getByRole } = render(<Menu />);
  const user = userEvent.setup();

  await user.tab();
  expect(getByRole('button', { name: 'File' })).toHaveFocus();

  await user.tab();
  expect(getByRole('button', { name: 'Edit' })).toHaveFocus();
});
```

**Testing Keyboard Activation**:
```javascript
import { render, fireEvent } from '@testing-library/react';

test('Enter key activates button', () => {
  const handleClick = jest.fn();
  const { getByRole } = render(
    <div role="button" tabIndex={0} onClick={handleClick}>
      Click me
    </div>
  );

  const button = getByRole('button');
  fireEvent.keyDown(button, { key: 'Enter' });
  expect(handleClick).toHaveBeenCalled();
});
```

**References**:
- [jest-axe Documentation](https://github.com/nickcolley/jest-axe)
- [Playwright Accessibility Testing](https://playwright.dev/docs/accessibility-testing)
- [Testing Library - Keyboard Events](https://testing-library.com/docs/user-event/keyboard)

---

## 5. ESLint jsx-a11y Rules

### ESLint Errors by Component

Based on Netlify build log analysis:

**ColorKey.js (Line 183)**:
- ❌ `jsx-a11y/mouse-events-have-key-events`: onMouseOver must be accompanied by onFocus
- ❌ `jsx-a11y/mouse-events-have-key-events`: onMouseOut must be accompanied by onBlur
- ❌ `jsx-a11y/no-static-element-interactions`: Non-interactive element with click handler needs role + keyboard listener

**Fix**:
```jsx
<div
  onMouseOver={this.onMouseOver}
  onMouseOut={this.onMouseOut}
  onFocus={this.onMouseOver}      // ✅ Add
  onBlur={this.onMouseOut}        // ✅ Add
  onKeyDown={this.handleKeyDown}  // ✅ Add
  tabIndex={0}                    // ✅ Add
  role="button"                   // ✅ Add
>
```

**PianoKey.js (Line 100)**:
- ❌ `jsx-a11y/no-static-element-interactions`: Non-interactive element with click handler needs role + keyboard listener

**Fix**:
```jsx
<div
  onClick={playNote}
  onKeyDown={this.handleKeyDown}  // ✅ Add
  tabIndex={0}                    // ✅ Add
  role="button"                   // ✅ Add
>
```

**DropdownCustomScaleMenu.js (Lines 22, 27)**:
- ❌ `jsx-a11y/click-events-have-key-events`: Click handler needs keyboard listener
- ❌ `jsx-a11y/no-static-element-interactions`: Non-interactive element needs role

**Fix**:
```jsx
<div
  onClick={selectScale}
  onKeyDown={handleKeyDown}  // ✅ Add
  tabIndex={0}               // ✅ Add
  role="menuitem"            // ✅ Add
>
```

**ShareButton.js (Line 56)**:
- ❌ `jsx-a11y/click-events-have-key-events`: Click handler needs keyboard listener
- ❌ `jsx-a11y/no-static-element-interactions`: Non-interactive element needs role

**Fix**:
```jsx
<div
  onClick={share}
  onKeyDown={handleKeyDown}  // ✅ Add
  tabIndex={0}               // ✅ Add
  role="button"              // ✅ Add
>
```

**SubMenu.js (Line 69)**:
- ❌ `jsx-a11y/click-events-have-key-events`: Click handler needs keyboard listener
- ❌ `jsx-a11y/no-static-element-interactions`: Non-interactive element needs role

**Fix**:
```jsx
<div
  onClick={openSubmenu}
  onKeyDown={handleKeyDown}  // ✅ Add
  tabIndex={0}               // ✅ Add
  role="menuitem"            // ✅ Add
>
```

**VideoButton.js (Line 35)**:
- ❌ `jsx-a11y/click-events-have-key-events`: Click handler needs keyboard listener
- ❌ `jsx-a11y/no-static-element-interactions`: Non-interactive element needs role

**Fix**:
```jsx
<div
  onClick={openVideo}
  onKeyDown={handleKeyDown}  // ✅ Add
  tabIndex={0}               // ✅ Add
  role="button"              // ✅ Add
>
```

### Verification Checklist

**Local Verification**:
1. Run `yarn build` - must complete without ESLint errors
2. Check browser console for runtime accessibility warnings
3. Use browser DevTools Accessibility Inspector to verify roles
4. Tab through interface manually to verify focus order
5. Run `npm test:a11y` to verify jest-axe tests pass

**CI/Netlify Verification**:
1. Push changes to PR branch
2. Netlify build must succeed (no ESLint errors)
3. GitHub Actions CI tests must pass

**Manual Testing**:
1. Keyboard-only navigation: Tab to each element, Enter/Space to activate
2. Screen reader testing: VoiceOver (Mac) or NVDA (Windows)
3. Visual focus indicators visible for all interactive elements

**References**:
- [eslint-plugin-jsx-a11y Rules](https://github.com/jsx-eslint/eslint-plugin-jsx-a11y#supported-rules)
- [ESLint jsx-a11y Strict Mode](https://github.com/jsx-eslint/eslint-plugin-jsx-a11y/blob/main/src/index.js#L53)

---

## Summary of Decisions

| Area | Decision | Rationale |
|------|----------|-----------|
| **Keyboard Events** | onKeyDown with Enter/Space, reuse onClick handlers | ARIA button pattern, WCAG 2.1.1 compliance |
| **Tab Order** | tabIndex={0} for custom elements | Natural tab order, avoid positive integers |
| **Focus Handlers** | Match onFocus/onBlur to onMouseOver/onMouseOut | WCAG 1.4.13, keyboard parity |
| **ARIA Roles** | role="button" for clickable divs, role="menuitem" for menu items | Screen reader compatibility, ESLint compliance |
| **ARIA Labels** | Use only for icons, prefer visible text | Benefits all users, avoid redundancy |
| **ARIA States** | Not implementing initially (out of scope) | YAGNI, can add incrementally |
| **Focus Indicators** | Browser defaults initially | WCAG compliant, simplicity |
| **Testing** | jest-axe (integration) + @axe-core/playwright (E2E) | Already installed, comprehensive coverage |
| **Verification** | yarn build + manual keyboard testing + screen reader | Multi-layer validation |

---

## Next Steps

1. Proceed to Phase 1: Generate contracts defining exact implementation for each component
2. Create quickstart.md with testing procedures
3. Update agent context with accessibility patterns
4. Use `/speckit.tasks` to generate actionable tasks
