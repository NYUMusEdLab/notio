# Feature Specification: Menu Arrow Key Navigation

**Feature Branch**: `003-menu-arrow-navigation`
**Created**: 2025-11-15
**Status**: Draft
**Input**: User description: "we need the menu items to be navigable with the arrow keys when opened. currently you can tab to a menu, open and close it but you can not get to the contents."

## Clarifications

### Session 2025-11-15

- Q: When a user presses Enter/Space on a closed menu trigger, should focus immediately move to the first menu item, or should it stay on the trigger until an arrow key is pressed? → A: Focus stays on menu trigger until user presses arrow key
- Q: When navigating from the menu trigger with arrow keys, should the system skip disabled items and move to the first enabled item, or move to the first item regardless of disabled state? → A: Skip to first enabled menu item when navigating from trigger
- Q: When a user presses Tab while a menu is open (whether on trigger or menu item), should the menu automatically close, or stay open while focus moves to the next element? → A: Menu stays open when Tab is pressed and focus moves to next element
- Q: When a user navigates to a menu item that has a submenu, what should happen when they activate it with Enter/Space? → A: Opens submenu with same navigation pattern (submenus open windows/overlays like CustomScale)
- Q: When wrapping from the last enabled item to the first item (or vice versa), should the system skip disabled items at the boundaries? → A: Skip disabled items when wrapping (wrap to first/last enabled item)

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Arrow Key Navigation Within Open Menus (Priority: P1)

Keyboard users need to navigate through menu items using arrow keys when a menu is open. Currently, users can Tab to reach a menu and activate it with Enter/Space to open/close it, but once open, there is no way to navigate to the menu items inside without using a mouse. This creates a significant accessibility barrier for keyboard-only users.

**Why this priority**: This is the core MVP functionality that unblocks keyboard-only users from accessing menu content. Without this, menus are effectively unusable for keyboard users, violating WCAG 2.1 Level A keyboard accessibility requirements.

**Independent Test**: Open any dropdown menu using keyboard (Tab to menu, press Enter), then use arrow keys to navigate through menu items. Each arrow key press should move focus to the next/previous menu item, and the focused item should be visually indicated.

**Acceptance Scenarios**:

1. **Given** a menu is closed, **When** user tabs to the menu trigger and presses Enter or Space, **Then** the menu opens and focus remains on the menu trigger
2. **Given** a menu is open with focus on the menu trigger, **When** user presses Down Arrow or Up Arrow, **Then** focus moves to the first menu item in the list
3. **Given** a menu is open with focus on a menu item, **When** user presses Down Arrow, **Then** focus moves to the next menu item in the list
4. **Given** a menu is open with focus on a menu item, **When** user presses Up Arrow, **Then** focus moves to the previous menu item in the list
5. **Given** a menu is open with focus on the last menu item, **When** user presses Down Arrow, **Then** focus wraps to the first menu item (circular navigation)
6. **Given** a menu is open with focus on the first menu item, **When** user presses Up Arrow, **Then** focus wraps to the last menu item (circular navigation)
7. **Given** a menu is open with focus on a menu item, **When** user presses Enter or Space, **Then** the menu item activates and the menu closes
8. **Given** a menu is open with focus on the menu trigger, **When** user presses Enter or Space, **Then** the menu toggles closed
9. **Given** a menu is open, **When** user presses Escape, **Then** the menu closes and focus returns to the menu trigger

---

### User Story 2 - Focus Management and Visual Feedback (Priority: P2)

When navigating menu items with arrow keys, keyboard users need clear visual indication of which item currently has focus, and focus must be properly managed when menus open and close.

**Why this priority**: Visual feedback is essential for users to understand their current position in the menu. This builds on P1 by ensuring the navigation is usable and understandable.

**Independent Test**: Open a menu and navigate with arrow keys while observing focus indicators. Each focused menu item should have a visible indicator (outline, background change, etc.) that clearly distinguishes it from unfocused items.

**Acceptance Scenarios**:

1. **Given** a menu is open with focus on a menu item, **When** the item receives focus, **Then** a visible focus indicator appears (browser default or custom styling)
2. **Given** a menu opens, **When** focus moves to the first menu item, **Then** the menu trigger loses focus and the first menu item gains focus
3. **Given** a menu closes after selecting an item, **When** the menu closes, **Then** focus returns to the menu trigger
4. **Given** a menu closes via Escape key, **When** the menu closes, **Then** focus returns to the menu trigger

---

### User Story 3 - Home/End Key Support for Quick Navigation (Priority: P3)

Power keyboard users expect to jump to the first or last menu item quickly using Home and End keys, following standard menu navigation patterns.

**Why this priority**: This is a usability enhancement that improves efficiency for power users. It's not strictly required for accessibility compliance but aligns with ARIA authoring practices for menu patterns.

**Independent Test**: Open a menu, press End key to jump to the last item, then press Home key to jump to the first item.

**Acceptance Scenarios**:

1. **Given** a menu is open with focus on any menu item, **When** user presses Home key, **Then** focus moves to the first menu item
2. **Given** a menu is open with focus on any menu item, **When** user presses End key, **Then** focus moves to the last menu item

---

### Edge Cases

- What happens when a menu has only one item? (Arrow keys should have no effect, or wrap to same item)
- How does navigation work with disabled menu items? (Should skip over disabled items or prevent selection)
- What happens if a menu item triggers a submenu? (Should submenu navigation follow same pattern)
- How does navigation work with menu dividers or non-interactive items? (Should skip over them)
- What happens when user presses arrow keys while menu is closed? (Should not interfere with other keyboard shortcuts)
- What happens when user presses Tab while menu is open? (Menu stays open, focus moves to next focusable element outside menu)
- What happens when user Tabs away from an open menu and then Tabs back? (Menu should still be open)

### Testing Strategy *(mandatory)*

**Integration Test Focus**:
- Menu opening → focus moves to first item → arrow key navigation → item selection workflow
- Arrow key navigation across multiple menu items with focus state verification
- Escape key closes menu and returns focus to trigger
- Tab key behavior when menu is open (focus exits menu to next element)
- Menu navigation interaction with submenu opening (if submenus exist)

**E2E Test Focus**:
- Complete keyboard-only menu navigation journey: Tab to menu → Open with Enter → Navigate with arrows → Select item with Enter
- Cross-browser arrow key navigation (Chrome, Firefox, Safari) to ensure consistent behavior
- Menu navigation with screen reader enabled (verify announcements match focus changes)

**Unit Test Focus** (edge cases only):
- Focus wrapping logic (first item → Up Arrow → last item, last item → Down Arrow → first item)
- Home/End key jump navigation edge cases
- Disabled menu item handling in navigation sequence
- Single-item menu navigation behavior

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST keep focus on the menu trigger when a menu opens via keyboard activation (Enter or Space on menu trigger)
- **FR-001b**: System MUST move focus to the first enabled (non-disabled) menu item when Down Arrow or Up Arrow is pressed while menu is open and focus is on the menu trigger
- **FR-002**: System MUST move focus to the next enabled menu item when Down Arrow key is pressed while a menu item has focus (skipping disabled items)
- **FR-003**: System MUST move focus to the previous enabled menu item when Up Arrow key is pressed while a menu item has focus (skipping disabled items)
- **FR-004**: System MUST wrap focus from the last enabled menu item to the first enabled menu item when Down Arrow is pressed on the last enabled item (circular navigation, skipping disabled items)
- **FR-005**: System MUST wrap focus from the first enabled menu item to the last enabled menu item when Up Arrow is pressed on the first enabled item (circular navigation, skipping disabled items)
- **FR-006**: System MUST activate the focused menu item and close the menu when Enter or Space is pressed
- **FR-007**: System MUST close the menu and return focus to the menu trigger when Escape key is pressed
- **FR-008**: System MUST move focus to the first menu item when Home key is pressed while menu is open
- **FR-009**: System MUST move focus to the last menu item when End key is pressed while menu is open
- **FR-010**: System MUST display a visible focus indicator on the currently focused menu item
- **FR-011**: System MUST return focus to the menu trigger when menu closes (via Escape, item selection, or other close mechanism)
- **FR-012**: System MUST allow Tab key to move focus to the next focusable element in the page tab order while keeping the menu open
- **FR-013**: System MUST skip over disabled or non-interactive items when navigating with arrow keys (both when entering menu from trigger and when navigating between items)
- **FR-014**: System MUST open submenu/overlay windows when Enter or Space is pressed on a menu item that has a submenu (e.g., CustomScale)
- **FR-015**: System MUST close the most recently opened submenu and return focus to the parent menu item when Escape is pressed in a submenu

### Key Entities

- **Menu Trigger**: The interactive element (button, link, or custom element) that opens/closes the associated menu when activated
- **Menu Container**: The container element that holds all menu items and controls visibility state (open/closed)
- **Menu Item**: An interactive element within the menu that can receive focus and be activated to perform an action
- **Focus State**: Tracks which menu item currently has keyboard focus for navigation and visual feedback

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of menu items are accessible via keyboard navigation without requiring mouse interaction
- **SC-002**: Arrow key navigation moves focus between menu items in under 50ms (imperceptible to users)
- **SC-003**: All menu navigation keyboard shortcuts align with ARIA Authoring Practices Guide menu pattern (Down/Up arrows, Home/End, Escape, Enter/Space)
- **SC-004**: Focus management maintains accessibility tree integrity verified by automated axe-core scans (zero violations)
- **SC-005**: Keyboard-only users can complete menu navigation and item selection in the same number of actions as mouse users (no efficiency penalty)
- **SC-006**: Visual focus indicators meet WCAG 2.1 Level AA contrast requirements (3:1 minimum against adjacent colors)

## Scope

### In Scope

- Arrow key navigation (Up/Down) for linear menu item traversal
- Home/End key support for jumping to first/last items
- Enter/Space activation of focused menu items
- Escape key to close menu and restore focus
- Tab key to exit menu
- Focus management when opening/closing menus
- Circular navigation (wrapping from last to first and vice versa)
- Visual focus indicators for keyboard navigation
- Skipping disabled/non-interactive menu items
- Integration with existing menu open/close logic
- Submenu/overlay opening via Enter/Space on menu items with submenus (e.g., CustomScale window)
- Escape key closes submenus and returns focus to parent menu item

### Out of Scope

- Horizontal menus (Left/Right arrow navigation) - only vertical dropdown menus addressed
- Menu search/typeahead (typing letters to jump to items starting with that letter)
- Left/Right arrow keys for submenu navigation (submenus open as windows/overlays, not nested dropdowns)
- Mouse hover behavior changes (existing hover interactions remain unchanged)
- Mobile touch navigation patterns
- Custom scrolling behavior for long menus
- Keyboard shortcuts to open specific menus directly (global shortcuts)

## Assumptions & Dependencies

### Assumptions

- Menus are implemented as vertical dropdown lists with sequential items
- Existing menu open/close functionality via keyboard (Tab + Enter/Space) is already working (per user description)
- Menu items are rendered in DOM in the order they should be navigated
- Disabled menu items have appropriate ARIA attributes (aria-disabled="true") or are not in tab order
- Standard browser focus management is available (element.focus() API)

### Dependencies

- Existing menu components must expose APIs to identify menu items programmatically
- Menu state management must support focus tracking (which item is currently focused)
- ARIA roles are correctly applied (role="menu", role="menuitem") for screen reader compatibility
- Build system must pass ESLint accessibility rules for keyboard event handlers
