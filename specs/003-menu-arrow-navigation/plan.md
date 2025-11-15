# Implementation Plan: Menu Arrow Key Navigation

**Branch**: `003-menu-arrow-navigation` | **Date**: 2025-11-15 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/003-menu-arrow-navigation/spec.md`

## Summary

Add arrow key navigation to dropdown menus to enable keyboard-only users to navigate menu items. Currently, users can Tab to a menu trigger and press Enter/Space to toggle the menu open/closed, but cannot navigate to menu items within an open menu without a mouse. This feature implements Up/Down arrow key navigation with circular wrapping, Home/End key support, proper focus management, disabled item skipping, and submenu/overlay support (e.g., CustomScale). The solution preserves existing menu structure and styling while adding keyboard event handlers and ARIA compliance to meet WCAG 2.1 Level A accessibility requirements.

## Technical Context

**Language/Version**: JavaScript ES6+, React 18.2.0
**Primary Dependencies**: React event system (onKeyDown), existing menu components
**Storage**: N/A (no data persistence, pure UI interaction)
**Testing**: Jest (^29.0.3), React Testing Library (@testing-library/react ^13.0.0), Playwright (@playwright/test), jest-axe (^10.0.0), @axe-core/playwright (^4.11.0)
**Target Platform**: Web browsers (Chrome, Firefox, Safari) via Create React App
**Project Type**: Web application (single-page React app)
**Performance Goals**: Arrow key navigation responds in <50ms (imperceptible to users), no impact on existing menu performance
**Constraints**: Must not alter existing visual styling or mouse interactions; ESLint strict mode must pass (jsx-a11y rules); must integrate with existing menu state management
**Scale/Scope**: 3-5 menu components affected (DropdownCustomScaleMenu, SubMenu, and related menu structures), estimated 200-300 lines of code

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### Testing Strategy Compliance (Principle I)
- [x] 100% code coverage target confirmed
- [x] Integration tests planned for 60-70% of test suite (primary strategy)
- [x] E2E tests planned for 20-30% of test suite (critical user journeys)
- [x] Unit tests planned for 10-20% (edge cases and complex algorithms only)
- [x] Test approach follows Rainer Hahnekamp's integration-first principles

**Plan**:
- Integration tests will verify arrow key navigation workflows across menu boundaries
- E2E tests will validate complete keyboard-only navigation journeys (Tab to menu → Open → Navigate → Select)
- Unit tests will cover edge cases like wrapping logic, disabled item skipping, single-item menus
- jest-axe and @axe-core/playwright already available for automated accessibility validation

### Component Reusability (Principle II)
- [x] UI components designed for reusability
- [x] Single responsibility principle applied
- [x] Props interfaces clearly defined

**Status**: No changes to component interfaces or responsibilities. Menu components maintain existing APIs. Arrow key navigation logic will be added as internal methods within existing menu components, not extracted as separate components (YAGNI - no reuse need identified).

### Educational Pedagogy First (Principle III)
- [x] Target learner personas identified
- [x] Progressive disclosure of complexity considered
- [x] Immediate, pedagogically meaningful feedback designed

**Impact**: Keyboard accessibility serves students with motor disabilities and enables alternative input methods (switch controls, eye-tracking devices). Arrow key navigation provides immediate visual feedback (focus indicators) as users navigate menus. No change to pedagogical flows - this is accessibility infrastructure.

### Performance & Responsiveness (Principle IV)
- [x] Audio latency targets met (< 50ms for interactive instruments)
- [x] Notation rendering targets met (< 200ms)
- [x] Performance validated on target educational devices

**Impact**: Keyboard event handlers add negligible overhead (<10ms). No changes to audio playback or notation rendering. Performance regression testing will verify no degradation to existing menu interactions.

### Integration-First Testing (Principle V)
- [x] Musical feature integration tests planned
- [x] Cross-component workflows covered
- [x] Audio-visual synchronization tested

**Plan**: Integration tests will cover keyboard navigation across menu structures, simulating realistic user workflows (open menu → navigate → select item). E2E tests will validate complete keyboard-only menu interaction journeys across browsers.

### Accessibility & Inclusive Design (Principle VI)
- [x] Keyboard navigation fully functional
- [x] Color not sole information channel
- [x] WCAG 2.1 AA standards met

**Primary Goal**: This feature directly implements Principle VI by adding full keyboard navigation to menus. Targets WCAG 2.1 Level A compliance (keyboard operable). Focus indicators will meet AA contrast requirements (3:1 minimum).

### Simplicity & Maintainability (Principle VII)
- [x] Simplest solution implemented (YAGNI principle)
- [x] Abstractions justified by actual need
- [x] Dependencies evaluated for necessity

**Approach**: Adding keyboard event handlers directly to existing menu components (no new abstractions). Using standard React synthetic events and DOM focus management (no additional dependencies). Preserving existing component structure minimizes complexity.

## Project Structure

### Documentation (this feature)

```text
specs/003-menu-arrow-navigation/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output - keyboard navigation patterns, ARIA best practices
├── contracts/           # Phase 1 output - keyboard navigation contracts for menu components
└── quickstart.md        # Phase 1 output - how to test keyboard navigation locally
```

### Source Code (repository root)

```text
src/
├── components/
│   └── menu/
│       ├── DropdownCustomScaleMenu.js  # Add arrow key handlers, focus management
│       ├── SubMenu.js                  # Add arrow key handlers, focus management
│       └── [other menu components]     # TBD based on research phase
│
src/__integration__/
├── accessibility/
│   ├── menu-keyboard-navigation.test.js     # Integration: Arrow key navigation workflow
│   ├── menu-focus-management.test.js        # Integration: Focus state verification
│   └── menu-disabled-items.test.js          # Integration: Disabled item skipping
│
src/__tests__/
└── unit/
    └── accessibility/
        ├── menu-wrapping.test.js             # Unit: Circular navigation edge cases
        └── menu-navigation-logic.test.js     # Unit: Navigation algorithm edge cases
│
e2e/
└── accessibility/
    ├── menu-keyboard-workflow.spec.js        # E2E: Complete keyboard-only menu journey
    └── cross-browser-menu-a11y.spec.js       # E2E: Cross-browser keyboard + axe validation
```

**Structure Decision**: This is a web application with React components in `src/components/`. Tests follow the integration-first structure with `src/__integration__/` for integration tests (60-70%), `e2e/` for Playwright E2E tests (20-30%), and `src/__tests__/unit/` for edge case unit tests (10-20%). Menu keyboard navigation will be added to existing menu components without creating new files.

## Complexity Tracking

> **No violations** - All constitutional principles are met:
> - Simple, additive solution (event handlers added to existing components)
> - No new dependencies or abstractions
> - Direct implementation of Principle VI (Accessibility)
> - Integration-first testing approach aligned with Principle I

---

## Phase 0: Research & Technical Discovery

**Status**: Starting research phase

### Research Tasks

1. **Keyboard Navigation Patterns for React Menus**
   - Research: ARIA Authoring Practices Guide menu pattern requirements
   - Research: Focus management strategies (when to move focus programmatically)
   - Research: Arrow key event handling (Up/Down, Home/End) in React
   - Research: How to identify and skip disabled menu items during navigation
   - Output: Recommended keyboard event handler patterns

2. **Focus Management State Tracking**
   - Research: How to track currently focused menu item index in component state
   - Research: Focus restoration patterns when menu closes
   - Research: Focus behavior when menu opens (clarification: stays on trigger until arrow key)
   - Research: Tab key behavior with open menus (clarification: menu stays open, focus exits)
   - Output: State management approach for menu focus tracking

3. **Disabled Item Handling**
   - Research: How to identify disabled menu items programmatically
   - Research: Skip logic for arrow key navigation (avoid landing on disabled items)
   - Research: Wrapping behavior with disabled items at boundaries
   - Output: Disabled item detection and skipping algorithm

4. **Submenu/Overlay Interaction**
   - Research: How CustomScale and similar overlay windows are triggered
   - Research: Focus management when submenu opens
   - Research: Escape key handling for nested submenu closing
   - Output: Submenu keyboard interaction patterns

5. **Testing Keyboard Navigation**
   - Research: React Testing Library keyboard simulation (fireEvent.keyDown, userEvent.keyboard)
   - Research: Testing focus state changes and focus indicators
   - Research: Playwright keyboard navigation testing patterns
   - Research: jest-axe usage for validating keyboard accessibility
   - Output: Keyboard navigation testing patterns and examples

### Deliverable: research.md

Document all findings with:
- **Decision**: Chosen pattern/approach
- **Rationale**: Why this approach was selected
- **Alternatives considered**: What else was evaluated and why rejected
- **Examples**: Code snippets demonstrating the pattern
- **References**: ARIA authoring practices, React docs, accessibility standards

---

## Phase 1: Design Artifacts

**Status**: Pending (after research.md complete)

### Design Outputs

1. **contracts/keyboard-navigation-contract.md**
   - Define keyboard event handler interface for menu components
   - Specify arrow key (Up/Down/Home/End) behavior
   - Document focus tracking state requirements
   - Include navigation algorithm (find next/previous enabled item)
   - Define wrapping logic (circular navigation with disabled item skipping)

2. **contracts/focus-management-contract.md**
   - Specify focus state tracking (which menu item index has focus)
   - Define focus restoration when menu closes (return to trigger)
   - Document focus behavior when menu opens (stays on trigger per clarification)
   - Specify Tab key behavior (focus exits, menu stays open per clarification)

3. **contracts/disabled-item-contract.md**
   - Define how to identify disabled menu items (aria-disabled, CSS class, React props)
   - Specify skip logic for navigation (all arrow keys skip disabled items)
   - Document edge case handling (all items disabled, only one enabled item)

4. **contracts/submenu-contract.md**
   - Define submenu activation via Enter/Space on parent menu item
   - Specify focus behavior when submenu/overlay opens
   - Document Escape key hierarchy (close most recent submenu first, then parent menu)

5. **quickstart.md**
   - How to test keyboard navigation manually (Tab to menu, arrow keys, Enter/Space, Escape)
   - How to run jest tests with jest-axe accessibility validation
   - How to run Playwright E2E tests for keyboard navigation
   - How to use browser DevTools to inspect focus state and ARIA attributes

### Agent Context Update

Run `.specify/scripts/bash/update-agent-context.sh claude` to add:
- React keyboard event handling patterns (onKeyDown, event.key values)
- ARIA menu pattern requirements (role="menu", role="menuitem", aria-disabled)
- Focus management strategies for dropdown menus
- Testing tools: jest-axe, @axe-core/playwright, React Testing Library keyboard utilities

---

## Phase 2: Task Generation

**Status**: Not started (use `/speckit.tasks` command after Phase 1)

Tasks will be generated in `tasks.md` covering:
- **Phase 1**: Write integration tests for arrow key navigation workflows
- **Phase 2**: Write E2E tests for complete keyboard-only menu journeys
- **Phase 3**: Write unit tests for navigation edge cases (wrapping, disabled items)
- **Phase 4**: Implement keyboard event handlers in menu components
- **Phase 5**: Implement focus state tracking and management
- **Phase 6**: Implement disabled item skipping logic
- **Phase 7**: Verify ESLint compliance and accessibility validation

---

## Next Steps

1. Execute Phase 0 research to identify existing menu component structure
2. Generate Phase 1 design artifacts (contracts, quickstart)
3. Update agent context with keyboard navigation patterns
4. Use `/speckit.tasks` to generate actionable implementation tasks
