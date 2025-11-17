# Research: Menu Arrow Key Navigation Implementation

**Date**: 2025-11-15
**Feature**: 003-menu-arrow-navigation
**Purpose**: Resolve technical unknowns for implementing arrow key navigation in dropdown menus

---

## 1. Keyboard Navigation Patterns for React Menus

### Decision: Implement ARIA menu pattern with arrow key navigation

**Pattern**:
```jsx
const MenuComponent = () => {
  const [focusedIndex, setFocusedIndex] = useState(-1); // -1 means trigger has focus
  const [isOpen, setIsOpen] = useState(false);
  const menuItemRefs = useRef([]);

  const handleKeyDown = (event) => {
    if (!isOpen) return; // Only handle keys when menu is open

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        moveFocusDown();
        break;
      case 'ArrowUp':
        event.preventDefault();
        moveFocusUp();
        break;
      case 'Home':
        event.preventDefault();
        focusFirstItem();
        break;
      case 'End':
        event.preventDefault();
        focusLastItem();
        break;
      case 'Escape':
        event.preventDefault();
        closeMenuAndRestoreFocus();
        break;
      case 'Tab':
        // Allow default Tab behavior (menu stays open per clarification)
        break;
    }
  };

  const moveFocusDown = () => {
    const nextIndex = findNextEnabledIndex(focusedIndex, 1);
    setFocusedIndex(nextIndex);
    menuItemRefs.current[nextIndex]?.focus();
  };

  const findNextEnabledIndex = (currentIndex, direction) => {
    const items = menuItemRefs.current;
    let nextIndex = currentIndex + direction;

    // Wrap around if necessary
    if (nextIndex >= items.length) nextIndex = 0;
    if (nextIndex < 0) nextIndex = items.length - 1;

    // Skip disabled items
    while (items[nextIndex]?.hasAttribute('aria-disabled')) {
      nextIndex += direction;
      if (nextIndex >= items.length) nextIndex = 0;
      if (nextIndex < 0) nextIndex = items.length - 1;

      // Prevent infinite loop if all items disabled
      if (nextIndex === currentIndex) break;
    }

    return nextIndex;
  };
};
```

**Rationale**:
- **ARIA Authoring Practices Guide Menu Pattern**: Standard pattern for accessible menus
- **Focus index tracking**: Maintains which menu item currently has focus
- **Arrow keys only when menu open**: Prevents interference with other keyboard shortcuts
- **Programmatic focus management**: Uses refs to directly focus DOM elements

**Alternatives Considered**:
- **CSS-only focus management (rejected)**: Cannot skip disabled items or implement circular wrapping
- **Tab key navigation through menu items (rejected)**: Violates ARIA menu pattern; Tab should exit menu
- **Focus on first item when menu opens (rejected)**: Clarification confirmed focus stays on trigger

**References**:
- [ARIA Authoring Practices - Menu Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/menu/)
- [WCAG 2.1 - 2.1.1 Keyboard (Level A)](https://www.w3.org/WAI/WCAG21/Understanding/keyboard.html)

---

## 2. Focus Management State Tracking

### Decision: Use component state to track focused menu item index

**Pattern**:
```jsx
// For SubMenu (class component, existing pattern)
class SubMenu extends Component {
  constructor(props) {
    super(props);
    this.state = {
      active: false, // Menu open/closed state (existing)
      focusedIndex: -1, // -1 = trigger focused, 0+ = menu item index
    };
    this.menuItemRefs = [];
  }

  handleMenuKeyDown = (event) => {
    if (!this.state.active) return;

    switch (event.key) {
      case 'ArrowDown':
      case 'ArrowUp':
        event.preventDefault();
        // If trigger focused (-1), move to first enabled item
        if (this.state.focusedIndex === -1) {
          const firstEnabledIndex = this.findFirstEnabledItem();
          this.setState({ focusedIndex: firstEnabledIndex });
          this.menuItemRefs[firstEnabledIndex]?.focus();
        } else {
          // Navigate to next/previous item
          const direction = event.key === 'ArrowDown' ? 1 : -1;
          const nextIndex = this.findNextEnabledIndex(this.state.focusedIndex, direction);
          this.setState({ focusedIndex: nextIndex });
          this.menuItemRefs[nextIndex]?.focus();
        }
        break;
      case 'Escape':
        event.preventDefault();
        this.closeMenu();
        break;
    }
  };

  closeMenu = () => {
    this.setState({ active: false, focusedIndex: -1 });
    this.triggerRef?.focus(); // Restore focus to trigger
  };
}

// For DropdownCustomScaleMenu (functional component with hooks)
const DropdownCustomScaleMenu = (props) => {
  const [show, setShow] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const menuItemRefs = useRef([]);
  const triggerRef = useRef(null);

  const handleClose = () => {
    setShow(false);
    setFocusedIndex(-1);
    triggerRef.current?.focus();
  };
};
```

**Rationale**:
- **State tracks focus position**: Enables programmatic focus management
- **-1 for trigger focus**: Clear distinction between trigger and menu items
- **Refs for DOM access**: Direct focus() calls for reliable focus management
- **Focus restoration**: Return to trigger on Escape or menu close

**Clarifications Applied**:
- Focus stays on trigger when menu opens (index stays at -1)
- Arrow key from trigger moves to first enabled item
- Tab allows focus to exit menu while menu stays open
- Escape closes menu and returns focus to trigger

**Alternatives Considered**:
- **activeElement tracking (rejected)**: document.activeElement is unreliable across browsers
- **Focus trap (rejected)**: ARIA menu pattern allows Tab to exit
- **CSS :focus-within (rejected)**: Cannot track specific item index for navigation logic

**References**:
- [React Refs and the DOM](https://react.dev/learn/manipulating-the-dom-with-refs)
- [Managing Focus in React](https://react.dev/learn/managing-state#reacting-to-input-with-state)

---

## 3. Disabled Item Handling

### Decision: Check aria-disabled attribute and skip during navigation

**Pattern**:
```jsx
const isMenuItemDisabled = (element) => {
  return element?.hasAttribute('aria-disabled') &&
         element.getAttribute('aria-disabled') === 'true';
};

const findNextEnabledIndex = (currentIndex, direction) => {
  const items = menuItemRefs.current;
  const totalItems = items.length;
  let nextIndex = currentIndex;
  let attempts = 0;

  do {
    nextIndex = (nextIndex + direction + totalItems) % totalItems;
    attempts++;

    // Prevent infinite loop if all items disabled
    if (attempts > totalItems) {
      return currentIndex; // Stay on current item
    }
  } while (isMenuItemDisabled(items[nextIndex]));

  return nextIndex;
};

const findFirstEnabledItem = () => {
  const items = menuItemRefs.current;
  for (let i = 0; i < items.length; i++) {
    if (!isMenuItemDisabled(items[i])) {
      return i;
    }
  }
  return 0; // Fallback if all disabled (rare)
};
```

**Rationale**:
- **aria-disabled standard**: WCAG-compliant method for marking disabled items
- **Skip logic**: Ensures users never land on disabled items
- **Wrapping support**: Handles circular navigation with disabled items at boundaries
- **Edge case handling**: Prevents infinite loops if all items disabled

**Clarifications Applied**:
- Skip disabled items when entering menu from trigger (findFirstEnabledItem)
- Skip disabled items during all arrow key navigation
- Skip disabled items when wrapping (circular navigation)

**Alternatives Considered**:
- **CSS .disabled class (rejected)**: Not semantically accessible to screen readers
- **React props (rejected)**: Would require changing component APIs (violates YAGNI)
- **tabIndex=-1 for disabled (rejected)**: Would prevent manual focus, breaks accessibility

**References**:
- [ARIA: aria-disabled attribute](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-disabled)
- [Disabled buttons and accessibility](https://css-tricks.com/making-disabled-buttons-more-inclusive/)

---

## 4. Submenu/Overlay Interaction

### Decision: Submenu opens as Overlay component, inherits same keyboard navigation

**Pattern**:
```jsx
// DropdownCustomScaleMenu.js already uses Overlay
const DropdownCustomScaleMenu = (props) => {
  const [show, setShow] = useState(false);

  const handleKeyDown = (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      setShow(!show); // Toggle overlay
    }
  };

  return (
    <>
      <div
        className="label-wrapper"
        onClick={handleShow}
        onKeyDown={handleKeyDown}
        tabIndex={0}
        role="button"
        aria-label="Customize scale settings">
        Customize
      </div>

      {show && (
        <Overlay visible={false} key="custom_scale" close={handleShow}>
          {/* Overlay content - inherits keyboard navigation from container */}
          <CustomScaleSelector />
        </Overlay>
      )}
    </>
  );
};

// Escape key handling in Overlay component
const handleOverlayKeyDown = (event) => {
  if (event.key === 'Escape') {
    event.preventDefault();
    event.stopPropagation(); // Prevent parent menu from closing
    closeSubmenu(); // Close only this overlay
  }
};
```

**Rationale**:
- **Existing Overlay pattern**: CustomScale already uses Overlay component
- **Hierarchical Escape**: Escape closes innermost overlay first, then parent menu
- **Focus management**: Overlay handles its own focus trap (if needed)
- **No new abstractions**: Reuses existing component structure

**Clarifications Applied**:
- Enter/Space on menu item with submenu opens overlay window
- Escape closes most recent submenu and returns focus to parent menu item
- Submenus are windows/overlays (like CustomScale), not nested dropdowns

**Alternatives Considered**:
- **Nested dropdown menus (rejected)**: Not the existing pattern, would require refactoring
- **Right arrow to open submenu (rejected)**: Out of scope, only vertical menus
- **Modal dialogs (rejected)**: Overlay component already handles this

**References**:
- [ARIA Authoring Practices - Modal Dialog](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/)
- [Focus management in modals](https://www.w3.org/WAI/ARIA/apg/practices/keyboard-interface/#kbd_general_within)

---

## 5. Testing Keyboard Navigation

### Decision: Use React Testing Library + jest-axe for integration, Playwright for E2E

**Integration Test Pattern (Primary - 60-70%)**:
```javascript
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe, toHaveNoViolations } from 'jest-axe';

expect.extend(toHaveNoViolations);

describe('Menu Keyboard Navigation', () => {
  it('navigates menu items with arrow keys', async () => {
    const user = userEvent.setup();
    const { container } = render(<TopMenu />);

    // Open menu
    const trigger = screen.getByRole('button', { name: /notation/i });
    await user.click(trigger);

    // Arrow down from trigger moves to first menu item
    await user.keyboard('{ArrowDown}');
    const firstItem = screen.getByRole('menuitem', { name: /major/i });
    expect(firstItem).toHaveFocus();

    // Arrow down moves to next item
    await user.keyboard('{ArrowDown}');
    const secondItem = screen.getByRole('menuitem', { name: /minor/i });
    expect(secondItem).toHaveFocus();

    // Accessibility validation
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('skips disabled menu items during navigation', async () => {
    const user = userEvent.setup();
    render(<MenuWithDisabledItems />);

    await user.keyboard('{ArrowDown}'); // Skip disabled item
    const enabledItem = screen.getByRole('menuitem', { name: /enabled option/i });
    expect(enabledItem).toHaveFocus();
  });
});
```

**E2E Test Pattern (Secondary - 20-30%)**:
```javascript
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('complete keyboard-only menu navigation workflow', async ({ page }) => {
  await page.goto('/');

  // Tab to menu trigger
  await page.keyboard.press('Tab');
  const trigger = page.locator('role=button[name="Notation"]');
  await expect(trigger).toBeFocused();

  // Open menu with Enter
  await page.keyboard.press('Enter');

  // Navigate with arrow keys
  await page.keyboard.press('ArrowDown');
  const firstItem = page.locator('role=menuitem').first();
  await expect(firstItem).toBeFocused();

  // Select with Enter
  await page.keyboard.press('Enter');

  // Verify menu closed
  await expect(firstItem).not.toBeVisible();

  // Axe accessibility validation
  const accessibilityScanResults = await new AxeBuilder({ page }).analyze();
  expect(accessibilityScanResults.violations).toEqual([]);
});
```

**Unit Test Pattern (Minimal - 10-20%, edge cases only)**:
```javascript
describe('Navigation logic edge cases', () => {
  it('wraps from last to first item', () => {
    const items = ['item1', 'item2', 'item3'];
    const currentIndex = 2; // Last item
    const nextIndex = findNextEnabledIndex(currentIndex, 1, items);
    expect(nextIndex).toBe(0); // Wrapped to first
  });

  it('handles all items disabled gracefully', () => {
    const items = [
      { disabled: true },
      { disabled: true },
      { disabled: true }
    ];
    const nextIndex = findFirstEnabledItem(items);
    expect(nextIndex).toBe(0); // Returns first index as fallback
  });
});
```

**Rationale**:
- **Integration tests primary**: Test realistic user workflows (open → navigate → select)
- **E2E tests validate cross-browser**: Keyboard behavior can vary across browsers
- **Unit tests for algorithms**: Navigation logic (wrapping, skipping) has complex edge cases
- **jest-axe catches violations**: Automated accessibility auditing

**Clarifications Applied**:
- Test Tab behavior (menu stays open, focus exits)
- Test arrow keys from trigger (moves to first enabled item)
- Test Escape key (closes menu, restores focus)
- Test disabled item skipping throughout navigation

**Alternatives Considered**:
- **Heavy unit testing (rejected)**: Integration tests provide better ROI per constitution
- **Manual testing only (rejected)**: Doesn't scale, misses regressions
- **Enzyme (rejected)**: React Testing Library aligns better with integration-first approach

**References**:
- [React Testing Library - Keyboard Interactions](https://testing-library.com/docs/user-event/keyboard)
- [jest-axe Documentation](https://github.com/nickcolley/jest-axe)
- [Playwright Accessibility Testing](https://playwright.dev/docs/accessibility-testing)

---

## Summary of Decisions

| Area | Decision | Rationale |
|------|----------|-----------|
| **Navigation Pattern** | ARIA menu pattern with arrow keys | Standard, accessible, well-documented |
| **Focus Tracking** | Component state + refs | Reliable, programmatic focus control |
| **Disabled Items** | Check aria-disabled, skip in navigation | WCAG compliant, semantic |
| **Submenu Interaction** | Overlay component, hierarchical Escape | Existing pattern, no refactoring |
| **Testing Strategy** | Integration-first (RTL), E2E (Playwright), minimal unit | Aligns with constitution Principle I |

---

## Implementation Notes

1. **Existing Components**: DropdownCustomScaleMenu and SubMenu already have keyboard handlers from feature 002-fix-a11y-errors - extend these
2. **No New Dependencies**: All functionality achievable with React built-ins + existing test tools
3. **Incremental Enhancement**: Add arrow key navigation without breaking existing keyboard support
4. **Focus Indicators**: Browser defaults already meet WCAG AA (from previous feature), no custom CSS needed

---

## Next Steps

1. Proceed to Phase 1: Generate contracts defining exact behavior for each component
2. Create quickstart.md with manual and automated testing procedures
3. Update agent context with keyboard navigation patterns
4. Generate tasks.md with implementation sequence
