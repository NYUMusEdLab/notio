# Feature Specification: URL Settings Storage - Testing and Code Quality Improvements

**Feature Branch**: `005-url-storage-completion`
**Created**: 2025-12-03
**Status**: Draft
**Input**: User description: "Complete URL settings storage feature with test coverage, refactoring, and state consolidation"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Comprehensive Test Coverage for Modal Positioning (Priority: P1)

The URL settings storage feature (004) currently has 0% test coverage for modal positioning functionality, violating the project constitution's mandatory 100% coverage requirement. Developers and maintainers need comprehensive test coverage to ensure modal positioning features work correctly, prevent regressions, and enable confident refactoring.

**Why this priority**: This is a constitutional violation and blocks production deployment. The constitution mandates 100% test coverage with specific distribution (60-70% integration, 20-30% E2E, 10-20% unit). Without tests, modal positioning bugs could break shared URLs and damage user trust.

**Independent Test**: Can be fully tested by running the test suite and verifying coverage reports show 100% line/branch coverage for modal positioning code. Delivers value by enabling confident deployment and future refactoring.

**Acceptance Scenarios**:

1. **Given** modal positioning code exists in urlEncoder.js, WholeApp.js, and Overlay.js, **When** integration tests run, **Then** all URL encoding/decoding logic for modal positions is tested with 100% coverage
2. **Given** modal position state synchronization exists, **When** integration tests run, **Then** state updates from drag events to URL parameters are verified
3. **Given** Overlay component handles position props, **When** integration tests run with React Testing Library, **Then** position rendering and drag callbacks are tested
4. **Given** modal positioning features exist, **When** end-to-end tests run, **Then** complete workflow (drag modal → URL updates → reload → position restored) is verified
5. **Given** modal components have accessibility features, **When** accessibility audits run with jest-axe, **Then** no accessibility violations are detected for positioned modals
6. **Given** all tests pass, **When** coverage report is generated, **Then** coverage meets constitutional requirements: 60-70% integration, 20-30% E2E, 10-20% unit, 100% total

---

### User Story 2 - Eliminate Props Drilling with Context API (Priority: P2)

The current implementation passes modal position props through 5 component layers (WholeApp → TopMenu → ModalButton → ModalContent → Overlay), creating maintenance burden and tight coupling. Developers need a cleaner architecture that eliminates prop forwarding through intermediate components and makes modal positioning state easily accessible where needed.

**Why this priority**: While not blocking deployment, this technical debt significantly impacts maintainability. Adding new modals or changing position logic requires changes across 5 files. Refactoring now prevents future maintenance costs and improves code quality.

**Independent Test**: Can be tested by verifying Overlay components access position state directly from context without receiving props from parent components. Delivers value by reducing code coupling and improving developer experience.

**Acceptance Scenarios**:

1. **Given** ModalPositionContext is created, **When** Overlay components mount, **Then** they can access modal positions directly from context without receiving position props
2. **Given** context provides position update functions, **When** modals are dragged, **Then** position updates propagate to context without callback props
3. **Given** context is implemented, **When** TopMenu, modal buttons, and modal content components are refactored, **Then** they no longer forward position props (eliminating 3 intermediate layers)
4. **Given** context-based implementation exists, **When** new modals are added, **Then** only 2 files need changes (context consumer + context provider) instead of 5 files
5. **Given** refactoring is complete, **When** existing tests run, **Then** all tests pass without modification (behavior unchanged)

---

### User Story 3 - Consolidate Position State Structure (Priority: P3)

The current implementation stores modal positions as 6 separate state fields (videoModalX, videoModalY, helpModalX, helpModalY, shareModalX, shareModalY), creating duplication and complexity. Developers need a consolidated state structure that groups related data logically and reduces handler duplication.

**Why this priority**: Code quality improvement that doesn't block deployment but improves long-term maintainability. Consolidation reduces handler code from 3 separate functions to 1 factory function and makes state structure more intuitive.

**Independent Test**: Can be tested by verifying state structure uses nested objects and position handlers use factory pattern. Delivers value by reducing code duplication and improving code clarity.

**Acceptance Scenarios**:

1. **Given** state structure is consolidated, **When** WholeApp state is inspected, **Then** positions are stored as nested object `modalPositions: { video: {x, y}, help: {x, y}, share: {x, y} }` instead of 6 flat fields
2. **Given** nested state structure exists, **When** urlEncoder encodes/decodes URLs, **Then** encoding logic correctly handles nested position objects
3. **Given** factory pattern is implemented, **When** position handlers are defined, **Then** single factory function `createPositionHandler(modalName)` replaces 3 duplicate handler functions
4. **Given** consolidated structure is complete, **When** new modal is added, **Then** adding position support requires 1 line in state initialization and 1 line for handler creation
5. **Given** refactoring is complete, **When** existing functionality is tested, **Then** URL encoding/decoding produces identical results to previous implementation (backwards compatible)

---

### Edge Cases

- When integration tests exercise position clamping logic, verify positions outside 0-10000 range are correctly constrained
- When E2E tests run on different screen sizes, verify modals remain visible after position restoration
- When accessibility audits run, verify positioned modals maintain focus management and keyboard navigation
- When context refactoring is applied, verify memo/optimization patterns prevent unnecessary re-renders
- When state consolidation changes encoding format, verify URLs remain backwards compatible with existing shared links
- When test coverage is measured, verify excluded code (if any) is explicitly marked and justified
- When tests run in CI environment, verify performance meets requirements (integration < 5s, E2E < 30s per test)

## Requirements *(mandatory)*

### Functional Requirements

#### Test Coverage Requirements (User Story 1)

- **FR-001**: Test suite MUST achieve 100% line and branch coverage for all modal positioning code (urlEncoder.js, WholeApp.js, Overlay.js position-related code)
- **FR-002**: Integration tests MUST comprise 60-70% of total test suite, covering URL encoding/decoding, state synchronization, and component integration
- **FR-003**: End-to-end tests MUST comprise 20-30% of total test suite, covering complete user workflows (drag → URL update → reload → position restore)
- **FR-004**: Unit tests MUST comprise 10-20% of total test suite, focusing on edge cases (position validation, clamping, invalid inputs)
- **FR-005**: Integration tests MUST use React Testing Library for component testing and verify DOM interactions match user expectations
- **FR-006**: Accessibility tests MUST use jest-axe to audit positioned modals and report zero violations
- **FR-007**: End-to-end tests MUST use Playwright to verify cross-browser compatibility (Chrome, Firefox, Safari) for modal positioning
- **FR-008**: Test coverage report MUST be generated automatically and included in build process to prevent coverage regressions
- **FR-009**: All existing tasks related to test coverage MUST be completed: T025-T027 (integration), T036-T038 (ShareLink), T045-T046 (browser history), T057 (E2E workflow)

#### Context API Refactoring Requirements (User Story 2)

- **FR-010**: ModalPositionContext MUST be created using React Context API to manage position state for all modals (video, help, share)
- **FR-011**: Context MUST provide both position state and update functions accessible to all modal components without prop drilling
- **FR-012**: Overlay component MUST consume position context directly, eliminating need for initialPosition and onPositionChange props
- **FR-013**: Intermediate components (TopMenu, modal buttons, modal content) MUST be refactored to remove position prop forwarding
- **FR-014**: Context provider MUST be placed at appropriate level in component tree to minimize re-renders (likely in WholeApp or dedicated provider wrapper)
- **FR-015**: Refactoring MUST maintain identical external behavior (all existing functionality continues to work without changes)
- **FR-016**: URL synchronization MUST continue to work after refactoring (context updates trigger same URL encoding as before)

#### State Consolidation Requirements (User Story 3)

- **FR-017**: WholeApp state structure MUST be refactored from 6 flat fields (videoModalX/Y, etc.) to nested object structure `modalPositions: { [modalName]: { x, y } }`
- **FR-018**: URL encoder encoding logic MUST be updated to work with nested position state structure
- **FR-019**: URL encoder decoding logic MUST be updated to populate nested position state structure
- **FR-020**: Position update handlers MUST be refactored to use factory function pattern, reducing duplication from 3 functions to 1 factory
- **FR-021**: Factory function MUST generate handlers dynamically for any modal name, enabling easy addition of new modals
- **FR-022**: URL parameter format MUST remain unchanged (backwards compatibility with existing shared URLs)
- **FR-023**: State initialization defaults MUST be centralized in single location to prevent multiple sources of truth

### Key Entities

- **Test Suite Structure**: Organized collection of integration, E2E, and unit tests with specific coverage targets per constitution
  - Integration Tests (60-70%): URL encoding/decoding, state sync, component interactions
  - E2E Tests (20-30%): Complete user workflows, cross-browser compatibility
  - Unit Tests (10-20%): Edge cases, validation logic, clamping functions
  - Coverage reports: Line coverage, branch coverage, distribution metrics

- **ModalPositionContext**: React Context for managing modal position state across component tree
  - Provides: position state for all modals (video, help, share)
  - Provides: update functions for changing positions
  - Eliminates: props drilling through intermediate components
  - Enables: direct access to position state where needed

- **Consolidated Position State**: Nested object structure for storing modal positions
  - Structure: `modalPositions: { video: {x, y}, help: {x, y}, share: {x, y} }`
  - Replaces: 6 separate flat state fields
  - Benefits: Logical grouping, easier to extend, reduces handler duplication

- **Position Handler Factory**: Function that generates position update handlers dynamically
  - Input: modal name (string)
  - Output: handler function for that modal's position updates
  - Reduces: code duplication from 3 handlers to 1 factory function
  - Simplifies: adding new modals (1 line instead of complete handler function)

## Success Criteria *(mandatory)*

### Measurable Outcomes

#### Test Coverage Success Criteria

- **SC-001**: Test suite achieves 100% line coverage and 100% branch coverage for all modal positioning code
- **SC-002**: Test coverage distribution meets constitutional requirements: 60-70% integration tests, 20-30% E2E tests, 10-20% unit tests
- **SC-003**: All integration tests complete in under 5 seconds per test (constitutional performance requirement)
- **SC-004**: All E2E tests complete in under 30 seconds per test (constitutional performance requirement)
- **SC-005**: Accessibility audits with jest-axe report zero violations for all positioned modal scenarios
- **SC-006**: E2E tests pass in all three target browsers (Chromium, Firefox, WebKit) without browser-specific failures
- **SC-007**: Coverage reports are automatically generated in CI pipeline and block merges if coverage drops below 100%
- **SC-008**: All 9 pending test tasks (T025-T027, T036-T038, T045-T046, T057) are completed and passing

#### Refactoring Success Criteria

- **SC-009**: Props drilling is eliminated - zero intermediate components forward position props after refactoring
- **SC-010**: Context implementation reduces coupling - adding new modal requires changes in only 2 files (context consumer + provider) instead of 5 files
- **SC-011**: State consolidation reduces code duplication - position handlers reduced from 3 separate functions to 1 factory function (67% reduction)
- **SC-012**: All existing functionality continues to work - 100% of existing tests pass without modification after refactoring
- **SC-013**: URL backwards compatibility maintained - URLs generated before and after refactoring are identical for same settings
- **SC-014**: No performance regressions - modal drag interactions remain at 60fps, URL updates remain debounced at 500ms

#### Code Quality Success Criteria

- **SC-015**: Code review passes - refactored code is approved as more maintainable and clearer than original
- **SC-016**: Developer experience improves - future contributors report easier understanding of modal positioning architecture
- **SC-017**: Technical debt reduced - props drilling anti-pattern eliminated, state structure simplified, handler duplication removed

## Assumptions

1. **Test Framework Availability**: Jest, React Testing Library, Playwright, jest-axe, and @axe-core/playwright are already configured and working in the project (verified from constitution and existing test setup)

2. **Context API Compatibility**: React version (18.2.0) supports Context API with hooks (useContext), and project can use functional components where needed for context consumption

3. **Backwards Compatibility Priority**: Existing shared URLs must continue to work after refactoring, so URL parameter format cannot change (consolidated state is internal only)

4. **Performance Targets**: Constitutional requirements for test performance (integration < 5s, E2E < 30s) are achievable with current hardware/CI infrastructure

5. **Test Isolation**: Tests can run in isolation without interfering with each other, and test data/state can be properly mocked/controlled

6. **Coverage Tool Accuracy**: Code coverage tools accurately measure line/branch coverage and can correctly identify tested vs untested code paths

7. **Refactoring Scope**: Refactoring changes are limited to internal implementation (state structure, prop passing) and do not affect public APIs or user-facing behavior

8. **Default Position Values**: Default modal positions (0, 0 or null) are acceptable starting points and don't need recalculation during refactoring

9. **Build Process Integration**: Test coverage reports can be integrated into existing build/CI process without major infrastructure changes

10. **No Breaking Changes**: All refactoring must maintain 100% backwards compatibility with existing functionality - no user-facing changes or breaking API changes

## Dependencies

- Existing URL settings storage implementation (feature 004) must be complete and functional
- Test infrastructure: Jest (^29.0.3), React Testing Library (@testing-library/react ^13.0.0), Playwright (@playwright/test), jest-axe
- React Context API support (React 18.2.0)
- Code coverage tools: Jest coverage reporter
- CI/CD pipeline for running tests and generating coverage reports
- Existing modal components: VideoButton, ShareButton, HelpButton, VideoTutorial, Share, InfoOverlay, Overlay
- Existing URL encoder service (src/services/urlEncoder.js)
- Existing state management in WholeApp.js

## Out of Scope

- Implementing new modal positioning features or functionality (only testing and refactoring existing features)
- Changing URL parameter format or encoding scheme (must maintain backwards compatibility)
- Converting entire codebase to Context API (only modal positioning uses context)
- Rewriting existing components from class to functional components (unless necessary for context consumption)
- Performance optimizations beyond maintaining current performance levels
- Adding visual indicators or UI for modal positions (purely internal implementation improvements)
- Documentation beyond code comments and JSDoc (no user-facing documentation updates needed)
- Migrating other state management to Context API (only modal positions in scope)
- Adding new testing tools or frameworks (use existing test infrastructure)
- Optimizing test execution time beyond constitutional requirements
- Cross-browser visual regression testing (functional tests only)
- Automated accessibility remediation (only auditing, not fixing non-positioning accessibility issues)
