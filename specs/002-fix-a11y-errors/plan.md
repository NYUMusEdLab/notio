# Implementation Plan: Fix Accessibility Errors Blocking Production Build

**Branch**: `002-fix-a11y-errors` | **Date**: 2025-11-14 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/002-fix-a11y-errors/spec.md`

## Summary

Fix ESLint jsx-a11y violations preventing Netlify production build by adding keyboard event handlers (onKeyDown, onFocus, onBlur) and ARIA attributes to 6 interactive components (ColorKey, PianoKey, DropdownCustomScaleMenu, ShareButton, SubMenu, VideoButton). The solution maintains existing component structure and visual styling while ensuring full keyboard accessibility and screen reader compatibility to achieve WCAG 2.1 Level A compliance.

## Technical Context

**Language/Version**: JavaScript ES6+, React 18.2.0
**Primary Dependencies**: React event system, eslint-plugin-jsx-a11y (already configured)
**Storage**: N/A (no data model changes)
**Testing**: Jest (^29.0.3), React Testing Library (@testing-library/react ^13.0.0), Playwright (@playwright/test ^1.56.1), jest-axe (^10.0.0), @axe-core/playwright (^4.11.0)
**Target Platform**: Web browsers (Chrome, Firefox, Safari) via Create React App
**Project Type**: Web application (single-page React app)
**Performance Goals**: No performance regression - keyboard handlers execute in <10ms, build time remains under 2 minutes
**Constraints**: Must not alter existing visual styling, mouse interactions, or component APIs; ESLint strict mode must pass
**Scale/Scope**: 6 components affected, estimated 50-100 lines of code changes total

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### Testing Strategy Compliance (Principle I)
- [x] 100% code coverage target confirmed
- [x] Integration tests planned for 60-70% of test suite (primary strategy)
- [x] E2E tests planned for 20-30% of test suite (critical user journeys)
- [x] Unit tests planned for 10-20% (edge cases and complex algorithms only)
- [x] Test approach follows Rainer Hahnekamp's integration-first principles

**Plan**:
- Integration tests will verify keyboard navigation across component boundaries (Tab flow, focus management)
- E2E tests will validate complete keyboard-only workflows (navigate and play piano, access all menus)
- Unit tests will cover edge cases like rapid tabbing, conditional rendering affecting tab order
- jest-axe and @axe-core/playwright already available for automated accessibility validation

### Component Reusability (Principle II)
- [x] UI components designed for reusability
- [x] Single responsibility principle applied
- [x] Props interfaces clearly defined

**Status**: No changes to component interfaces or responsibilities. Accessibility fixes are additive (new event handlers) and do not affect reusability.

### Educational Pedagogy First (Principle III)
- [x] Target learner personas identified
- [x] Progressive disclosure of complexity considered
- [x] Immediate, pedagogically meaningful feedback designed

**Impact**: Keyboard accessibility directly serves students with motor disabilities and enables alternative interaction methods (switch controls, eye-tracking devices). Screen reader support helps visually impaired music students engage with the interface. No change to pedagogical flows.

### Performance & Responsiveness (Principle IV)
- [x] Audio latency targets met (< 50ms for interactive instruments)
- [x] Notation rendering targets met (< 200ms)
- [x] Performance validated on target educational devices

**Impact**: Keyboard event handlers add negligible overhead (<10ms). No changes to audio playback or rendering pipelines. Performance regression testing will verify no degradation.

### Integration-First Testing (Principle V)
- [x] Musical feature integration tests planned
- [x] Cross-component workflows covered
- [x] Audio-visual synchronization tested

**Plan**: Integration tests will cover keyboard interaction with piano keys triggering audio playback, ensuring audio-visual synchronization remains intact with new keyboard handlers.

### Accessibility & Inclusive Design (Principle VI)
- [x] Keyboard navigation fully functional
- [x] Color not sole information channel (we have colorblind themes for different kinds of colorblind, it is triggered using the numbers on the keyboard)
- [x] WCAG 2.1 AA standards met

**Primary Goal**: This feature directly implements Principle VI by fixing keyboard navigation gaps and adding ARIA roles for screen reader compatibility. Targets WCAG 2.1 Level A (minimum) with focus indicators meeting AA contrast requirements.

### Simplicity & Maintainability (Principle VII)
- [x] Simplest solution implemented (YAGNI principle)
- [x] Abstractions justified by actual need
- [x] Dependencies evaluated for necessity

**Approach**: Adding event handlers directly to existing components (no new abstractions). Using standard React synthetic events and ARIA attributes (no additional dependencies). Preserving existing structure minimizes complexity.

## Project Structure

### Documentation (this feature)

```text
specs/002-fix-a11y-errors/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output - keyboard event patterns, ARIA best practices
├── contracts/           # Phase 1 output - accessibility contracts for each component
└── quickstart.md        # Phase 1 output - how to test accessibility locally
```

### Source Code (repository root)

```text
src/
├── components/
│   ├── keyboard/
│   │   ├── ColorKey.js          # Add onFocus, onBlur, onKeyDown, tabIndex, role
│   │   └── PianoKey.js          # Add onKeyDown, tabIndex, role
│   └── menu/
│       ├── DropdownCustomScaleMenu.js  # Add onKeyDown, role
│       ├── ShareButton.js              # Add onKeyDown, tabIndex, role
│       ├── SubMenu.js                  # Add onKeyDown, tabIndex, role
│       └── VideoButton.js              # Add onKeyDown, tabIndex, role

src/__integration__/
├── accessibility/
│   ├── keyboard-navigation.test.js      # Integration: Tab flow, focus management
│   ├── keyboard-piano.test.js           # Integration: Keyboard piano interaction + audio
│   ├── keyboard-menus.test.js           # Integration: Menu navigation via keyboard
│   └── screen-reader.test.js            # Integration: ARIA announcements via jest-axe

src/__tests__/
└── unit/
    └── accessibility/
        ├── tab-order.test.js            # Unit: Dynamic tab order edge cases
        └── event-handlers.test.js       # Unit: Event handler execution order

e2e/
└── accessibility/
    ├── keyboard-workflow.spec.js        # E2E: Complete keyboard-only user journey
    └── cross-browser-a11y.spec.js       # E2E: Cross-browser keyboard + axe validation
```

**Structure Decision**: This is a web application with React components in `src/components/`. Tests follow the integration-first structure with `src/__integration__/` for integration tests (60-70%), `e2e/` for Playwright E2E tests (20-30%), and `src/__tests__/unit/` for edge case unit tests (10-20%). Accessibility tests use existing jest-axe and @axe-core/playwright tooling.

## Complexity Tracking

> **No violations** - All constitutional principles are met:
> - Simple, additive solution (event handlers + ARIA attributes)
> - No new dependencies or abstractions
> - Direct implementation of Principle VI (Accessibility)
> - Integration-first testing approach aligned with Principle I

---

## Phase 0: Research & Technical Discovery

**Status**: Starting research phase

### Research Tasks

1. **Keyboard Event Patterns for React Components**
   - Research: Best practices for onKeyDown handlers in React (Enter/Space activation)
   - Research: Tab order management with tabIndex (0 vs -1 vs positive integers)
   - Research: Focus management patterns (when to programmatically move focus)
   - Output: Recommended event handler patterns for each component type

2. **ARIA Roles and Attributes**
   - Research: Appropriate ARIA roles for non-native interactive elements (role="button", role="menu", role="menuitem")
   - Research: When to use aria-label vs aria-labelledby vs visible text
   - Research: ARIA state attributes (aria-pressed, aria-expanded, aria-haspopup)
   - Output: ARIA attribute mapping for each affected component

3. **Focus Visibility Standards**
   - Research: WCAG 2.1 contrast requirements for focus indicators
   - Research: CSS strategies for visible focus (outline, box-shadow, border)
   - Research: Respecting user's OS/browser focus preferences
   - Output: CSS focus indicator implementation guide

4. **Testing Accessibility in React**
   - Research: jest-axe usage patterns for unit/integration tests
   - Research: @axe-core/playwright for E2E accessibility validation
   - Research: React Testing Library keyboard simulation (fireEvent.keyDown, user.tab)
   - Research: Testing focus order and focus management
   - Output: Accessibility testing patterns and examples

5. **ESLint jsx-a11y Rules**
   - Research: Specific rules violated in each component
   - Research: Rule requirements and passing criteria
   - Research: How to verify ESLint compliance locally (yarn build)
   - Output: Rule-by-component mapping and validation checklist

### Deliverable: research.md

Document all findings with:
- **Decision**: Chosen pattern/approach
- **Rationale**: Why this approach was selected
- **Alternatives considered**: What else was evaluated and why rejected
- **Examples**: Code snippets demonstrating the pattern
- **References**: WCAG guidelines, React docs, ARIA authoring practices

---

## Phase 1: Design Artifacts

**Status**: Pending (after research.md complete)

### Design Outputs

1. **contracts/keyboard-event-contract.md**
   - Define standard keyboard event handler interface
   - Specify Enter/Space key activation behavior
   - Document Tab order expectations
   - Include code examples for each component type

2. **contracts/aria-attributes-contract.md**
   - Map ARIA roles to each affected component
   - Specify required vs optional ARIA attributes
   - Define ARIA state management (when to update aria-pressed, etc.)
   - Include accessibility tree expectations

3. **contracts/focus-management-contract.md**
   - Define focus indicator visual requirements
   - Specify when to use tabIndex={0} vs native focusability
   - Document focus trap requirements for modal/dropdown patterns
   - Include CSS requirements for :focus styles

4. **quickstart.md**
   - How to test keyboard navigation locally
   - How to use screen reader to verify ARIA (VoiceOver on Mac, NVDA on Windows)
   - How to run yarn build and verify ESLint passes
   - How to run accessibility tests (npm test:a11y, npm test:e2e with axe)
   - How to validate with browser DevTools accessibility inspector

### Agent Context Update

Run `.specify/scripts/bash/update-agent-context.sh claude` to add:
- Testing tools: jest-axe, @axe-core/playwright (already in devDependencies)
- React accessibility patterns: keyboard events, ARIA attributes
- WCAG 2.1 Level A keyboard requirements

---

## Phase 2: Task Generation

**Status**: Not started (use `/speckit.tasks` command after Phase 1)

Tasks will be generated in `tasks.md` covering:
- **Phase 1**: Implement keyboard handlers for each component
- **Phase 2**: Add ARIA roles and attributes
- **Phase 3**: Implement focus indicators
- **Phase 4**: Write integration tests
- **Phase 5**: Write E2E tests
- **Phase 6**: Write unit tests for edge cases
- **Phase 7**: Verify ESLint compliance and build success

---

## Next Steps

1. Execute Phase 0 research to resolve all technical unknowns
2. Generate Phase 1 design artifacts (contracts, quickstart)
3. Update agent context with accessibility patterns
4. Use `/speckit.tasks` to generate actionable implementation tasks
