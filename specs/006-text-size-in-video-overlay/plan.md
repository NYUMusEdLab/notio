# Implementation Plan: Improve Text Readability in Video Player Instructions

**Branch**: `004-text-size-in-video-overlay` | **Date**: 2025-11-22 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `/specs/004-text-size-in-video-overlay/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

Increase the default text size of video player instruction text to improve readability (minimum 16px) and provide users with customizable text size options (small/medium/large) that persist across sessions. The feature will include text size adjustment controls in the video overlay and apply consistently across all instruction-related text elements.

## Technical Context

**Language/Version**: JavaScript ES6+, React 18.2.0
**Primary Dependencies**: React Bootstrap, ReactPlayer, react-draggable, Firebase (^9.9.4), SCSS
**Storage**: Browser localStorage for text size preferences (client-side), Firebase for session data
**Testing**: React Testing Library (@testing-library/react ^13.0.0), Jest (^29.0.3), Playwright (@playwright/test)
**Target Platform**: Web browser (desktop/laptop)
**Project Type**: React web application (frontend-focused)
**Performance Goals**: Text size adjustment should respond instantly (< 100ms) with no layout shift
**Constraints**: Must maintain layout integrity at all supported text sizes; no performance degradation; backwards compatibility with existing video player UI
**Scale/Scope**: Single feature for existing video player component; affects ~5 SCSS files and 3 component files

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

The constitution file is a template and not yet populated with specific project principles. Based on CLAUDE.md project guidance:

**Required Areas:**
- ✅ Testing Strategy: React Testing Library for integration tests (60-70%), Playwright for E2E (20-30%), Jest for units (10-20%)
- ✅ Accessibility: All interactive components must include proper ARIA labels and keyboard support
- ✅ Code Style: JavaScript ES6+, React 18.2.0 standard conventions
- ✅ Storage Pattern: Firebase for session data, localStorage for client-side state
- ✅ Component Structure: React + React Bootstrap + SCSS

**Compliance Status**: ✅ PASS
This feature aligns with all documented standards. No violations detected.

## Project Structure

### Documentation (this feature)

```text
specs/004-text-size-in-video-overlay/
├── plan.md              # This file
├── research.md          # Phase 0 output (to be created)
├── data-model.md        # Phase 1 output (to be created)
├── quickstart.md        # Phase 1 output (to be created)
├── contracts/           # Phase 1 output (to be created)
├── checklists/
│   └── requirements.md  # Quality validation checklist
└── spec.md              # Feature specification
```

### Source Code Structure

```text
src/
├── components/
│   ├── menu/
│   │   ├── VideoTutorial.js              # Main video player component
│   │   └── VideoButton.js                # Button to open video player
│   └── OverlayPlugins/
│       └── Overlay.js                    # Draggable overlay container
└── styles/
    └── 02_components/
        ├── video_overlay.scss            # Video-specific styles
        ├── Overlay.scss                  # Overlay container styles
        └── style.scss                    # Main stylesheet

tests/
├── integration/
│   └── video-text-size.test.js           # Integration tests for feature
└── e2e/
    └── video-text-size.spec.js           # E2E tests with Playwright
```

**Structure Decision**: Single-feature implementation within existing React web application. No new projects or modules required. Feature modifies existing video player component and its associated stylesheets to add text size control and persistence capabilities.
