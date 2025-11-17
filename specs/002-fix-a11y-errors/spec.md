# Feature Specification: Fix Accessibility Errors Blocking Production Build

**Feature Branch**: `002-fix-a11y-errors`
**Created**: 2025-11-14
**Status**: Draft
**Input**: User description: "fix a11y errors detected by netlify - ESLint jsx-a11y violations preventing production build"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Keyboard Navigation for Interactive Elements (Priority: P1)

Users navigating the application with keyboard (Tab, Enter, Space keys) can access and activate all interactive elements including piano keys, color keys, menu items, and buttons without requiring a mouse.

**Why this priority**: This is the foundation of accessibility compliance and affects the broadest range of users. Without keyboard navigation, the application is completely unusable for users who cannot use a mouse, violating WCAG 2.1 Level A requirements. This directly blocks the production build.

**Independent Test**: Can be fully tested by navigating the entire application using only keyboard (Tab to focus, Enter/Space to activate) and verifies that users with motor disabilities can use core application features.

**Acceptance Scenarios**:

1. **Given** a user on the keyboard interface, **When** they press Tab repeatedly, **Then** all piano keys and color keys receive visible focus in a logical order
2. **Given** a piano key or color key has keyboard focus, **When** the user presses Enter or Space, **Then** the same action occurs as if they had clicked with a mouse
3. **Given** a user on any menu component, **When** they navigate using Tab and activate with Enter, **Then** all menu options are accessible and functional
4. **Given** a user hovering over an element that shows additional information, **When** they use keyboard to focus that element, **Then** the same information appears as with mouse hover

---

### User Story 2 - Screen Reader Compatibility (Priority: P2)

Users relying on screen readers (JAWS, NVDA, VoiceOver) receive clear announcements about what each interactive element is and how to use it when navigating the application.

**Why this priority**: Screen reader users need semantic information to understand the purpose and state of controls. Without proper ARIA roles and attributes, the application announces elements incorrectly or not at all, making it impossible for blind users to understand the interface structure.

**Independent Test**: Can be tested by enabling a screen reader and navigating through the application - verifies that all interactive elements are announced with their correct role (button, menu, key, etc.) and current state.

**Acceptance Scenarios**:

1. **Given** a screen reader is active, **When** a user focuses on a clickable element previously using a div or span, **Then** the screen reader announces it with the correct role (e.g., "button") not "clickable"
2. **Given** a screen reader user navigates the keyboard interface, **When** they move focus between piano keys, **Then** each key is announced with its note name and any relevant state
3. **Given** a menu item with nested options, **When** screen reader user focuses it, **Then** the element's expanded/collapsed state is announced correctly

---

### User Story 3 - Focus Visibility and Management (Priority: P3)

Users navigating with keyboard can always see which element currently has focus through clear visual indicators, preventing them from getting lost during navigation.

**Why this priority**: While keyboard navigation (P1) makes interaction possible, focus visibility ensures users can track their position. This improves usability for all keyboard users and partially-sighted users who need clear visual cues.

**Independent Test**: Can be tested by tabbing through the application and visually confirming that focused elements always have a visible focus indicator (outline, border, or background change).

**Acceptance Scenarios**:

1. **Given** a user tabbing through the interface, **When** any interactive element receives focus, **Then** a visible focus indicator (outline or highlight) appears around that element
2. **Given** an element with both onMouseOver and onFocus handlers, **When** a user focuses it with keyboard, **Then** the same visual feedback appears as with mouse hover
3. **Given** a user activates a dropdown menu, **When** the menu opens, **Then** focus moves to the first menu item automatically

---

### Edge Cases

- What happens when a user rapidly tabs through many elements - does focus remain stable and visible?
- How does the system handle elements that are conditionally rendered - do they maintain proper tab order?
- What happens when an element that has focus is removed from the DOM?
- How do nested interactive elements (e.g., a button inside a clickable div) behave with keyboard navigation?
- What happens if a user has custom focus styles from browser extensions or OS settings?

### Testing Strategy *(mandatory)*

**Integration Test Focus**:
- User navigates from keyboard to menu to buttons using Tab → all elements receive focus → activation works correctly
- User interacts with ColorKey component via keyboard → onFocus/onBlur handlers fire → hover state appears → keyboard activation triggers same behavior as click
- Screen reader announces interactive elements → correct roles and states are communicated → navigation is logical

**E2E Test Focus**:
- Complete keyboard-only workflow: User opens application → navigates to piano keyboard → plays notes using keyboard → accesses all menu functions → completes a musical task
- Cross-browser keyboard navigation: Test Tab, Enter, Space key behaviors in Chrome, Firefox, Safari to ensure consistent experience

**Unit Test Focus** (edge cases only):
- Tab order calculation when elements are dynamically added or removed from DOM
- Focus trap behavior in modal dialogs or dropdown menus
- Event handler execution order when both mouse and keyboard events fire simultaneously

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: All interactive elements that respond to mouse clicks MUST also respond to keyboard activation (Enter or Space key)
- **FR-002**: All interactive elements MUST be keyboard focusable (native HTML elements like button/a, or tabIndex={0} for custom elements)
- **FR-003**: All elements with onMouseOver MUST have corresponding onFocus handler with identical behavior
- **FR-004**: All elements with onMouseOut MUST have corresponding onBlur handler with identical behavior
- **FR-005**: All non-native interactive elements (divs/spans used as buttons) MUST have appropriate ARIA role attribute (role="button", role="menuitem", etc.)
- **FR-006**: All interactive elements MUST have visible focus indicators that meet WCAG 2.1 contrast requirements
- **FR-007**: Tab order MUST follow a logical sequence matching visual layout (left-to-right, top-to-bottom)
- **FR-008**: Production build MUST pass all ESLint jsx-a11y rules without errors
- **FR-009**: Components MUST maintain existing visual styling and mouse interaction behavior (no regression)

### Affected Components

The following components require accessibility fixes:

- **ColorKey.js**: Interactive color selection element lacking onFocus/onBlur handlers and proper ARIA role
- **PianoKey.js**: Piano key element using non-native interactive elements without proper keyboard support
- **DropdownCustomScaleMenu.js**: Menu items missing keyboard listeners and ARIA attributes
- **ShareButton.js**: Button element using non-native HTML without keyboard handlers
- **SubMenu.js**: Submenu navigation lacking keyboard accessibility
- **VideoButton.js**: Video control button missing keyboard interaction support

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Production build completes successfully without ESLint accessibility errors (currently fails with 6+ violations)
- **SC-002**: 100% of interactive elements can be reached and activated using only keyboard navigation (Tab, Enter, Space)
- **SC-003**: All hover effects appear identically when using keyboard focus, ensuring feature parity between mouse and keyboard users
- **SC-004**: Application achieves WCAG 2.1 Level A compliance for keyboard accessibility (verifiable via automated testing tools like axe or Pa11y)
- **SC-005**: Netlify deployment succeeds and application is available in production environment
- **SC-006**: Zero regression in existing mouse-based interactions - all existing click, hover, and visual behaviors remain unchanged
- **SC-007**: Local build command (yarn build) completes successfully without warnings or errors

## Scope & Constraints

### In Scope

- Adding keyboard event handlers (onKeyDown, onFocus, onBlur) to match existing mouse handlers
- Adding appropriate ARIA roles and attributes to non-native interactive elements
- Ensuring all interactive elements are keyboard focusable (tabIndex where needed)
- Maintaining visual parity between mouse hover and keyboard focus states
- Fixing ESLint jsx-a11y violations in the 6 identified components

### Out of Scope

- Complete redesign of components to use native HTML elements (can be done incrementally post-fix if desired)
- Adding new accessibility features beyond keyboard navigation and ARIA basics
- Comprehensive WCAG 2.1 AA or AAA compliance (only addressing current blockers for Level A)
- Accessibility testing automation infrastructure (covered separately)
- Mobile touch accessibility improvements
- Internationalization of ARIA labels

### Assumptions

- The existing component structure and styling should be preserved where possible to minimize risk
- Visual focus indicators already exist in the CSS or can be enabled via browser defaults
- The application framework (React) supports onFocus, onBlur, and onKeyDown event handlers
- Users expect standard keyboard conventions (Tab for focus navigation, Enter/Space for activation)
- The current ESLint configuration with jsx-a11y rules represents the minimum accessibility standard for this project

### Dependencies

- ESLint with eslint-plugin-jsx-a11y plugin (already configured)
- React 18.2.0 event handling system
- Netlify build pipeline accepting successful local yarn build
