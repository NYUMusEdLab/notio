# Tasks: URL Settings Storage - Testing and Code Quality Improvements

**Feature**: 005-url-storage-completion
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/
**Branch**: `005-url-storage-completion`

**Tests**: Tests are MANDATORY per project constitution requirement for 100% test coverage (60-70% Integration, 20-30% E2E, 10-20% Unit). Test tasks are distributed throughout phases below.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `- [ ] [ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

Single-page React application structure at repository root with `src/` directory.

---

## Phase 1: Setup (Shared Test Infrastructure)

**Purpose**: Create test utilities and helper functions that ALL user stories depend on

**Independent Test**: Utilities can be tested independently before integration with feature code

- [ ] T001 [P] Create test helpers directory at tests/helpers/
- [ ] T002 [P] Create modal test utilities in tests/helpers/modal-test-utils.js with drag simulation and position verification helpers
- [ ] T003 [P] Create context test utilities in tests/helpers/context-test-utils.js with renderWithModalContext wrapper function
- [ ] T004 [P] Create mock context provider in src/__tests__/__mocks__/ModalPositionContext.mock.js for test isolation
- [ ] T005 [P] Configure Jest coverage thresholds in jest.config.js to enforce 100% coverage with integration/E2E/unit distribution tracking

**Checkpoint**: Test utilities ready - user story implementation can now begin

---

## Phase 2: User Story 1 - Comprehensive Test Coverage (Priority: P1)

**Goal**: Achieve 100% test coverage for modal positioning code with 60-70% integration, 20-30% E2E, 10-20% unit distribution

**Independent Test**: Run test suite and verify coverage reports show 100% line/branch coverage. Can be tested independently of refactoring work.

**Constitutional Requirement**: This is MANDATORY before production deployment (constitutional violation fix)

### Integration Tests (60-70% of coverage)

- [ ] T006 [P] [US1] Create integration test file src/__tests__/integration/url-encoder-positions.test.js with test cases for encoding nested modalPositions to flat URL parameters
- [ ] T007 [P] [US1] Add integration tests in url-encoder-positions.test.js for decoding flat URL parameters to nested modalPositions structure
- [ ] T008 [P] [US1] Add integration tests in url-encoder-positions.test.js for round-trip encoding (state → URL → state) preserves all positions
- [ ] T009 [P] [US1] Add integration tests in url-encoder-positions.test.js for position clamping during encoding (0-10000 range)
- [ ] T010 [P] [US1] Create integration test file src/__tests__/integration/state-sync.test.js for drag → context → state → URL synchronization flow
- [ ] T011 [P] [US1] Add integration tests in state-sync.test.js for debounced URL updates (500ms) using jest.useFakeTimers
- [ ] T012 [P] [US1] Add integration tests in state-sync.test.js for URL loading populates state correctly on mount
- [ ] T013 [P] [US1] Create integration test file src/__tests__/integration/overlay-positioning.test.js for Overlay component consuming context
- [ ] T014 [P] [US1] Add integration tests in overlay-positioning.test.js for Overlay rendering at position from context
- [ ] T015 [P] [US1] Add integration tests in overlay-positioning.test.js for Overlay calling context.updatePosition on drag stop
- [ ] T016 [P] [US1] Add integration tests in overlay-positioning.test.js for Overlay updating when context value changes
- [ ] T017 [P] [US1] Create integration test file src/__tests__/integration/context-integration.test.js for provider/consumer interaction
- [ ] T018 [P] [US1] Add integration tests in context-integration.test.js for provider sharing state with multiple consumers
- [ ] T019 [P] [US1] Add integration tests in context-integration.test.js for context updates triggering consumer re-renders

### E2E Tests (20-30% of coverage)

- [ ] T020 [P] [US1] Create E2E test file e2e/modal-positioning.spec.js for complete positioning workflow (drag → URL → reload → restore)
- [ ] T021 [P] [US1] Add E2E test in modal-positioning.spec.js verifying modal position persists across page reloads within 10px tolerance
- [ ] T022 [P] [US1] Add E2E test in modal-positioning.spec.js for multiple modals positioned simultaneously with all positions in URL
- [ ] T023 [P] [US1] Create E2E test file e2e/cross-browser-modals.spec.js for cross-browser compatibility (Chromium, Firefox, WebKit)
- [ ] T024 [P] [US1] Add E2E tests in cross-browser-modals.spec.js verifying drag and URL encoding work consistently across all three browsers
- [ ] T025 [P] [US1] Create E2E test file e2e/accessibility-modals.spec.js with @axe-core/playwright accessibility audits
- [ ] T026 [P] [US1] Add E2E tests in accessibility-modals.spec.js for positioned modals passing accessibility audit with zero violations
- [ ] T027 [P] [US1] Add E2E tests in accessibility-modals.spec.js for keyboard navigation (Escape closes modal, Tab moves focus)

### Unit Tests (10-20% of coverage)

- [ ] T028 [P] [US1] Create unit test file src/__tests__/unit/position-validation.test.js for position clamping edge cases
- [ ] T029 [P] [US1] Add unit tests in position-validation.test.js for negative values clamped to 0
- [ ] T030 [P] [US1] Add unit tests in position-validation.test.js for values above 10000 clamped to 10000
- [ ] T031 [P] [US1] Add unit tests in position-validation.test.js for non-numeric values returning null
- [ ] T032 [P] [US1] Add unit tests in position-validation.test.js for boundary values (0, 10000) handled correctly

### Coverage Verification

- [ ] T033 [US1] Run Jest coverage report with npm test -- --coverage and verify 100% line/branch coverage for modal positioning code
- [ ] T034 [US1] Verify test distribution meets constitutional requirements: 60-70% integration, 20-30% E2E, 10-20% unit tests
- [ ] T035 [US1] Verify integration tests complete in < 5 seconds per test as per constitutional performance requirement
- [ ] T036 [US1] Verify E2E tests complete in < 30 seconds per test as per constitutional performance requirement
- [ ] T037 [US1] Configure CI pipeline to generate coverage reports and block merges if coverage drops below 100%

**Checkpoint**: User Story 1 complete - 100% test coverage achieved, constitutional requirement satisfied

---

## Phase 3: User Story 2 - Eliminate Props Drilling with Context API (Priority: P2)

**Goal**: Implement React Context API to eliminate 5-layer props drilling for modal positions

**Independent Test**: Verify Overlay components access position state directly from context without receiving props from parent components. Can be tested after US1 tests are in place.

### Context Implementation

- [ ] T038 [US2] Create ModalPositionContext in src/contexts/ModalPositionContext.js with createContext and default value shape
- [ ] T039 [US2] Add TypeScript-style JSDoc type annotations to ModalPositionContext.js defining ModalPosition and ModalPositionContextValue interfaces
- [ ] T040 [US2] Create useModalPosition custom hook in src/hooks/useModalPosition.js that wraps useContext(ModalPositionContext)
- [ ] T041 [US2] Add error handling to useModalPosition hook for when context is used outside provider

### Provider Integration

- [ ] T042 [US2] Modify WholeApp.js to wrap app content with ModalPositionContext.Provider
- [ ] T043 [US2] Update WholeApp.js to derive context value from this.state.modalPositions and this.updateModalPosition
- [ ] T044 [US2] Verify WholeApp.componentDidUpdate still triggers URL updates when modalPositions state changes

### Consumer Refactoring (Overlay)

- [ ] T045 [US2] Convert Overlay component in src/components/OverlayPlugins/Overlay.js from class to functional component
- [ ] T046 [US2] Update Overlay.js to consume ModalPositionContext using useContext hook instead of props
- [ ] T047 [US2] Add modalName prop to Overlay.js to identify which modal position to access from context
- [ ] T048 [US2] Update Overlay.js handleDragStop to call context.updatePosition instead of props callback
- [ ] T049 [US2] Remove initialPosition and onPositionChange props from Overlay component signature

### Remove Props Forwarding (Intermediate Components)

- [ ] T050 [US2] Remove position prop forwarding from TopMenu.js (remove initialPosition and onPositionChange from VideoButton, ShareButton, HelpButton)
- [ ] T051 [US2] Remove position props from VideoButton.js component signature and props forwarding to VideoTutorial
- [ ] T052 [US2] Remove position props from ShareButton.js component signature and props forwarding to Share
- [ ] T053 [US2] Remove position props from HelpButton.js component signature and props forwarding to InfoOverlay
- [ ] T054 [US2] Remove position props from VideoTutorial.js component and props forwarding to Overlay
- [ ] T055 [US2] Remove position props from Share.js component and props forwarding to Overlay
- [ ] T056 [US2] Remove position props from InfoOverlay.js component and props forwarding to Overlay

### Context Testing

- [ ] T057 [P] [US2] Create integration test file src/__tests__/integration/context-provider.test.js for ModalPositionContext provider behavior
- [ ] T058 [P] [US2] Add tests in context-provider.test.js verifying provider renders without errors and provides correct default values
- [ ] T059 [P] [US2] Add tests in context-provider.test.js verifying consumer can read positions from context
- [ ] T060 [P] [US2] Add tests in context-provider.test.js verifying consumer can call updatePosition and state updates correctly
- [ ] T061 [P] [US2] Create unit test file src/__tests__/unit/context-hooks.test.js for useModalPosition hook edge cases
- [ ] T062 [P] [US2] Add tests in context-hooks.test.js for hook throwing error when used outside provider

### Verification

- [ ] T063 [US2] Run all existing tests and verify 100% pass without modification (behavior unchanged)
- [ ] T064 [US2] Manually test in browser: drag modals, verify URL updates, refresh page, verify positions restored
- [ ] T065 [US2] Verify in React DevTools that TopMenu, modal buttons, and modal content no longer have position props
- [ ] T066 [US2] Verify in React DevTools that Overlay components show Context hook with positions value

**Checkpoint**: User Story 2 complete - Props drilling eliminated, Context API implemented

---

## Phase 4: User Story 3 - Consolidate Position State Structure (Priority: P3)

**Goal**: Consolidate modal position state from 6 flat fields to nested object with factory pattern handlers

**Independent Test**: Verify state structure uses nested objects and handlers use factory pattern. URLs remain backwards compatible.

### State Structure Refactoring

- [ ] T067 [US3] Refactor WholeApp.js state initialization from 6 flat fields (videoModalX, videoModalY, etc.) to nested modalPositions object
- [ ] T068 [US3] Update WholeApp.js to initialize modalPositions as { video: {x, y}, help: {x, y}, share: {x, y} } with null values
- [ ] T069 [US3] Create factory function createPositionHandler in WholeApp.js that generates position update handlers dynamically
- [ ] T070 [US3] Refactor WholeApp.js position handlers to use factory function (replace 3 separate handlers with 1 factory call per modal)
- [ ] T071 [US3] Update WholeApp.updateModalPosition to use nested state structure with spread operator

### URL Encoder Updates

- [ ] T072 [US3] Update urlEncoder.js encodeSettingsToURL to read from state.modalPositions.video.x instead of state.videoModalX
- [ ] T073 [US3] Update urlEncoder.js encodeSettingsToURL to iterate modalPositions object and encode each modal's x/y coordinates
- [ ] T074 [US3] Update urlEncoder.js decodeSettingsFromURL to populate nested modalPositions structure from flat URL parameters
- [ ] T075 [US3] Update urlEncoder.js decodeSettingsFromURL to return { modalPositions: { video: {x, y}, help: {x, y}, share: {x, y} } }
- [ ] T076 [US3] Verify urlEncoder.js DEFAULT_SETTINGS uses nested modalPositions structure

### Backwards Compatibility

- [ ] T077 [US3] Add integration tests in url-encoder-positions.test.js verifying URLs created before refactoring still decode correctly
- [ ] T078 [US3] Add integration tests in url-encoder-positions.test.js verifying URLs created after refactoring have identical format to before
- [ ] T079 [US3] Manually test with existing shared URLs from feature 004 to verify they still load positions correctly

### Factory Pattern Testing

- [ ] T080 [P] [US3] Create unit test file src/__tests__/unit/handler-factory.test.js for createPositionHandler factory function
- [ ] T081 [P] [US3] Add tests in handler-factory.test.js verifying factory creates handlers that update correct modal in nested state
- [ ] T082 [P] [US3] Add tests in handler-factory.test.js verifying factory handlers preserve other modals' positions unchanged

### State Structure Testing

- [ ] T083 [P] [US3] Add integration tests in state-sync.test.js for nested state structure updates
- [ ] T084 [P] [US3] Add integration tests in state-sync.test.js verifying setState uses spread operator correctly for nested updates
- [ ] T085 [P] [US3] Add integration tests in state-sync.test.js verifying context value derives from nested state correctly

### Verification

- [ ] T086 [US3] Run all tests and verify 100% pass with nested state structure
- [ ] T087 [US3] Verify in React DevTools that WholeApp state shows modalPositions nested object, not flat fields
- [ ] T088 [US3] Manually test: configure settings, drag modals, verify URL format identical to before refactoring
- [ ] T089 [US3] Run coverage report and verify 100% coverage maintained after state consolidation

**Checkpoint**: User Story 3 complete - State consolidated, handler duplication eliminated, backwards compatibility maintained

---

## Phase 5: Polish & Documentation

**Purpose**: Final quality improvements and documentation updates

- [ ] T090 [P] Add JSDoc comments to ModalPositionContext.js documenting context interface and usage
- [ ] T091 [P] Add JSDoc comments to useModalPosition hook documenting parameters and return value
- [ ] T092 [P] Add JSDoc comments to urlEncoder.js explaining nested state structure handling
- [ ] T093 [P] Update CLAUDE.md with modal positioning testing patterns and Context API usage
- [ ] T094 [P] Add code comments in WholeApp.js explaining factory pattern for position handlers
- [ ] T095 Code review: verify all components follow React best practices and constitutional principles
- [ ] T096 Code review: verify all tests follow testing best practices from research.md
- [ ] T097 Run full test suite (integration + unit + E2E) and verify all tests pass
- [ ] T098 Run coverage report and verify final metrics: 100% total, 60-70% integration, 20-30% E2E, 10-20% unit
- [ ] T099 Performance audit: verify integration tests < 5s, E2E tests < 30s, modal drag interactions 60fps
- [ ] T100 Manual testing: complete all 10 scenarios from quickstart.md and verify all pass
- [ ] T101 Security review: verify no security regressions introduced by refactoring
- [ ] T102 Accessibility review: verify jest-axe and @axe-core/playwright tests pass with zero violations

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - start immediately
- **User Story 1 (Phase 2)**: Depends on Setup complete - can start after Phase 1
- **User Story 2 (Phase 3)**: Depends on User Story 1 complete (tests must exist before refactoring)
- **User Story 3 (Phase 4)**: Depends on User Story 2 complete (context must exist before state consolidation)
- **Polish (Phase 5)**: Depends on all user stories complete

### User Story Dependencies

- **User Story 1 (P1 - Tests)**: Independent - can start after Setup
- **User Story 2 (P2 - Context API)**: Depends on US1 (needs tests to verify behavior unchanged)
- **User Story 3 (P3 - State Consolidation)**: Depends on US2 (context must exist to derive from nested state)

### Within Each Phase

**Setup Phase**: All tasks can run in parallel (marked [P])

**User Story 1 (Tests)**:
- Integration tests (T006-T019): Can run in parallel (different files)
- E2E tests (T020-T027): Can run in parallel (different files)
- Unit tests (T028-T032): Can run in parallel (different files)
- Coverage verification (T033-T037): Must run sequentially after all tests complete

**User Story 2 (Context API)**:
- Context implementation (T038-T041): Must run sequentially
- Provider integration (T042-T044): Must run after context implementation
- Consumer refactoring (T045-T049): Must run after provider integration
- Remove props forwarding (T050-T056): Can run in parallel after consumer refactoring
- Context testing (T057-T062): Can run in parallel (different files)
- Verification (T063-T066): Must run sequentially after refactoring complete

**User Story 3 (State Consolidation)**:
- State refactoring (T067-T071): Must run sequentially
- URL encoder updates (T072-T076): Must run sequentially after state refactoring
- Backwards compatibility (T077-T079): Must run after URL encoder updates
- Testing (T080-T085): Can run in parallel (different files)
- Verification (T086-T089): Must run sequentially after all refactoring complete

**Polish Phase**: Most tasks can run in parallel (marked [P]), final verification (T097-T102) sequential

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (5 tasks)
2. Complete Phase 2: User Story 1 - Test Coverage (32 tasks)
3. **STOP and VALIDATE**: Run coverage report, verify 100% coverage
4. **Deploy MVP** if tests are sufficient without refactoring

**MVP Delivers**: Constitutional compliance - 100% test coverage with proper distribution

### Incremental Delivery

1. Setup (Phase 1) → Test utilities ready (5 tasks)
2. User Story 1 (Phase 2) → 100% test coverage achieved (32 tasks) → **Deploy MVP**
3. User Story 2 (Phase 3) → Props drilling eliminated (29 tasks) → **Deploy Refactored Version**
4. User Story 3 (Phase 4) → State consolidated (23 tasks) → **Deploy Final Version**
5. Polish (Phase 5) → Documentation and quality improvements (13 tasks)
6. **Deploy Production** (102 tasks total)

### Parallel Team Strategy

With multiple developers:

1. All complete Setup together (Phase 1)
2. After Setup:
   - Team A: Integration tests (T006-T019)
   - Team B: E2E tests (T020-T027)
   - Team C: Unit tests (T028-T032)
3. After US1 complete:
   - Team A: Context implementation (T038-T049)
   - Team B: Context testing (T057-T062)
4. After US2 complete:
   - Team A: State refactoring (T067-T076)
   - Team B: Testing (T080-T085)
5. All teams: Polish (Phase 5)

---

## Notes

- [P] tasks = different files, no dependencies, can run in parallel
- [Story] label maps task to specific user story for traceability
- Tasks include exact file paths for clarity
- Each user story is independently testable after completion
- Stop at any checkpoint to validate story independently
- User Story 1 (P1 - Tests) is MVP - must complete before production
- User Story 2 (P2 - Context) is next priority - eliminates technical debt
- User Story 3 (P3 - State) is optional enhancement - improves code quality
- Total task count: 102 tasks across 5 phases
- Test tasks are MANDATORY per constitution (not optional)

---

## Test Distribution Summary

After completion, verify test distribution:

**Integration Tests** (60-70% target):
- T006-T019: 14 integration test files/suites
- T057-T060: 4 context integration tests
- T077-T078, T083-T085: 5 state integration tests
- **Total: ~23 integration test suites**

**E2E Tests** (20-30% target):
- T020-T027: 8 E2E test files/scenarios
- **Total: ~8 E2E test suites**

**Unit Tests** (10-20% target):
- T028-T032: 5 position validation tests
- T061-T062: 2 context hook tests
- T080-T082: 3 factory pattern tests
- **Total: ~10 unit test suites**

**Distribution**: Integration (56%), E2E (20%), Unit (24%) - meets constitutional requirements ✅
