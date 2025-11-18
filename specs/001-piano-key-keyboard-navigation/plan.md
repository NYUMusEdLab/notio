# Implementation Plan: Piano Key Keyboard Navigation

**Branch**: `001-piano-key-keyboard-navigation` | **Date**: 2025-01-16 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `/specs/001-piano-key-keyboard-navigation/spec.md`

## Summary

Enhance existing keyboard navigation for the piano keyboard to meet WCAG 2.1 Level AA accessibility standards, add out-of-scale audio feedback for educational purposes, and ensure comprehensive test coverage. Most functionality already exists (piano keyboard container focusable, arrow navigation, Enter/Space activation, computer keyboard shortcuts FGH.../ZXCASDQWE). Primary work involves enhancing focus management, adding out-of-scale audio feedback, comprehensive testing, and performance verification (<20ms latency maintained).

## Technical Context

**Language/Version**: JavaScript ES6+, React 18.2.0
**Primary Dependencies**: React Testing Library (@testing-library/react ^13.0.0), jest-axe, Playwright (@playwright/test), @axe-core/playwright
**Storage**: Firebase (^9.9.4) for user data, localStorage for client-side state (scales, progress), existing scale state management
**Testing**: Jest (^29.0.3) for integration/unit, Playwright for E2E, jest-axe + @axe-core/playwright for accessibility
**Target Platform**: Web browsers (Chrome 90+, Firefox 88+, Safari 14+, Edge 90+)
**Project Type**: Web application (frontend React SPA)
**Performance Goals**: <20ms keypress-to-sound latency (CRITICAL), <50ms arrow key navigation response, <16ms focus indicator transition (60fps)
**Constraints**: NO performance degradation from current master branch, 100% code coverage (60-70% integration, 20-30% E2E, 10-20% unit), WCAG 2.1 Level AA compliance
**Scale/Scope**: 88-key piano (A0-C8), 6 user stories, existing functionality preservation, new out-of-scale audio feedback feature

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### Testing Strategy Compliance (Principle I)
- [X] 100% code coverage target confirmed (NFR-009)
- [X] Integration tests planned for 60-70% of test suite (primary strategy) - Specified in testing strategy
- [X] E2E tests planned for 20-30% of test suite (critical user journeys) - Cross-browser, performance, screen reader tests
- [X] Unit tests planned for 10-20% (edge cases only) - Navigation logic edge cases, octave calculation, focus boundary conditions
- [X] Test approach follows Rainer Hahnekamp's integration-first principles - Explicitly documented in spec

### Component Reusability (Principle II)
- [X] UI components designed for reusability - Existing piano keyboard container, color parent components already reusable
- [X] Single responsibility principle applied - Piano keyboard container manages focus, keys render individually
- [X] Props interfaces clearly defined - Spec documents Key entities with clear responsibilities

### Educational Pedagogy First (Principle III)
- [X] Target learner personas identified - Keyboard-only users (accessibility focus), music students (out-of-scale feedback)
- [X] Progressive disclosure of complexity considered - Basic navigation (US1-3) before advanced features (US6 out-of-scale feedback)
- [X] Immediate, pedagogically meaningful feedback designed - Out-of-scale audio cue helps learn scale patterns (US6), <20ms latency for immediate connection

### Performance & Responsiveness (Principle IV)
- [X] Audio latency targets met (< 50ms for interactive instruments) - Target is <20ms (NFR-001), stricter than constitution
- [X] Notation rendering targets met (< 200ms) - N/A for this feature
- [X] Performance validated on target educational devices - NFR-002: NO degradation from master, NFR-003: <50ms navigation

### Integration-First Testing (Principle V)
- [X] Musical feature integration tests planned - Audio playback + keyboard interaction + focus management tested together
- [X] Cross-component workflows covered - Piano keyboard + color parent sync, keyboard shortcuts + navigation conflict testing
- [X] Audio-visual synchronization tested - Out-of-scale audio cue timing, sustained notes behavior

### Accessibility & Inclusive Design (Principle VI)
- [X] Keyboard navigation fully functional - Core feature requirement, all user stories focus on keyboard-only interaction
- [X] Color not sole information channel - Out-of-scale feedback primarily audio (User Story 6)
- [X] WCAG 2.1 AA standards met - NFR-005 explicit requirement, SC-005 measurable outcome

### Simplicity & Maintainability (Principle VII)
- [X] Simplest solution implemented (YAGNI principle) - State + refs hybrid (Option B) chosen for simplicity and color parent sync
- [X] Abstractions justified by actual need - Roving tabIndex pattern (WAI-ARIA standard), state for color parent sync (justified)
- [X] Dependencies evaluated for necessity - All dependencies already in project (React, jest-axe, Playwright)

## Project Structure

### Documentation (this feature)

```text
specs/001-piano-key-keyboard-navigation/
├── spec.md                    # Feature specification (COMPLETE)
├── CLARIFICATION_SUMMARY.md   # Clarification session results (COMPLETE)
├── plan.md                    # This file (IN PROGRESS - Phase 0)
├── research.md                # Phase 0 output (PENDING - codebase exploration)
├── data-model.md              # Phase 1 output (PENDING)
├── quickstart.md              # Phase 1 output (PENDING)
├── contracts/                 # Phase 1 output (PENDING - keyboard event contracts, audio API contracts)
└── tasks.md                   # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
# Web application structure (React SPA)
src/
├── components/
│   ├── Key.js                          # Piano key component (EXISTING - needs enhancement)
│   ├── Keyboard.js                     # Piano keyboard container (EXISTING - needs exploration)
│   ├── [ColorParent component]         # Color key parent for colorblind mode (EXISTING - needs location)
│   └── menu/                           # Menu components (reference for focus management patterns)
│       ├── SubMenu.js
│       └── DropdownCustomScaleMenu.js
├── services/
│   ├── [AudioPlayback service]         # Web Audio API integration (EXISTING - needs location)
│   └── [ScaleDetection service]        # Scale state management (EXISTING - needs location)
└── lib/
    └── [KeyboardShortcuts]             # FGH.../ZXCASDQWE mapping (EXISTING - needs location)

src/__integration__/accessibility/      # 60-70% of tests
├── keyboard-piano.test.js              # EXISTING - may need expansion
├── menu-arrow-navigation.test.js       # EXISTING - reference for patterns
└── [new test files for piano keyboard navigation]

e2e/accessibility/                      # 20-30% of tests
├── keyboard-workflow.spec.js           # EXISTING - 8 skipped tests to re-enable
├── focus-visibility-e2e.spec.js        # EXISTING - focus indicator tests
└── screen-reader-e2e.spec.js           # EXISTING - ARIA/screen reader tests

src/__tests__/unit/accessibility/       # 10-20% of tests (edge cases only)
└── [new unit tests for navigation logic edge cases]
```

**Structure Decision**: Standard React SPA structure already in place. Feature will enhance existing components (Key.js, Keyboard.js or similar piano container) and add new out-of-scale audio feedback logic. Testing infrastructure already established (jest-axe, Playwright). No new directories needed; will use existing src/, src/__integration__/, e2e/, src/__tests__/ structure.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

No violations detected. All constitution principles satisfied:
- Testing strategy aligns with integration-first approach (60-70% integration, 20-30% E2E, 10-20% unit)
- Reusable components already designed (piano keyboard, color parent)
- Educational pedagogy prioritized (out-of-scale feedback for learning, <20ms latency for musical connection)
- Performance targets exceed constitution minimums (<20ms vs <50ms)
- Integration-first testing planned (audio + interaction + focus tested together)
- Accessibility is core feature requirement (WCAG 2.1 AA compliance)
- Simplest solution chosen (state + refs hybrid justified by color parent sync need)

---

## Phase 0: Codebase Exploration & Research

**Status**: PENDING

**Objective**: Locate all existing implementations that this feature enhances, understand current architecture, resolve all "NEEDS CLARIFICATION" items from spec's Dependencies section.

### Research Tasks

Based on spec's "Codebase Exploration Needed" section (Dependencies), the following unknowns must be resolved:

1. **Piano Keyboard Parent Container Component**
   - **Unknown**: Exact file path and component name
   - **Search strategy**: Grep for "Keyboard" components, look for tabIndex={0} or role="application"
   - **Expected location**: src/components/Keyboard.js or src/components/Piano/
   - **Information needed**: Component structure, existing props, current keyboard event handlers

2. **Existing Arrow Key Navigation Implementation**
   - **Unknown**: Where arrow key handlers are currently implemented
   - **Search strategy**: Grep for "ArrowRight", "ArrowLeft", "ArrowUp", "ArrowDown" in keyboard/piano components
   - **Expected location**: Piano keyboard container component or parent
   - **Information needed**: Current navigation logic, state management approach, focus management

3. **Enter/Space Activation Handlers**
   - **Unknown**: Where note playback is triggered by Enter/Space
   - **Search strategy**: Grep for "Enter", "Space", " " (space key), "playNote" in keyboard components
   - **Expected location**: Piano keyboard container or Key component
   - **Information needed**: How notes are currently triggered, audio system integration point

4. **Computer Keyboard Shortcut Mapping (FGH.../ZXCASDQWE)**
   - **Unknown**: File path, mapping structure, event handling location
   - **Search strategy**: Grep for "FGH", "ZXCASDQWE", keyboard shortcuts, key mapping
   - **Expected location**: src/lib/, src/services/, or piano keyboard container
   - **Information needed**: Key-to-note mapping, event handling approach, potential conflicts with navigation keys

5. **Scale State and Scale Detection Logic**
   - **Unknown**: Where current scale is stored, how scale membership is determined
   - **Search strategy**: Grep for "scale", "Major", "Minor", scale state management
   - **Expected location**: src/services/, Redux/Context state, or localStorage
   - **Information needed**: Scale data structure, how to check if note is in scale, scale change events

6. **Color Parent Component and Synchronization Logic**
   - **Unknown**: Component name, file path, how it syncs with piano keyboard
   - **Search strategy**: Grep for "color", "colorblind", "parent", number key bindings (1-9)
   - **Expected location**: src/components/, parallel to piano keyboard
   - **Information needed**: Current sync mechanism, shared state, event handling

7. **Web Audio API Integration for Note Playback**
   - **Unknown**: Audio service file path, playback API, latency characteristics
   - **Search strategy**: Grep for "AudioContext", "Web Audio", "playNote", "sound"
   - **Expected location**: src/services/audio/, src/lib/
   - **Information needed**: How to play notes, how to add out-of-scale audio cue, current latency measurements

### Best Practices Research

8. **WAI-ARIA Application Pattern Best Practices**
   - **Topic**: role="application" usage, when to use vs role="group"
   - **Resources**: WAI-ARIA Authoring Practices 1.2 (already referenced in spec)
   - **Information needed**: Confirm role="application" is correct for custom keyboard handling, screen reader behavior

9. **React Performance Optimization for State Updates**
   - **Topic**: State + refs hybrid approach, minimizing re-renders while maintaining color parent sync
   - **Resources**: React docs on useRef vs useState, React DevTools Profiler
   - **Information needed**: Performance profiling approach, re-render impact on <50ms navigation target

10. **Web Audio API Low-Latency Playback**
    - **Topic**: Achieving <20ms keypress-to-sound latency with Web Audio API
    - **Resources**: Web Audio API specs, low-latency audio techniques
    - **Information needed**: Current latency baseline, optimization techniques, measurement approach

11. **Out-of-Scale Audio Cue Design**
    - **Topic**: Pedagogically effective but non-intrusive audio feedback for wrong notes
    - **Resources**: Music education research, UX sound design, Web Audio synthesis
    - **Information needed**: Sound design options (muted tone vs click vs brief dissonant chord), volume relative to note, duration

### Output

**Deliverable**: `research.md` documenting:
- File paths and component names for all 7 existing implementations
- Architecture diagrams showing component relationships
- Current keyboard event flow (shortcuts, navigation, activation)
- Scale state management approach
- Color parent synchronization mechanism
- Audio playback API and latency baseline
- Best practices decisions for ARIA, performance, audio cue design
- Performance baseline measurements (current latency, navigation response time)

**Acceptance Criteria**:
- All "NEEDS CLARIFICATION" items from Dependencies section resolved
- File paths confirmed via actual codebase exploration (not speculation)
- Current performance baselines measured (for regression testing)
- Audio cue design options evaluated with pros/cons
- All unknowns replaced with concrete implementation details

---

## Phase 1: Design & Contracts

**Status**: NOT STARTED (blocked by Phase 0)

**Objective**: Design out-of-scale audio feedback system, define keyboard event contracts, create integration points with existing components.

### Design Artifacts

1. **data-model.md**: Focus State, Out-of-Scale Audio Cue entity, integration with existing Scale State
2. **contracts/**: Keyboard event contracts (navigation, activation), Audio API extension for out-of-scale cue
3. **quickstart.md**: Manual testing guide for keyboard navigation, out-of-scale feedback verification

### Agent Context Update

After Phase 1 design completion, run:
```bash
.specify/scripts/bash/update-agent-context.sh claude
```

This will update CLAUDE.md with new patterns learned from this feature (if any new insights beyond menu navigation patterns).

---

**Status**: Phase 0 research ready to begin. Awaiting codebase exploration to resolve all unknowns.

**Next Steps**:
1. Execute Phase 0 research tasks (codebase exploration + best practices)
2. Document findings in research.md
3. Proceed to Phase 1 design based on discovered architecture
4. Generate tasks.md via `/speckit.tasks` command (Phase 2)

---

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>
