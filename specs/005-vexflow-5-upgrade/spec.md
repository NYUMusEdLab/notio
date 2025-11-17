# Feature Specification: VexFlow 5.x Library Upgrade

**Feature Branch**: `005-vexflow-5-upgrade`
**Created**: 2025-11-17
**Status**: Draft
**Input**: Upgrade VexFlow from 4.0.3 to 5.x to fix staff line alignment issues at Gb in Extended + Romance notation mode. This is a major version upgrade with breaking changes including font loading system changes and API namespace changes (Vex.Flow → VexFlow). The upgrade should fix the visual discontinuity in staff lines at Gb noted in US3 of the proofreading document, and provide improved SVG rendering quality overall.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Fix Staff Line Alignment at Gb (Priority: P1)

When users enable Extended keyboard mode and Romance notation, then view a scale containing Gb, the staff lines should remain continuous and properly aligned without visual discontinuity or shifting at the Gb note position.

**Why this priority**: This is a visual quality bug that affects the professional appearance and educational credibility of the musical notation. Students and teachers expect consistent, professional-quality staff rendering. The issue is currently unfixable in VexFlow 4.0.3 but has been addressed in VexFlow 5.x with staff line rendering improvements.

**Independent Test**: Can be fully tested by selecting any scale containing Gb (e.g., Gb major, Db major), enabling both Extended mode and Romance notation, and visually verifying that staff lines remain continuous and properly aligned at the Gb note position.

**Acceptance Scenarios**:

1. **Given** Gb major scale is selected with Extended mode and Romance notation enabled, **When** viewing the musical staff, **Then** staff lines should be continuous without visual shifts at Gb
2. **Given** Db major scale (which contains Gb) is selected with Extended and Romance notation, **When** scrolling through all notes, **Then** staff lines should maintain consistent alignment throughout including at Gb
3. **Given** any scale containing Gb is displayed, **When** toggling Romance notation on/off, **Then** staff lines should remain properly aligned in both states

---

### User Story 2 - Maintain Existing Musical Notation Features (Priority: P1)

All existing musical notation rendering features that currently work with VexFlow 4.0.3 must continue to function correctly after upgrading to VexFlow 5.x, including note rendering, accidentals, clefs, time signatures, and staff positioning.

**Why this priority**: This is a non-regression requirement. The upgrade must not break any existing functionality that students and teachers rely on daily. All current features must continue to work to maintain educational continuity.

**Independent Test**: Can be tested by running the complete existing test suite and manually verifying all musical notation features work as expected across all scales, modes, and notation settings.

**Acceptance Scenarios**:

1. **Given** any scale is selected in any mode, **When** viewing the notation, **Then** all notes, accidentals, and staff elements should render correctly
2. **Given** different clef settings (treble, bass, tenor, alto), **When** notation is rendered, **Then** all clefs should display correctly with proper note positioning
3. **Given** extended keyboard mode is enabled, **When** viewing multiple octaves, **Then** ledger lines and staff positioning should be correct
4. **Given** Romance notation is enabled for any scale, **When** viewing note names, **Then** solfège syllables should display correctly aligned with notes

---

### User Story 3 - Improved Overall SVG Rendering Quality (Priority: P2)

Users should experience improved visual quality of all musical notation SVG rendering, including crisper staff lines, better anti-aliasing, and more precise positioning of musical elements.

**Why this priority**: This is a quality enhancement that improves the overall professional appearance of the notation but is secondary to fixing the Gb alignment bug and maintaining existing functionality.

**Independent Test**: Can be tested by visually comparing notation rendering before and after the upgrade across multiple scales and settings, looking for improvements in line clarity and element positioning.

**Acceptance Scenarios**:

1. **Given** any musical notation is displayed, **When** viewing staff lines, **Then** lines should appear crisp and clear without anti-aliasing artifacts
2. **Given** complex scales with many accidentals, **When** viewing notation, **Then** accidentals should be positioned precisely without overlap
3. **Given** notation is viewed at different zoom levels, **When** rendering updates, **Then** SVG elements should scale cleanly without distortion

---

### User Story 4 - Handle API Migration Transparently (Priority: P1)

The VexFlow API migration (namespace changes from Vex.Flow to VexFlow, font loading changes) must be handled internally in the codebase without affecting end users or requiring any changes to their workflow.

**Why this priority**: This is a technical requirement critical to the success of the upgrade. All breaking changes must be absorbed by the implementation so users see no disruption in their educational activities.

**Independent Test**: Can be tested by verifying that all VexFlow API calls in the codebase have been updated to use the new 5.x API, and that the application builds and runs without errors related to VexFlow.

**Acceptance Scenarios**:

1. **Given** the VexFlow 5.x upgrade is complete, **When** the application starts, **Then** all musical notation should load and render without console errors
2. **Given** any musical feature is used, **When** VexFlow rendering is triggered, **Then** the new API should be called correctly without errors
3. **Given** musical fonts are needed for rendering, **When** notation is displayed, **Then** fonts should load correctly via the new font loading system

---

### Edge Cases

- What happens when viewing scales with multiple accidentals (sharps and flats) in Extended + Romance mode?
- How does the system handle rapid switching between different notation modes that trigger VexFlow re-rendering?
- What happens if font loading fails or is delayed in the new VexFlow 5.x font system?
- How does the system perform when rendering complex musical notation with the new VexFlow 5.x engine?
- What happens when viewing edge cases like Cb and B# (special octave offset notes) with the new rendering engine?
- How does the system handle browser compatibility differences with VexFlow 5.x SVG rendering?

## Requirements *(mandatory)*

### Functional Requirements

**Library Upgrade:**
- **FR-001**: System MUST upgrade VexFlow library from version 4.0.3 to the latest stable 5.x release
- **FR-002**: System MUST update all VexFlow API calls to use the new 5.x namespace (VexFlow instead of Vex.Flow)
- **FR-003**: System MUST implement the new VexFlow 5.x font loading system correctly

**Staff Line Rendering:**
- **FR-004**: System MUST render staff lines continuously without visual discontinuity at Gb notes in Extended + Romance notation mode
- **FR-005**: System MUST maintain consistent staff line positioning across all note types and accidentals
- **FR-006**: System MUST render staff lines with proper stroke width to avoid anti-aliasing artifacts

**Non-Regression:**
- **FR-007**: System MUST maintain all existing musical notation rendering features without regression
- **FR-008**: System MUST render all clef types (treble, bass, tenor, alto) correctly with the new VexFlow version
- **FR-009**: System MUST render accidentals (sharps, flats, naturals) with correct positioning
- **FR-010**: System MUST maintain correct note positioning across all octaves in extended keyboard mode
- **FR-011**: System MUST render Romance notation (solfège syllables) correctly aligned with notes
- **FR-012**: System MUST handle special octave offset cases (Cb, B#) correctly with the new rendering engine

**Quality Improvements:**
- **FR-013**: System MUST render SVG musical notation with improved visual clarity compared to VexFlow 4.0.3
- **FR-014**: System MUST render musical elements with precise bounding box calculations to prevent overlapping

**Performance:**
- **FR-015**: Musical notation rendering MUST complete within 200ms for typical scales (per constitution)
- **FR-016**: Font loading MUST not block initial rendering or cause visible delays

**Browser Compatibility:**
- **FR-017**: System MUST render musical notation correctly across supported browsers (Chrome, Firefox, Safari, Edge)
- **FR-018**: System MUST handle browser-specific SVG rendering differences gracefully

### Key Entities

- **VexFlow Renderer**: Third-party library responsible for rendering musical notation as SVG elements
- **Musical Staff**: Visual representation of the five-line musical staff with notes, clefs, and accidentals
- **Font System**: VexFlow's music font system (Bravura, Petaluma, Gonville) used for rendering musical symbols
- **Notation Settings**: User configuration for display modes (Extended keyboard, Romance notation, clefs)
- **SVG Elements**: Scalable vector graphics components that compose the rendered musical notation

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Staff lines remain visually continuous at Gb notes in Extended + Romance notation mode with no visible discontinuity
- **SC-002**: All existing integration tests for musical notation continue to pass without modification
- **SC-003**: Visual regression testing shows no degradation in notation rendering quality across all scales and modes
- **SC-004**: Musical notation rendering completes within 200ms for typical scales (meeting constitutional performance requirement)
- **SC-005**: Application builds successfully with VexFlow 5.x and shows no VexFlow-related console errors
- **SC-006**: Manual testing of all notation features (clefs, accidentals, extended mode, Romance notation) shows correct rendering
- **SC-007**: Cross-browser testing confirms notation renders correctly in Chrome, Firefox, Safari, and Edge
- **SC-008**: Font loading completes successfully on initial page load without blocking rendering
