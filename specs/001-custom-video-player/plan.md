# Implementation Plan: Custom Video Player

**Branch**: `001-custom-video-player` | **Date**: 2026-01-15 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-custom-video-player/spec.md`

## Summary

Create a customizable video player component that displays in an overlay/modal, loads with a configurable default URL from settings, allows users to enter custom URLs via text input or paste, and provides reset functionality to revert to the original default URL. The implementation will extend the existing VideoTutorial pattern using ReactPlayer and the Overlay component.

## Technical Context

**Language/Version**: JavaScript ES6+, React 18.2.0
**Primary Dependencies**: ReactPlayer (react-player ^2.10.1), React Bootstrap (^2.5.0), react-draggable (^4.4.5)
**Storage**: N/A (session state only, no persistence)
**Testing**: Jest (^29.0.3), React Testing Library (^13.0.0), Playwright, jest-axe
**Target Platform**: Web browsers (Chrome 90+, Firefox 88+, Safari 14+)
**Project Type**: Web application (frontend only for this feature)
**Performance Goals**: <200ms UI response, <3s video load initiation
**Constraints**: Must follow existing Overlay/VideoTutorial patterns, WCAG 2.1 AA compliance
**Scale/Scope**: Single component feature, ~3-4 files modified/created

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Requirement | Status | Notes |
|-----------|-------------|--------|-------|
| I. Integration-First Testing | 60-70% integration, 20-30% E2E, 10-20% unit | ✅ PASS | Spec defines correct test distribution |
| II. Component Reusability | Single responsibility, clear props, composable | ✅ PASS | Extends existing patterns (VideoTutorial, Overlay) |
| III. Accessibility | Keyboard nav, ARIA, WCAG 2.1 AA | ✅ PASS | FR-011, FR-014, SC-004, SC-008 address this |
| IV. Performance | <200ms UI response | ✅ PASS | SC-001, SC-006 define measurable targets |
| V. Simplicity | No over-engineering, prefer edits | ✅ PASS | Reuses existing Overlay component, minimal new code |

**Gate Status**: ✅ ALL GATES PASS - Proceed to Phase 0

## Project Structure

### Documentation (this feature)

```text
specs/001-custom-video-player/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output (N/A - no API contracts for UI-only feature)
└── tasks.md             # Phase 2 output (/speckit.tasks command)
```

### Source Code (repository root)

```text
src/
├── components/
│   ├── menu/
│   │   ├── VideoButton.js        # Existing - trigger for video player
│   │   └── VideoTutorial.js      # Reference implementation
│   └── OverlayPlugins/
│       └── Overlay.js            # Existing - reuse for modal container
├── __integration__/
│   └── CustomVideoPlayer.integration.test.js  # New integration tests
└── __test__/
    └── CustomVideoPlayer.unit.test.js         # New unit tests (edge cases)

tests/
└── e2e/
    └── custom-video-player.spec.js            # New E2E tests
```

**Structure Decision**: Frontend-only feature using existing React component structure. New component will be placed in `src/components/menu/` alongside existing VideoTutorial. Tests follow established patterns in `__integration__/` and `__test__/` directories.

## Complexity Tracking

> No violations - all gates pass. Feature follows existing patterns.

| Aspect | Decision | Rationale |
|--------|----------|-----------|
| Component location | `src/components/menu/` | Consistent with existing VideoTutorial/VideoButton |
| Overlay reuse | Extend existing Overlay.js | Constitution V: prefer editing existing code |
| State management | Component-local state (useState) | Matches VideoTutorial pattern, no global state needed |
