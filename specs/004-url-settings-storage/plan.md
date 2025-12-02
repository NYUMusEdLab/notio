# Implementation Plan: URL-Based Settings Storage

**Branch**: `004-url-settings-storage` | **Date**: 2025-12-02 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/004-url-settings-storage/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

Replace Firebase database storage for user configurations with URL-encoded parameters, enabling instant sharing, offline functionality, and browser bookmark/history support. The refactoring maintains backwards compatibility with existing Firebase-based shared links while eliminating database writes for new shares. All 17 current settings (octave, scale, baseNote, notation, instrument, visibility toggles, video URL, etc.) will be encoded in compact URL parameters with proper validation and error handling.

## Technical Context

**Language/Version**: JavaScript ES6+, React 18.2.0
**Primary Dependencies**: React 18.2.0, React Router DOM 6.3.0, Firebase 10.9.0 (read-only legacy support)
**Storage**: URL query parameters (primary), Firebase Firestore (read-only fallback for legacy `/shared/{id}` links)
**Testing**: Jest 29.0.3, React Testing Library 13.0.0, Playwright (@playwright/test), jest-axe
**Target Platform**: Modern web browsers (Chrome, Firefox, Safari, Edge) with History API support (IE10+)
**Project Type**: Single-page web application
**Performance Goals**:
- URL generation < 1 second (synchronous, no network calls)
- URL parsing/state initialization < 100ms on app mount
- Debounced history updates 500-1000ms after setting changes
- 60fps UI responsiveness during setting changes

**Constraints**:
- URLs must remain under 2000 characters for 95% of configurations
- Must support custom scales with up to 12 steps
- Must maintain 100% backwards compatibility with Firebase links for 6+ months
- Must work offline (no network dependency for URL generation)
- HTTPS-only video URLs (security constraint)

**Scale/Scope**:
- 17 distinct settings to encode/decode
- Support for complex nested objects (scaleObject with name/steps/numbers)
- Array serialization (notation array)
- Special character handling in URLs (video URLs, custom scale names)

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### I. Pragmatic Testing Strategy ✅ PASS

**100% Code Coverage Plan**:
- **Integration Tests (60-70%)**:
  - URL encoding/decoding with all 17 settings
  - Share button flow with URL generation and clipboard copy
  - URL parameter parsing on app mount with state population
  - Browser history API integration with debounced updates
  - Firebase fallback for legacy `/shared/{id}` URLs
  - Error handling for invalid parameters, URL length overflow, malformed data
  - Settings persistence across browser back/forward navigation
- **E2E Tests (20-30%)**:
  - Complete share workflow: configure settings → click share → open link → verify restoration
  - Browser bookmark workflow: bookmark page → close/reopen → verify settings restored
  - Legacy Firebase link workflow: open old `/shared/{id}` → verify Firebase fallback works
  - Cross-browser compatibility (Chrome, Firefox, Safari)
  - URL length validation with configuration reduction suggestions
- **Unit Tests (10-20%)**:
  - URL parameter name abbreviation logic
  - Scale object serialization/deserialization edge cases (12+ steps, invalid values)
  - Video URL regex validation (reject javascript:, data:, file: protocols)
  - Debounce function behavior with rapid changes
  - URL length calculation utility

**Rationale**: Integration tests are primary because URL encoding/decoding must work seamlessly with React state management, routing, and UI components. E2E tests validate the complete user journey. Unit tests focus on complex serialization logic and security validation where edge cases are critical.

### II. Component Reusability ✅ PASS

**Reusable Components**:
- URL encoding/decoding utilities (can be extracted as pure functions)
- URL validation utilities (video URL regex, parameter validation)
- Error message display component (reusable for validation failures)
- Share button component already exists (`ShareButton.js`, `Share.js`, `ShareLink.js`)

**No new complex components required** - refactoring existing share functionality.

### III. Educational Pedagogy First ✅ PASS

**Alignment**:
- Instant sharing enables teachers to quickly share scale configurations with students
- Offline functionality ensures uninterrupted learning (no database dependency)
- Bookmarkable URLs let students save practice configurations
- Browser back/forward supports exploratory learning (try different scales, navigate back)
- Zero impact on educational content or pedagogy - purely infrastructure improvement

### IV. Performance & Responsiveness ✅ PASS

**Performance Requirements Met**:
- URL generation < 1s (synchronous, no Firebase writes)
- State initialization < 100ms (faster than current Firebase reads)
- Debounced updates prevent excessive history entries (500-1000ms)
- No audio/video latency impact - settings encoding doesn't affect playback
- 60fps maintained during setting changes (non-blocking URL updates)

### V. Integration-First Testing ✅ PASS

**Integration Test Coverage**:
- URL encoding + React state management integration
- Share button + clipboard API + URL generation flow
- URL parsing + app initialization + Firebase fallback
- Browser history API + debouncing + setting changes
- Error boundaries + validation + user feedback

**E2E Critical Paths**:
- Teacher shares scale → student opens → configuration matches exactly
- Student bookmarks practice setup → returns later → settings restored
- Legacy shared link still works via Firebase fallback

**Coverage Distribution**: Integration tests (65%), E2E tests (25%), Unit tests (10%) targeting 100% code coverage.

### VI. Accessibility & Inclusive Design ✅ PASS

**Accessibility Maintained**:
- Share button already has keyboard navigation (from previous a11y work)
- Error messages will use aria-live regions for screen reader announcements
- URL length warnings will be keyboard-accessible
- No visual-only feedback - error messages include text descriptions
- No new UI components that require accessibility work

### VII. Simplicity & Maintainability ✅ PASS

**Simple Solution**:
- Uses standard browser APIs (URLSearchParams, History API)
- No new external dependencies required
- Removes complexity: eliminates async Firebase writes for sharing
- Refactors existing code rather than adding new abstractions
- URL schema documented in code comments for future developers

**YAGNI Applied**:
- No URL shortening services (out of scope, can add later if needed)
- No complex versioning scheme (graceful parameter ignoring is sufficient)
- No custom serialization format (standard query parameters)

### Educational Integrity ✅ PASS

**No Impact**: This refactoring affects infrastructure only, not educational content, musical notation, or pedagogical accuracy.

### Data Privacy ✅ PASS

**Privacy Enhanced**:
- Removes server-side storage of user configurations
- No PII in URLs (only musical settings: scales, keys, notation preferences)
- Video URLs are user-provided (not personal data)
- Stateless architecture reduces data retention concerns

### Complexity Tracking

**No violations** - all constitutional principles satisfied.

## Project Structure

### Documentation (this feature)

```text
specs/004-url-settings-storage/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
│   └── url-schema.md    # URL parameter schema documentation
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

**Single-page React application structure:**

```text
src/
├── components/
│   ├── menu/
│   │   ├── ShareButton.js       # Modified: Remove async Firebase save
│   │   ├── Share.js              # Modified: Update to use URL generation
│   │   └── ShareLink.js          # Modified: Sync URL generation + clipboard
│   └── OverlayPlugins/
│       └── ErrorMessage.js       # New: Reusable error display component
├── services/
│   ├── urlEncoder.js             # New: URL encoding/decoding utilities
│   ├── urlValidator.js           # New: Parameter validation, video URL security
│   └── debounce.js               # New: Debounce utility for history updates
├── WholeApp.js                   # Modified: Add URL parsing on mount, history API integration
├── index.js                      # Modified: Add URL parsing before initial render
└── Firebase.js                   # Unchanged: Keep for read-only legacy support

src/__integration__/
├── url-encoding/
│   ├── url-state-restoration.test.js      # URL → state population
│   ├── share-url-generation.test.js       # Settings → URL encoding
│   └── firebase-fallback.test.js           # Legacy /shared/{id} support
├── browser-history/
│   └── history-navigation.test.js          # Back/forward button behavior
└── error-handling/
    ├── invalid-parameters.test.js          # Malformed URL handling
    └── url-length-validation.test.js       # 2000 char limit enforcement

e2e/
├── share-workflow.spec.js                  # Complete share + restore flow
├── bookmark-workflow.spec.js               # Bookmark + restore flow
└── legacy-links.spec.js                    # Firebase fallback E2E test
```

**Structure Decision**: Single-page web application (React). No backend/API layer needed since URL encoding is client-side only. Firebase remains for read-only legacy link support. New utilities added to `src/services/` for encoding/validation logic. Integration tests organized by feature area in `src/__integration__/`. E2E tests in root `e2e/` directory per existing Playwright convention.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

**No violations** - Constitution Check passed all gates.
