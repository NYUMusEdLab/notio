<!--
SYNC IMPACT REPORT
==================
Version Change: 1.0.0 (initial template) → 2.0.0 (fully populated)
Bump Type: MAJOR - Initial population of template with concrete governance principles

Modified Principles:
- [PRINCIPLE_1_NAME] → I. Integration-First Testing
- [PRINCIPLE_2_NAME] → II. Component Reusability
- [PRINCIPLE_3_NAME] → III. Accessibility & Inclusive Design
- [PRINCIPLE_4_NAME] → IV. Performance & Responsiveness
- [PRINCIPLE_5_NAME] → V. Simplicity & Maintainability

Added Sections:
- Technology Stack (Section 2)
- Development Workflow (Section 3)
- Governance rules with amendment procedure

Removed Sections: None (template placeholders replaced)

Templates Status:
- .specify/templates/plan-template.md ✅ Compatible (Constitution Check section exists)
- .specify/templates/spec-template.md ✅ Compatible (Testing Strategy section aligns)
- .specify/templates/tasks-template.md ✅ Compatible (User story organization aligns)

Follow-up TODOs: None
-->

# Notio Project Constitution

## Core Principles

### I. Integration-First Testing

Testing MUST follow the integration-first pyramid with mandatory coverage ratios:

- **Integration Tests (60-70%)**: PRIMARY focus. Test component interactions, data flow, and user workflows using React Testing Library with jest-axe for accessibility audits
- **E2E Tests (20-30%)**: SECONDARY focus. Validate complete user journeys across browsers (Chrome, Firefox, Safari) using Playwright with @axe-core/playwright
- **Unit Tests (10-20%)**: MINIMAL scope. Reserved for edge cases, complex algorithms, and boundary conditions only

**Non-Negotiable Rules**:
- All PRs MUST maintain 100% code coverage threshold
- Integration tests MUST complete in under 5 seconds per test
- E2E tests MUST complete in under 30 seconds per test
- Tests MUST be written BEFORE implementation (red-green-refactor cycle)
- CI/CD pipeline MUST fail automatically when coverage drops below threshold

**Rationale**: Integration tests provide the highest confidence-to-maintenance ratio for a React application. Unit tests in isolation often miss the integration bugs that affect users.

### II. Component Reusability

All React components MUST follow single responsibility and clear interface principles:

- Components MUST have a single, well-defined purpose
- Props MUST be clearly documented (PropTypes or TypeScript interfaces)
- Shared/reusable components MUST be organized in `src/components/common/`
- Complex components MUST be composed from smaller, testable units
- Components MUST be testable in isolation with proper dependency mocking

**Rationale**: Reusable components reduce duplication, improve consistency, and make the codebase easier to test and maintain.

### III. Accessibility & Inclusive Design

All interactive UI elements MUST be accessible to users with diverse abilities:

- All interactive elements MUST support full keyboard navigation (Enter + Space activation)
- All interactive elements MUST include proper ARIA attributes (`role`, `aria-label`, `tabIndex={0}`)
- Color MUST NOT be the sole channel for conveying information
- All UI elements MUST meet WCAG 2.1 AA contrast standards (4.5:1 normal text, 3:1 large text)
- Text alternatives MUST exist for all visual musical content
- Audio feedback MUST complement (not replace) visual feedback
- Browser default focus indicators MUST be preserved (no `outline: none`)

**Testing Requirement**: Use jest-axe for integration tests and @axe-core/playwright for E2E accessibility validation.

**Rationale**: Music education should be accessible to all learners regardless of ability. Accessibility is not optional.

### IV. Performance & Responsiveness

Musical interactions MUST feel immediate and timing MUST be accurate:

- Audio latency MUST be under 50ms for interactive instruments
- Notation rendering MUST complete in under 200ms for typical exercises
- UI animations MUST maintain 60fps where applicable
- Visual notation MUST synchronize accurately with audio playback
- Performance MUST be validated on target educational devices (not just developer machines)

**Rationale**: Musical education requires precise timing. Latency destroys the learning experience for rhythm and real-time feedback.

### V. Simplicity & Maintainability

Code MUST be as simple as possible while meeting requirements:

- Prefer editing existing code over creating new files
- Avoid over-engineering and premature abstractions
- Do not add features, refactoring, or "improvements" beyond what was requested
- Only add error handling for scenarios that can actually occur
- Three similar lines of code is better than a premature abstraction
- Delete unused code completely (no backwards-compatibility hacks)

**Rationale**: Complexity is the enemy of maintainability. Every abstraction has a cost.

## Technology Stack

**Core Framework**: JavaScript ES6+, React 18.2.0
**Testing**: Jest (^29.0.3), React Testing Library (^13.0.0), Playwright, jest-axe, @axe-core/playwright
**Backend/Storage**: Firebase (^9.9.4) for user data, localStorage for client-side state
**Audio**: Tone.js (^14.7.77), @tonejs/piano, soundfont-player
**Notation**: VexFlow (^4.0.3)
**Linting**: ESLint with eslint-plugin-jsx-a11y (strict mode)

## Development Workflow

### Code Review Requirements

All PRs and code reviews MUST verify:
1. Test coverage meets 100% threshold with proper ratio distribution
2. Accessibility compliance (keyboard navigation, ARIA, contrast)
3. Performance targets are met (latency, render times)
4. Component interfaces are clear and documented
5. No unnecessary complexity introduced

### Test Execution

```bash
# Integration and unit tests
yarn test                    # Watch mode for development
yarn test --coverage         # Generate coverage report
yarn test:a11y               # Accessibility-focused tests

# E2E tests
yarn test:e2e                # All browsers
yarn test:e2e:chromium       # Chrome only
yarn test:e2e:firefox        # Firefox only
yarn test:e2e:webkit         # Safari only
```

## Governance

This constitution supersedes all other development practices for the Notio project.

### Amendment Procedure

1. Proposed amendments MUST be documented with rationale
2. Amendments MUST include migration plan for existing code
3. Version MUST be incremented according to semantic versioning:
   - **MAJOR**: Principle removal, redefinition, or backward-incompatible governance change
   - **MINOR**: New principle added or materially expanded guidance
   - **PATCH**: Clarifications, wording fixes, non-semantic refinements
4. All dependent templates MUST be reviewed for consistency after amendments

### Compliance Review

- All PRs MUST pass automated coverage and linting checks
- Complexity additions MUST be explicitly justified in PR description
- Accessibility violations MUST block merge
- Performance regressions MUST be investigated before merge

**Version**: 2.0.0 | **Ratified**: 2025-11-13 | **Last Amended**: 2026-01-14
