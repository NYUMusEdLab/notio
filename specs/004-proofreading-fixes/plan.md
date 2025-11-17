# Implementation Plan: Notio Proofreading Fixes 2025

**Branch**: `004-proofreading-fixes` | **Date**: 2025-11-17 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/004-proofreading-fixes/spec.md`

## Summary

This plan addresses 7 correctness and quality issues identified in proofreading review:
1. Remove erroneous "m" extension in chromatic scales with flats when Extensions mode is enabled
2. Disable or hide relative (solfège) names for chromatic scales due to systematic naming errors
3. Fix staff line alignment discontinuity at Gb in extended Romance notation mode
4. Correct relative mode syllable names (LE, SE) for natural minor, harmonic minor, Phrygian, and Locrian scales
5. Fix minor blues scale to follow correct formula: 1 b3 4 #4 5 7
6. Fix video player text (typo correction, remove YouTube reference, uppercase URL consistently)
7. Increase video player instruction font size for better readability

**Technical approach**: Locate scale generation logic, notation rendering, and UI components; apply targeted fixes validated by integration tests; ensure no regressions in existing scale/notation functionality.

## Technical Context

**Language/Version**: JavaScript ES6+ with React 16.x (upgrading to React 18)
**Primary Dependencies**: React, VexFlow (music notation rendering), Tone.js (audio synthesis)
**Storage**: Browser localStorage for user preferences
**Testing**: Jest (integration/unit tests), Playwright (E2E tests)
**Target Platform**: Modern web browsers (Chrome, Firefox, Safari, Edge)
**Project Type**: Single-page web application
**Performance Goals**: Notation rendering <200ms, audio latency <50ms, 60fps UI
**Constraints**: Must maintain 100% backwards compatibility with existing scale data, preserve all accessibility features
**Scale/Scope**: ~30 scale types, ~12 root notes, 4 notation modes (Extensions, Relative, Romance, Extended)

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### I. Pragmatic Testing Strategy ✅ PASS

**Compliance**:
- All fixes will be validated with integration tests covering scale rendering + notation + user interaction
- E2E tests will verify complete user workflows (select scale → enable mode → verify display)
- Unit tests reserved for complex scale formula calculations (minor blues, solfège mappings)
- Target: 100% code coverage via 60% integration, 30% E2E, 10% unit tests

**Test Plan Summary**:
- Integration: Scale selection + notation rendering combinations (chromatic + Extensions, minor modes + Relative, etc.)
- E2E: Critical user journeys (teacher configures chromatic scale with extensions, student views natural minor in relative mode)
- Unit: Minor blues formula calculation, solfège syllable mapping logic

**Justification**: These fixes affect core educational accuracy. Integration tests ensure scale logic + rendering work together correctly. E2E tests validate the complete user experience matches spec screenshots.

### II. Component Reusability ✅ PASS

**Compliance**:
- Changes will be made to existing reusable components (Scale selector, Notation renderer, Video player)
- No new components needed - fixes are internal to existing architecture
- Component interfaces remain unchanged (no breaking API changes)

**Justification**: Leveraging existing component architecture. Scale rendering, notation display, and video player are already well-encapsulated components.

### III. Educational Pedagogy First ✅ PASS

**Compliance**:
- All fixes directly improve pedagogical accuracy (correct music theory notation, readable instructions)
- Fixes address teacher/student confusion identified in proofreading review
- User experience remains simple and clear - no added complexity

**Justification**: These fixes correct educational errors that could confuse music students. Accurate solfège syllables, correct blues scales, and readable instructions are essential for learning.

### IV. Performance & Responsiveness ✅ PASS

**Compliance**:
- Fixes involve logic corrections, not performance-sensitive code paths
- Font size increase in video player has negligible performance impact
- Staff line alignment fix is rendering-only (no audio latency impact)
- All changes maintain <200ms notation rendering requirement

**Justification**: No performance regressions expected. Changes are limited to display logic and don't affect audio synthesis or interaction latency.

### V. Integration-First Testing for Musical Features ✅ PASS

**Compliance**:
- Primary test strategy: Integration tests for scale + notation + mode combinations
- E2E tests for complete user workflows with screenshots validation
- Musical feature integration tested holistically (scale data → rendering → visual display)

**Test Coverage Strategy**:
- **Integration (60%)**: Test scale generation + notation rendering for all affected modes
  - Chromatic scales + Extensions mode → verify no "m"
  - Chromatic scales + Relative mode → verify disabled/hidden
  - Scales with Gb + Extended + Romance → verify aligned staff lines
  - Minor modes + Relative → verify correct syllable names
  - Minor blues all keys → verify correct note formulas
  - Video player component → verify text and font rendering

- **E2E (30%)**: Critical user journeys matching spec screenshots
  - User selects chromatic scale, enables Extensions, verifies display
  - User selects natural minor, enables Relative, verifies solfège names
  - User opens video player, verifies readable instructions

- **Unit (10%)**: Edge cases in scale formulas
  - Minor blues formula calculation for all 12 keys
  - Solfège syllable mapping for modal scales
  - Staff line positioning calculation for Gb

**Justification**: Musical notation depends on scale data + rendering logic working together. Integration tests catch bugs at component boundaries (e.g., scale model returns wrong data, renderer displays it incorrectly). E2E tests validate complete user experience.

### VI. Accessibility & Inclusive Design ✅ PASS

**Compliance**:
- Font size increase in video player improves readability (accessibility win)
- All fixes maintain keyboard navigation (no mouse-only interactions added)
- Notation fixes improve clarity for low-vision users (aligned staff lines, correct symbols)
- No color-only information added

**Justification**: Font size increase directly supports accessibility. Other fixes maintain existing accessibility features without regression.

### VII. Simplicity & Maintainability ✅ PASS

**Compliance**:
- Simplest solution for each fix:
  1. Filter out "m" extension for chromatic scales with flats
  2. Conditional disable/hide Relative checkbox for chromatic scales
  3. Adjust staff line rendering offset for Gb
  4. Update solfège syllable mapping table for minor modes
  5. Update minor blues interval formula
  6. Update video player text strings
  7. Update video player CSS font-size
- No new abstractions or dependencies needed
- No premature optimization - targeted fixes only

**Justification**: Each fix targets a specific bug with the minimal code change. No architectural changes or new frameworks introduced.

---

**Overall Constitution Compliance**: ✅ ALL PRINCIPLES PASS

**Gates Summary**:
- ✅ Testing strategy: Integration-first with 100% coverage
- ✅ No unnecessary complexity introduced
- ✅ Educational accuracy prioritized
- ✅ Accessibility maintained/improved
- ✅ Performance unaffected
- ✅ Existing component architecture leveraged

## Project Structure

### Documentation (this feature)

```text
specs/004-proofreading-fixes/
├── plan.md              # This file
├── research.md          # Phase 0: Investigation of scale logic, notation rendering
├── data-model.md        # Phase 1: Scale data structures, notation config
├── quickstart.md        # Phase 1: Testing procedures for each fix
├── contracts/           # Phase 1: Scale API contracts (if needed)
└── tasks.md             # Phase 2: Detailed implementation tasks
```

### Source Code (repository root)

```text
# Notio is a single-page React application
src/
├── components/
│   ├── keyboard/                # Musical keyboard display
│   ├── menu/                    # Top menu controls
│   │   ├── SubMenu.js          # Scale/mode selection menus
│   │   ├── Root.js             # Root note selector
│   │   └── VideoButton.js      # Video player trigger
│   ├── musicScore/              # Notation rendering
│   │   └── MusicalStaff.js     # Staff line rendering (Fix #3: Gb alignment)
│   └── OverlayPlugins/          # Overlay UI
│       └── Overlay.js          # Video player overlay (Fix #6, #7)
├── data/
│   ├── scales/                  # Scale definitions
│   │   ├── chromaticScales.js  # Fix #1: Remove "m" extension
│   │   ├── minorScales.js      # Fix #4: Solfège syllables
│   │   └── bluesScales.js      # Fix #5: Minor blues formula
│   └── notation/                # Notation configuration
│       ├── extensions.js       # Extensions mode logic
│       ├── relative.js         # Relative (solfège) mode logic (Fix #2, #4)
│       └── romance.js          # Romance notation config (Fix #3)
├── services/
│   ├── scaleService.js         # Scale generation logic
│   └── notationService.js      # Notation rendering orchestration
└── styles/
    └── overlay.scss            # Video player styles (Fix #7: font-size)

tests/
├── integration/
│   ├── scales/
│   │   ├── chromatic-extensions.test.js      # Fix #1
│   │   ├── chromatic-relative.test.js        # Fix #2
│   │   ├── minor-modes-relative.test.js      # Fix #4
│   │   └── minor-blues.test.js               # Fix #5
│   ├── notation/
│   │   └── staff-alignment-romance.test.js   # Fix #3
│   └── ui/
│       └── video-player.test.js              # Fix #6, #7
└── e2e/
    ├── chromatic-scales-workflow.spec.js     # User journey: chromatic + modes
    ├── minor-scales-workflow.spec.js         # User journey: minor modes + relative
    └── video-player-workflow.spec.js         # User journey: video player usage
```

**Structure Decision**: Notio uses a single-page React application structure with components organized by function (keyboard, menu, notation, overlays). Scale data is separated from rendering logic. Tests mirror source structure with integration/ and e2e/ directories. All 7 fixes map to specific existing files - no new top-level structure needed.

## Complexity Tracking

> **No violations - table omitted per template guidance**

All fixes comply with constitution principles. No complexity justifications needed.

---

## Next Steps

1. **Phase 0: Research & Investigation** → `research.md`
   - Locate scale generation code for chromatic, minor modes, blues
   - Identify notation rendering logic for Extensions, Relative, Romance modes
   - Find staff line rendering code for Gb alignment issue
   - Locate video player component and styling
   - Document current behavior and root causes for all 7 issues

2. **Phase 1: Design & Contracts** → `data-model.md`, `contracts/`, `quickstart.md`
   - Define scale data model changes (if any)
   - Document notation configuration updates
   - Create test scenarios for each fix (manual + automated)
   - Update agent context with findings

3. **Phase 2: Tasks Breakdown** → `tasks.md` (via `/speckit.tasks`)
   - Break down fixes into implementable tasks
   - Assign tasks to test categories (integration, E2E, unit)
   - Define acceptance criteria per task
   - Estimate complexity and dependencies
