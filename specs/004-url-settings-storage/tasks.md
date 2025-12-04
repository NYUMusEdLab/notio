# Tasks: URL-Based Settings Storage

**Input**: Design documents from `/specs/004-url-settings-storage/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/url-schema.md

**Tests**: Tests are MANDATORY per project constitution requirement for 100% test coverage (60-70% Integration, 20-30% E2E, 10-20% Unit). Test tasks are distributed throughout phases below.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

Single-page React application structure at repository root with `src/` directory.

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Create utility services and error handling infrastructure that ALL user stories depend on

**Independent Test**: Services can be tested independently with unit tests before integration

- [X] T001 [P] Create URL encoder/decoder service in src/services/urlEncoder.js with encodeSettingsToURL() and decodeSettingsFromURL() functions
- [X] T002 [P] Create URL validator service in src/services/urlValidator.js with validateURLLength(), isValidVideoURL(), and parameter validation functions
- [X] T003 [P] Create debounce utility in src/services/debounce.js for history API updates with 500ms delay
- [X] T004 [P] Create reusable ErrorMessage component in src/components/OverlayPlugins/ErrorMessage.js with aria-live region for accessibility
- [X] T005 [P] [TEST-UNIT] Create unit tests for debounce utility in src/services/__tests__/debounce.test.js covering timing, multiple calls, and cancellation
- [X] T006 [P] [TEST-UNIT] Create unit tests for urlValidator.js in src/services/__tests__/urlValidator.test.js covering length limits, protocol blocking, and custom scale validation
- [X] T007 [P] [TEST-INT] Create integration tests for ErrorMessage component in src/components/OverlayPlugins/__tests__/ErrorMessage.test.js with accessibility audit using jest-axe

**Checkpoint**: Utility services ready with test coverage - user story implementation can now begin

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**CRITICAL**: No user story work can begin until URL schema encoding/decoding is working

- [X] T008 Implement URLSearchParams-based encoding for all 17 settings in src/services/urlEncoder.js per contracts/url-schema.md parameter reference
- [X] T009 Implement abbreviated parameter names mapping (o, s, bn, c, n, i, p, ek, ts, t, son, v, va, vt, od, sn, ss, snum) in src/services/urlEncoder.js
- [X] T010 Implement ScaleObject serialization for custom scales (sn, ss, snum parameters) with comma-separated arrays in src/services/urlEncoder.js
- [X] T011 Implement URL parameter decoding with validation and fallback to defaults in src/services/urlEncoder.js
- [X] T012 Implement video URL security validation with HTTPS-only regex and protocol blocking (javascript:, data:, file:) in src/services/urlValidator.js
- [X] T013 Implement URL length validation with 2000 character limit and suggestion generation in src/services/urlValidator.js
- [X] T014 Implement custom scale validation (steps 0-11, length 1-12, matching array lengths) in src/services/urlValidator.js
- [X] T015 [P] [TEST-INT] Create integration tests for urlEncoder.js in src/services/__tests__/urlEncoder.test.js covering all 17 parameters, encoding/decoding round-trips, and default fallbacks
- [X] T016 [P] [TEST-INT] Create integration tests for ScaleObject serialization in src/services/__tests__/urlEncoder.test.js covering custom scales, comma-separated arrays, and edge cases
- [X] T017 [P] [TEST-UNIT] Create unit tests for security validation edge cases in src/services/__tests__/urlValidator.test.js covering protocol attacks, malformed URLs, and boundary conditions

**Checkpoint**: Foundation ready with comprehensive test coverage - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Load Shared Settings from URL (Priority: P1) MVP

**Goal**: Users can open a shared link and have all settings restored from URL parameters without requiring database connection

**Independent Test**: Open URLs with various parameter combinations and verify settings are correctly applied. Test with partial parameters, invalid parameters, and legacy Firebase URLs.

### Implementation for User Story 1

- [X] T018 [US1] Modify WholeApp.js componentDidMount() to parse URL parameters on app initialization before Firebase check
- [X] T019 [US1] Add URL parameter parsing logic in WholeApp.js using decodeSettingsFromURL() to populate initial component state
- [X] T020 [US1] Implement default value fallback for missing URL parameters in WholeApp.js using existing DEFAULT_SETTINGS constants
- [X] T021 [US1] Add legacy Firebase link detection in WholeApp.js for /shared/{id} pathname pattern with Firebase fallback
- [X] T022 [US1] Implement error collection and display in WholeApp.js for invalid URL parameters using ErrorMessage component
- [X] T023 [US1] Add special handling for invalid custom scale data in WholeApp.js (fall back to Major scale, show error, continue loading other settings)
- [X] T024 [US1] Add duplicate parameter handling in src/services/urlEncoder.js (use last occurrence per URLSearchParams behavior)
- [ ] T025 [P] [TEST-INT] Create integration tests for URL parameter loading in src/__tests__/WholeApp.urlLoading.test.js covering all 17 parameters, partial parameters, and invalid parameters using React Testing Library
- [ ] T026 [P] [TEST-INT] Create integration tests for legacy Firebase link fallback in src/__tests__/WholeApp.urlLoading.test.js verifying /shared/{id} detection and Firebase fallback behavior
- [ ] T027 [P] [TEST-INT] Create integration tests for error handling in URL loading in src/__tests__/WholeApp.urlLoading.test.js covering invalid custom scales, malformed URLs, and error message display with jest-axe accessibility audit

**Checkpoint**: User Story 1 complete with comprehensive test coverage - users can open shared URLs and have settings restored correctly

---

## Phase 4: User Story 2 - Generate Shareable URL (Priority: P1) MVP

**Goal**: Users can generate shareable URLs containing all current settings without requiring database writes

**Independent Test**: Configure various settings, click share, verify URL is generated synchronously and contains all parameters. Test clipboard copy functionality.

### Implementation for User Story 2

- [X] T028 [US2] Modify ShareLink.js to use synchronous URL generation instead of async Firebase save in handleShareClick function
- [X] T029 [US2] Update ShareLink.js to call encodeSettingsToURL() with current WholeApp state passed as props
- [X] T030 [US2] Add URL length pre-validation in ShareLink.js before generating share link using validateURLLength()
- [X] T031 [US2] Implement error display in ShareLink.js when URL exceeds 2000 characters with actionable suggestions (disable video URL, simplify custom scales)
- [X] T032 [US2] Update ShareLink.js clipboard copy functionality to work with new synchronous URL generation
- [X] T033 [US2] Remove async/await and loading state from ShareLink.js share button (now synchronous operation)
- [X] T034 [US2] Update Share.js component to pass current settings state to ShareLink component as props
- [X] T035 [US2] Update ShareButton.js to remove Firebase save call and update UI to reflect instant share functionality
- [ ] T036 [P] [TEST-INT] Create integration tests for ShareLink component in src/components/OverlayPlugins/__tests__/ShareLink.test.js covering synchronous URL generation, clipboard copy, and all 17 settings using React Testing Library
- [ ] T037 [P] [TEST-INT] Create integration tests for URL length validation in src/components/OverlayPlugins/__tests__/ShareLink.test.js covering 2000 character limit, error display, and actionable suggestions with jest-axe accessibility audit
- [ ] T038 [P] [TEST-INT] Create end-to-end round-trip tests in src/__tests__/urlRoundTrip.test.js verifying generate URL → copy → paste → load → settings match original for all parameters

**Checkpoint**: User Story 2 complete with comprehensive test coverage - users can generate shareable URLs instantly without database dependency

---

## Phase 5: User Story 3 - Browser Navigation with Settings (Priority: P2)

**Goal**: Browser back/forward buttons work naturally with configuration changes, preserving settings history

**Independent Test**: Change settings multiple times, use browser back button to verify settings revert, test forward button, verify rapid changes are debounced correctly.

### Implementation for User Story 3

- [X] T039 [US3] Import debounce utility in WholeApp.js and create debounced URL update function with 500ms delay
- [X] T040 [US3] Add URL update trigger in WholeApp.js componentDidUpdate() lifecycle method for any setting change
- [X] T041 [US3] Implement history.replaceState() call in WholeApp.js to update browser URL without page reload
- [X] T042 [US3] Add URL length check before history update in WholeApp.js (skip update if > 2000 characters)
- [X] T043 [US3] Implement popstate event listener in WholeApp.js to handle browser back/forward button clicks
- [X] T044 [US3] Add state restoration logic in WholeApp.js popstate handler using decodeSettingsFromURL() to update component state from URL
- [ ] T045 [P] [TEST-INT] Create integration tests for browser history in src/__tests__/WholeApp.browserHistory.test.js covering URL updates on settings changes, debouncing, and URL length limits using React Testing Library
- [ ] T046 [P] [TEST-INT] Create integration tests for popstate handling in src/__tests__/WholeApp.browserHistory.test.js covering back/forward navigation and state restoration

**Checkpoint**: User Story 3 complete with comprehensive test coverage - browser navigation works with settings changes

---

## Phase 6: User Story 4 - Bookmark Custom Configurations (Priority: P3)

**Goal**: Users can bookmark specific configurations for quick access to frequently used setups

**Independent Test**: Configure settings, bookmark page, close browser, reopen bookmark and verify settings are restored. Test multiple bookmarks with different configurations.

### Implementation for User Story 4

- [X] T047 [US4] Verify bookmark functionality works with existing User Story 1 implementation (URL parsing on mount)
- [X] T048 [US4] Add documentation comment in WholeApp.js explaining bookmark support via URL parameter persistence
- [X] T049 [US4] Update user-facing documentation or help text to mention bookmark support for saving custom configurations
- [ ] T050 [P] [TEST-INT] Create integration tests for bookmark functionality in src/__tests__/WholeApp.bookmarks.test.js verifying URL persistence across page reloads and multiple bookmark configurations

**Checkpoint**: User Story 4 complete with test coverage - users can bookmark and restore configurations

---

## Phase 7: User Story 5 - Future-Proof URL Extensions (Priority: P2)

**Goal**: System supports adding new settings parameters in future updates without breaking existing shared links

**Independent Test**: Simulate future parameters by adding unknown params to URLs and verify they are gracefully ignored. Test old URLs in "new version" scenario.

### Implementation for User Story 5

- [X] T051 [US5] Verify unknown parameter handling in src/services/urlEncoder.js decoding function (ignore gracefully)
- [X] T052 [US5] Add version detection placeholder in src/services/urlEncoder.js for future schema versions (v parameter support)
- [X] T053 [US5] Document URL schema versioning strategy in contracts/url-schema.md with examples of adding new parameters
- [X] T054 [US5] Add developer documentation in src/services/urlEncoder.js explaining backwards compatibility contract
- [X] T055 [US5] Verify default value fallback for missing parameters maintains forward compatibility
- [ ] T056 [P] [TEST-INT] Create integration tests for future-proofing in src/services/__tests__/urlEncoder.futureProof.test.js covering unknown parameters, missing parameters, and schema version handling

**Checkpoint**: User Story 5 complete with test coverage - future parameter additions will not break existing URLs

---

## Phase 8: E2E Testing & Polish

**Purpose**: End-to-end validation and cross-cutting quality improvements

### E2E Tests (Constitution Requirement: 20-30% E2E)

- [ ] T057 [P] [TEST-E2E] Create Playwright E2E test in tests/e2e/urlSettings.spec.js for complete user journey: configure settings → generate URL → copy → open in new browser → verify settings match
- [ ] T058 [P] [TEST-E2E] Create Playwright E2E test in tests/e2e/urlSettings.spec.js for browser history: change settings multiple times → back button → forward button → verify settings restore correctly
- [ ] T059 [P] [TEST-E2E] Create Playwright E2E test in tests/e2e/urlSettings.spec.js for bookmark workflow: configure → bookmark → close browser → reopen bookmark → verify settings persist
- [ ] T060 [P] [TEST-E2E] Create Playwright E2E test in tests/e2e/urlSettings.spec.js for error scenarios: URL too long → verify error message shown with actionable suggestions
- [ ] T061 [P] [TEST-E2E] Create Playwright E2E test with @axe-core/playwright in tests/e2e/urlSettings.spec.js for accessibility audit covering error messages, share button, and keyboard navigation
- [ ] T062 [P] [TEST-E2E] Create Playwright E2E test in tests/e2e/urlSettings.spec.js for security validation: malicious video URLs → verify blocked with error message
- [ ] T063 [P] [TEST-E2E] Create Playwright E2E test in tests/e2e/urlSettings.spec.js for cross-browser compatibility: test URL sharing workflow in Chromium, Firefox, and WebKit

### Polish & Documentation

- [ ] T064 [P] Update CLAUDE.md with URL-based settings storage patterns and URL parameter encoding guidelines
- [ ] T065 [P] Add JSDoc comments to all functions in src/services/urlEncoder.js with parameter descriptions and return types
- [ ] T066 [P] Add JSDoc comments to validation functions in src/services/urlValidator.js with security notes
- [ ] T067 Code review and refactoring pass across all modified files for code quality
- [ ] T068 Verify all error messages are user-friendly and actionable in WholeApp.js and ShareLink.js
- [ ] T069 Run quickstart.md manual testing workflow to validate all six test scenarios
- [ ] T070 Performance audit: verify URL generation < 10ms, parsing < 5ms, debounce working correctly
- [ ] T071 Security audit: verify video URL validation blocks dangerous protocols, no XSS vulnerabilities
- [ ] T072 Documentation update: add URL parameter reference to user-facing help/documentation

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup (Phase 1) completion - BLOCKS all user stories
- **User Stories (Phases 3-7)**: All depend on Foundational (Phase 2) completion
  - User Story 1 (Phase 3): Can start after Foundational - No dependencies on other stories
  - User Story 2 (Phase 4): Depends on User Story 1 (needs URL parsing to test generated URLs)
  - User Story 3 (Phase 5): Depends on User Stories 1 & 2 (needs URL parsing and generation)
  - User Story 4 (Phase 6): Depends on User Story 1 (bookmarks use same URL parsing)
  - User Story 5 (Phase 7): Can start after Foundational - Independent of other stories
- **Polish (Phase 8)**: Depends on all user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - Foundation for all other stories
- **User Story 2 (P1)**: Depends on User Story 1 completion (needs URL parsing to validate generated URLs work)
- **User Story 3 (P2)**: Depends on User Stories 1 & 2 (needs both parsing and generation)
- **User Story 4 (P3)**: Depends on User Story 1 (reuses URL parsing logic)
- **User Story 5 (P2)**: Can start after Foundational (Phase 2) - Primarily documentation/verification

### Within Each Phase

**Setup Phase**:
- All tasks marked [P] can run in parallel (different files)

**Foundational Phase**:
- T005-T007 must complete before T008 (encoding before decoding)
- T009-T011 can run in parallel with each other

**User Story Phases**:
- Tasks within a story should be completed sequentially
- Each story builds upon previous story's work

### Parallel Opportunities

- **Phase 1 (Setup)**: All 4 tasks can run in parallel (T001, T002, T003, T004)
- **Phase 8 (Polish)**: T041, T042, T043 can run in parallel
- **Between Stories**: User Story 4 and User Story 5 can be worked on in parallel after User Story 1 completes

---

## Parallel Example: Setup Phase

```bash
# Launch all setup tasks together:
Task T001: "Create URL encoder/decoder service in src/services/urlEncoder.js"
Task T002: "Create URL validator service in src/services/urlValidator.js"
Task T003: "Create debounce utility in src/services/debounce.js"
Task T004: "Create ErrorMessage component in src/components/OverlayPlugins/ErrorMessage.js"
```

---

## Implementation Strategy

### MVP First (User Stories 1 & 2 Only)

1. Complete Phase 1: Setup (7 tasks: 4 implementation + 3 tests)
2. Complete Phase 2: Foundational (10 tasks: 7 implementation + 3 tests) - CRITICAL blocking phase
3. Complete Phase 3: User Story 1 (10 tasks: 7 implementation + 3 tests)
4. Complete Phase 4: User Story 2 (11 tasks: 8 implementation + 3 tests)
5. **STOP and VALIDATE**: Run all tests and validate URL sharing end-to-end
6. Deploy/demo MVP if ready

**MVP Delivers**: Core functionality with comprehensive test coverage - users can generate URLs and share them with instant restoration of settings. No database writes required. 100% test coverage per constitution.

### Incremental Delivery

1. Complete Setup + Foundational (Phases 1-2) → Foundation ready (17 tasks: 11 implementation + 6 tests)
2. Add User Story 1 (Phase 3) → Test independently → URL parsing works (10 tasks: 7 implementation + 3 tests)
3. Add User Story 2 (Phase 4) → Test independently → URL generation works (11 tasks: 8 implementation + 3 tests)
4. **Deploy MVP** (38 tasks total) → Users can share and load configurations with full test coverage
5. Add User Story 3 (Phase 5) → Browser history support (8 tasks: 6 implementation + 2 tests)
6. Add User Story 4 (Phase 6) → Bookmark support (4 tasks: 3 implementation + 1 test)
7. Add User Story 5 (Phase 7) → Future-proofing (6 tasks: 5 implementation + 1 test)
8. Add E2E Testing & Polish (Phase 8) → Final validation and quality pass (16 tasks: 9 polish + 7 E2E tests)
9. **Deploy Full Feature** (72 tasks total: 50 implementation + 22 tests)

### Parallel Team Strategy

With multiple developers:

1. All complete Setup + Foundational together (Phases 1-2)
2. Once Foundational is done:
   - Developer A: User Story 1 (Phase 3)
   - Developer B: User Story 5 (Phase 7) - can work in parallel
3. After User Story 1 completes:
   - Developer A: User Story 2 (Phase 4)
   - Developer B: User Story 4 (Phase 6) - depends on US1
4. After User Story 2 completes:
   - Developer A: User Story 3 (Phase 5)
5. All developers: Polish (Phase 8)

---

## Notes

- [P] tasks = different files, no dependencies, can run in parallel
- [Story] label maps task to specific user story for traceability
- [TEST-UNIT] = Unit tests (10-20% per constitution) for edge cases and utilities
- [TEST-INT] = Integration tests (60-70% per constitution) using React Testing Library + jest-axe
- [TEST-E2E] = End-to-end tests (20-30% per constitution) using Playwright + @axe-core/playwright
- Each user story should be independently testable after completion
- Test tasks are MANDATORY per constitution requirement for 100% test coverage
- Firebase.js remains unchanged for backwards compatibility
- Stop at any checkpoint to validate story independently
- User Stories 1 & 2 (both P1) form the MVP - implementation + tests
- Total task count: 72 tasks across 8 phases (50 implementation + 22 test tasks)
