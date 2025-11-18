# Feature Specification: Piano Key Keyboard Navigation

**Feature Branch**: `001-piano-key-keyboard-navigation`
**Created**: 2025-01-16
**Status**: Draft
**Priority**: P1 (Critical - Core accessibility feature)

---

## Overview

Enable keyboard-only users to navigate to and play notes on the virtual piano keyboard using standard keyboard navigation patterns, while maintaining the application's critical performance requirement of <20ms keypress-to-sound latency.

**Current State**:
- ✅ Piano keyboard parent container exists and is focusable
- ✅ Arrow key navigation through keys works via parent
- ✅ Enter/Space keys trigger notes when keys are focused
- ✅ Computer keyboard shortcuts work (FGH... right hand, ZXCASDQWE left hand)
- ✅ Color parent synchronization exists for colorblind modes

**Remaining Work**:
- ⚠️ Enhance focus management and visual feedback
- ⚠️ Add out-of-scale audio feedback for educational purposes
- ⚠️ Ensure WCAG 2.1 Level AA compliance
- ⚠️ Add comprehensive test coverage
- ⚠️ Performance verification (<20ms latency maintained)

**Solution**: Enhance existing keyboard navigation implementation with improved focus management, out-of-scale audio feedback, and comprehensive accessibility testing.

---

## User Scenarios & Testing

### User Story 1 - Navigate to Piano Keyboard (Priority: P1) 🎯 MVP

A keyboard-only user can tab to the piano keyboard and see a clear focus indicator, enabling them to access the core piano-playing functionality without a mouse.

**Why this priority**: Without this, keyboard-only users cannot access the application's primary feature. This is a WCAG 2.1 Level A violation (SC 2.1.1 Keyboard).

**Independent Test**: User can Tab from menu buttons to piano keyboard container and see visible focus indicator. Screen reader announces "Piano keyboard, use arrow keys to select notes".

**Acceptance Scenarios**:

1. **Given** user is on the page, **When** user presses Tab repeatedly, **Then** piano keyboard container receives focus after menu buttons
2. **Given** piano keyboard has focus, **When** user observes the screen, **Then** a clear visual focus indicator is visible on the keyboard
3. **Given** piano keyboard receives focus, **When** screen reader is active, **Then** screen reader announces "Piano keyboard, use arrow keys to select notes"
4. **Given** piano keyboard container has focus, **When** user presses Tab again, **Then** focus moves to next focusable element (not individual keys)

**Design Constraint**: Piano keyboard container is a SINGLE tab stop (not 88 individual stops for each key).

---

### User Story 2 - Navigate Between Keys with Arrow Keys (Priority: P1) 🎯 MVP

A keyboard-only user can use arrow keys to move focus between piano keys, allowing them to select which note to play before activating it.

**Why this priority**: Navigation is required before activation. Without this, users cannot select specific notes to play.

**Independent Test**: With piano keyboard focused, user can press Arrow Right/Left to move focus through all keys chromat ically. Visual focus indicator moves with navigation. Screen reader announces each key name.

**Acceptance Scenarios**:

1. **Given** piano keyboard has focus, **When** user presses Arrow Right, **Then** focus moves to next key chromatically (C→C#→D→D#→E...)
2. **Given** piano keyboard has focus, **When** user presses Arrow Left, **Then** focus moves to previous key chromatically (E→D#→D→C#→C)
3. **Given** focus is on last key, **When** user presses Arrow Right, **Then** focus wraps to first key (circular)
4. **Given** focus is on first key, **When** user presses Arrow Left, **Then** focus wraps to last key (circular)
5. **Given** focus is on C4, **When** user presses Arrow Up, **Then** focus moves to C5 (same note, next octave)
6. **Given** focus is on C4, **When** user presses Arrow Down, **Then** focus moves to C3 (same note, previous octave)
7. **Given** focus is on any key, **When** user presses Home, **Then** focus jumps to first key (leftmost)
8. **Given** focus is on any key, **When** user presses End, **Then** focus jumps to last key (rightmost)
9. **Given** focus moves to new key, **When** user observes screen, **Then** visual focus indicator updates to show new focused key
10. **Given** focus moves to new key, **When** screen reader is active, **Then** screen reader announces key name (e.g., "C4", "D sharp 4")

**Performance Constraint**: Arrow key navigation response time <50ms.

---

### User Story 3 - Play Notes with Enter/Space (Priority: P1) 🎯 MVP

A keyboard-only user can press Enter or Space to play the currently focused piano key, hearing the note with the same latency as mouse clicks.

**Why this priority**: This is the core action - playing notes. Without this, navigation is meaningless.

**Independent Test**: With focus on a piano key, user presses Enter or Space and hears the note play immediately (<20ms latency). Focus remains on the same key.

**Acceptance Scenarios**:

1. **Given** piano key C4 has focus, **When** user presses Enter, **Then** C4 note plays with <20ms latency
2. **Given** piano key C4 has focus, **When** user presses Space, **Then** C4 note plays with <20ms latency
3. **Given** note plays via Enter, **When** user observes focus, **Then** focus remains on same key (C4)
4. **Given** note plays via Space, **When** user observes focus, **Then** focus remains on same key (C4)
5. **Given** user presses Space to play note, **When** page scrolls, **Then** Space key did NOT scroll page (preventDefault)
6. **Given** note plays, **When** screen reader is active, **Then** screen reader announces "Playing C4" (aria-live)
7. **Given** user plays note, **When** audio duration is measured, **Then** note plays for same duration as mouse click

**Critical Performance Constraint**: Keypress-to-sound latency MUST be <20ms (target: <10ms). NO degradation from current master branch.

---

### User Story 4 - Computer Keyboard Piano Compatibility (Priority: P2)

A user who plays notes using computer keyboard shortcuts (A-Z keys) can continue using that feature even when piano keyboard container has focus.

**Why this priority**: Preserves existing power-user workflow. Secondary to basic accessibility, but important for user experience continuity.

**Independent Test**: With piano keyboard focused, user presses A-Z keys and notes play with <20ms latency. Arrow keys navigate, A-Z keys play notes - no conflicts.

**Acceptance Scenarios**:

1. **Given** piano keyboard has focus, **When** user presses 'A' key, **Then** corresponding note plays (not navigation)
2. **Given** piano keyboard has focus, **When** user presses 'S', 'D', 'F' keys, **Then** corresponding notes play
3. **Given** piano keyboard has focus, **When** user presses Arrow Right, **Then** focus navigates (does NOT play note)
4. **Given** A-Z key is pressed, **When** audio latency is measured, **Then** latency is still <20ms (no performance degradation)
5. **Given** both A-Z and navigation keys are used, **When** user plays notes, **Then** no key binding conflicts occur

---

### User Story 5 - Color Key Parent Interaction (Priority: P3)

When color key parent element is visible, it receives focus simultaneously with piano keyboard, maintaining the design constraint of simultaneous navigation.

**Why this priority**: Maintains consistent navigation model for colorblind mode users. Lower priority as it's an enhancement mode.

**Independent Test**: With color key parent visible, tabbing to piano keyboard also highlights color parent. Both elements respond to same keyboard navigation.

**Acceptance Scenarios**:

1. **Given** color key parent is visible, **When** user tabs to piano keyboard, **Then** both piano keyboard AND color parent receive focus
2. **Given** both have focus, **When** user presses Arrow Right, **Then** both elements navigate to next key
3. **Given** both have focus, **When** user presses Enter, **Then** note plays from piano keyboard
4. **Given** color mode is active, **When** user navigates, **Then** color parent updates to match focused key

---

### User Story 6 - Out-of-Scale Audio Feedback (Priority: P2)

When a user activates a piano key that is NOT in the currently selected scale, they hear a distinct audio cue indicating the note is out of scale, helping them learn scale patterns.

**Why this priority**: Educational feature that helps users learn scales by providing immediate audio feedback. Important for music education app, but secondary to core accessibility.

**Independent Test**: Select a scale (e.g., C Major), navigate to a note outside the scale (e.g., F#), press Enter/Space, hear distinct "out-of-scale" audio cue instead of or in addition to the note.

**Acceptance Scenarios**:

1. **Given** C Major scale is selected, **When** user activates F# (not in scale), **Then** out-of-scale audio cue plays
2. **Given** C Major scale is selected, **When** user activates C (in scale), **Then** normal note plays (no out-of-scale cue)
3. **Given** out-of-scale cue plays, **When** latency is measured, **Then** latency is still <20ms (no performance degradation)
4. **Given** out-of-scale key activated, **When** screen reader is active, **Then** screen reader announces "F sharp 4 - not in scale" (optional enhancement)
5. **Given** user plays out-of-scale note, **When** audio is heard, **Then** distinct cue is clearly different from in-scale notes (e.g., muted tone, click, brief dissonant sound)

**Design Considerations**:
- Audio cue should be non-intrusive but noticeable
- Should not interfere with learning or musical flow
- Could be toggleable in settings (future enhancement)

---

### Edge Cases

- **Octave Navigation at Boundaries**: Arrow Up on C8 (highest note) → stays on C8 (no wrap). Arrow Down on C0 (lowest note) → stays on C0.
- **Rapid Enter/Space Presses**: Each press triggers note independently (no debouncing). Audio system handles polyphony.
- **Focus Loss and Recovery**: User clicks outside keyboard → focus state preserved internally → Tab back returns to last focused key.
- **Screen Reader Virtual Cursor**: Screen reader user browses with virtual cursor → each key announced correctly → activation via screen reader commands works.
- **Chromatic Wrapping**: Arrow Right on last key (C8) → wraps to first key (C0). Arrow Left on first key → wraps to last key.
- **Missing Octave**: Arrow Up from G#7 (if C8 doesn't exist) → stays on G#7 or jumps to C8.

---

### Testing Strategy

**Integration Test Focus** (60-70%):
- Tab navigation to piano keyboard container
- Arrow Right/Left chromatic navigation through all keys
- Arrow Up/Down octave navigation
- Home/End boundary jumps
- Circular wrapping at edges
- Enter/Space activation with latency measurement
- A-Z key compatibility (no conflicts)
- Focus indicator visibility
- jest-axe accessibility audit (no violations)

**E2E Test Focus** (20-30%):
- Complete keyboard-only workflow: Tab → Navigate → Activate
- Cross-browser piano navigation (Chrome, Firefox, Safari)
- Screen reader announcements (accessibility tree validation)
- Performance measurement (keypress-to-sound latency)
- Visual regression testing (focus indicators)

**Unit Test Focus** (10-20%):
- Navigation logic edge cases (first to last wrap, last to first wrap)
- Octave calculation algorithm (C4 → C5, edge cases)
- Focus index boundary conditions (0, max, negative)
- Key mapping algorithm (index → note name)

---

## Requirements

### Functional Requirements

- **FR-001**: Piano keyboard container MUST be focusable via Tab key in natural tab order after menu buttons
- **FR-002**: Piano keyboard container MUST be a SINGLE tab stop (NOT individual tab stops for each key)
- **FR-003**: Arrow Right MUST move focus to next key chromatically (C→C#→D→D#...)
- **FR-004**: Arrow Left MUST move focus to previous key chromatically (reverse)
- **FR-005**: Arrow Up MUST move focus to same note in next octave (C4→C5)
- **FR-006**: Arrow Down MUST move focus to same note in previous octave (C5→C4)
- **FR-007**: Home key MUST move focus to first piano key (leftmost - A0)
- **FR-008**: End key MUST move focus to last piano key (rightmost - C8)
- **FR-009**: Circular wrapping MUST occur at horizontal boundaries (last→first, first→last for Arrow Left/Right)
- **FR-010**: Enter key MUST play currently focused note
- **FR-011**: Space key MUST play currently focused note
- **FR-012**: Space key MUST preventDefault to avoid page scroll
- **FR-013**: Focus MUST remain on same key after Enter/Space activation
- **FR-014**: Computer keyboard shortcuts (FGH... right hand, ZXCASDQWE left hand) MUST continue to work
- **FR-015**: Navigation keys (arrows, Home, End) MUST NOT trigger note playback
- **FR-016**: Visual focus indicator MUST be clearly visible on focused key
- **FR-017**: Screen reader MUST announce "Piano keyboard, use arrow keys to select notes" when container receives focus
- **FR-018**: Screen reader MUST announce each key name when focus moves (e.g., "C4", "D sharp 4")
- **FR-019**: ARIA live region MUST announce "Playing [note]" when note is activated
- **FR-020**: Out-of-scale audio cue MUST play when user activates key not in current scale
- **FR-021**: Out-of-scale audio cue MUST be distinctly different from normal note sound
- **FR-022**: Scale detection MUST determine if focused key is in currently selected scale
- **FR-023**: Existing navigation functionality MUST be preserved (arrow keys already work via piano parent)

### Non-Functional Requirements

- **NFR-001**: Keypress-to-sound latency MUST be <20ms (target: <10ms) - **CRITICAL**
- **NFR-002**: NO performance degradation from current master branch
- **NFR-003**: Arrow key navigation response time MUST be <50ms
- **NFR-004**: Focus indicator transition MUST be smooth (<16ms for 60fps)
- **NFR-005**: Implementation MUST pass WCAG 2.1 Level AA keyboard accessibility (SC 2.1.1, SC 2.1.3)
- **NFR-006**: Implementation MUST follow WAI-ARIA Authoring Practices 1.2
- **NFR-007**: Implementation MUST be tested with VoiceOver (macOS), NVDA (Windows), JAWS (Windows)
- **NFR-008**: Implementation MUST work in Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- **NFR-009**: Test suite MUST achieve 100% code coverage (60-70% integration, 20-30% E2E, 10-20% unit)

### Key Entities

- **Piano Keyboard Container**: Focusable parent container element wrapping all piano keys (role="application", tabIndex={0}) - **ALREADY EXISTS**
- **Piano Key**: Individual key element (white/black), programmatically focusable (tabIndex={-1}), has note data
- **Focus State**: Tracks currently focused key index (0-87 for 88-key piano: A0-C8) and whether keyboard is active
- **Audio Playback System**: Web Audio API system that plays notes - **ALREADY IMPLEMENTED**
- **Scale State**: Current selected scale (e.g., C Major, D Minor) - **ALREADY EXISTS**
- **Out-of-Scale Audio Cue**: Distinct audio feedback (muted tone, click, or brief dissonant sound) for keys outside current scale
- **Color Key Parent**: Visual element that mirrors piano keyboard focus for colorblind mode - **ALREADY EXISTS**
- **Computer Keyboard Mapping**: FGH... (right hand), ZXCASDQWE (left hand) shortcuts - **ALREADY IMPLEMENTED**

### Technical Constraints

- **TC-001**: Use roving tabIndex pattern (container tabIndex={0}, keys tabIndex={-1})
- **TC-002**: ✅ **RESOLVED - Use state + refs hybrid (Option B)**: Use `focusedKeyIndex` state + `keyRefs.current[index].focus()` for programmatic focus management
- **TC-003**: Use `role="application"` for piano keyboard container (custom keyboard handling)
- **TC-004**: Each key has `role="button"` for screen reader semantics
- **TC-005**: ✅ **UPDATED**: Accept re-renders on navigation for color parent sync, monitor via performance testing to ensure <50ms response time
- **TC-006**: Profile with Performance API to measure latency (both keypress-to-sound and navigation response)
- **TC-007**: Regression test against master branch for performance (NO degradation allowed)
- **TC-008**: Preserve existing piano parent navigation implementation (arrow keys already work)
- **TC-009**: Preserve existing Enter/Space activation implementation (already triggers notes)
- **TC-010**: Preserve existing computer keyboard shortcuts (FGH..., ZXCASDQWE already work)
- **TC-011**: Integrate with existing scale detection logic to determine out-of-scale keys

---

## Success Criteria

### Measurable Outcomes

- **SC-001**: Keyboard-only users can navigate to piano keyboard container via Tab (100% success rate)
- **SC-002**: Users can navigate all 88 keys (A0-C8) using arrow keys (100% coverage)
- **SC-003**: Keypress-to-sound latency <20ms for both in-scale and out-of-scale notes (measured via Performance API)
- **SC-004**: Arrow key navigation response <50ms (measured, including with state updates)
- **SC-005**: 0 WCAG 2.1 Level A/AA violations for keyboard accessibility
- **SC-006**: 100% of integration tests pass (jest-axe shows no violations)
- **SC-007**: 100% of E2E tests pass (Playwright + @axe-core/playwright)
- **SC-008**: Screen readers (VoiceOver, NVDA, JAWS) announce all keys correctly
- **SC-009**: No user-reported performance degradation from master branch
- **SC-010**: All 8 skipped E2E tests can be re-enabled and pass
- **SC-011**: Out-of-scale audio feedback is clearly distinguishable from in-scale notes (user testing)
- **SC-012**: Existing computer keyboard shortcuts (FGH..., ZXCASDQWE) continue to work with NO conflicts
- **SC-013**: Color parent synchronization works correctly in all colorblind modes (1-9)

---

## Out of Scope

The following are explicitly NOT part of this feature:

1. **Individual tab stops for each piano key** - Would create poor UX with 88 tab stops
2. **MIDI keyboard hardware support** - Separate feature requiring hardware integration
3. **Touch gesture navigation** - Mobile/tablet feature, separate specification
4. **Custom keybinding configuration** - Power user feature, future enhancement
5. **Visual keyboard shortcuts display** - UI feature, separate work
6. **Audio polyphony control** - Music theory feature, out of scope
7. **Sustain pedal simulation** - Advanced music feature, future work
8. **Alternative tuning systems** - Music theory feature, separate spec

---

## Dependencies

### Existing Features (To Be Explored)
- ✅ Piano keyboard rendering (already implemented)
- ✅ Piano keyboard parent container with arrow navigation (already implemented)
- ✅ Web Audio API playback system (already implemented)
- ✅ Computer keyboard shortcut system - FGH... right hand, ZXCASDQWE left hand (already implemented)
- ✅ Enter/Space activation of focused keys (already implemented)
- ✅ Color parent synchronization for colorblind modes (already implemented)
- ✅ Scale state management - current selected scale (already implemented)
- ✅ Menu navigation (feature 003-menu-arrow-navigation - completed)
- Focus management patterns from menu navigation

**Codebase Exploration Needed**:
1. Locate piano keyboard parent container component (likely in src/components/)
2. Find existing arrow key navigation implementation
3. Locate Enter/Space activation handlers
4. Find computer keyboard shortcut mapping (FGH..., ZXCASDQWE)
5. Locate scale state and scale detection logic
6. Find color parent component and synchronization logic
7. Understand Web Audio API integration for note playback

### External Libraries
- React 18.2.0
- React Testing Library (@testing-library/react ^13.0.0)
- jest-axe (for accessibility integration tests)
- Playwright (@playwright/test) + @axe-core/playwright (for E2E)
- Performance API (browser built-in)

### Browser APIs
- KeyboardEvent API (event.key)
- HTMLElement.focus() (programmatic focus)
- Web Audio API (already in use)
- ARIA (roles, labels, live regions)

---

## Risks & Mitigations

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| Performance degradation | Medium | Critical | Profile early, use refs (not state), regression test vs master |
| Screen reader compatibility | Medium | High | Test with VoiceOver/NVDA/JAWS early, follow WAI-ARIA exactly |
| Keyboard shortcut conflicts | Low | Medium | Integration tests for A-Z + navigation, careful event handling |
| Complex focus management bugs | High | Medium | Comprehensive integration tests, unit test navigation logic |
| Browser inconsistencies | Low | Medium | Cross-browser E2E tests, use standard ARIA patterns |

---

## Clarified Decisions

[RESOLVED: These questions have been clarified with stakeholder]

1. **State Management Approach**: ✅ **Option B - State + Refs Hybrid**
   - Use `focusedKeyIndex` state for tracking (enables color parent sync)
   - Use `setFocusedKeyIndex` + `keyRefs.current[newIndex].focus()`
   - Accept re-renders on navigation (monitored via performance testing)
   - Rationale: Enables simultaneous navigation with color parent, easier to test

2. **Existing Functionality to Preserve**:
   - ✅ Piano keyboard parent container already exists and is focusable
   - ✅ Enter/Space already trigger notes when keys are focused
   - ✅ Computer keyboard shortcuts already work (FGH... for right hand, ZXCASDQWE for left hand)
   - ✅ Navigation via arrow keys through piano parent already implemented

3. **Out-of-Scale Audio Feedback**: ✅ **NEW REQUIREMENT**
   - When user navigates to a key NOT in the current scale and activates it (Enter/Space)
   - Play a distinct audio cue indicating "this note is not in the scale"
   - Different sound from the actual note (e.g., muted tone, click, or brief dissonant sound)
   - Visual feedback optional (could use different color/opacity for out-of-scale keys)

4. **Octave Boundaries**: ✅ **Stay on current key**
   - Arrow Up on C8 (highest note) → stays on C8 (no wrap)
   - Arrow Down on C0 (lowest note) → stays on C0 (no wrap)

5. **Visual Focus Indicator**: ✅ **Browser default outline**
   - Use browser default (accessibility best practice)
   - No custom CSS outline removal

6. **Sustained Notes**: ✅ **Yes, if current mouse behavior supports it**
   - Holding Enter/Space should sustain note if mouse click does the same

7. **ARIA Role**: ✅ **role="application"**
   - Piano keyboard container uses `role="application"`
   - Indicates custom keyboard handling to screen readers

8. **Color Parent Simultaneous Focus**: ✅ **Shared state synchronization**
   - Piano keyboard and color parent share same `focusedKeyIndex` state
   - Both respond to same arrow key events
   - Sync implemented via shared state (Option B enables this)

9. **Piano Keyboard Range**: ✅ **Standard 88-key piano (A0-C8)**
   - Index 0-87 (88 keys total)
   - Starts at A0, ends at C8

---

## Implementation Notes

### Recommended Architecture

```javascript
// Piano Keyboard Container
const PianoKeyboard = () => {
  const [focusedKeyIndex, setFocusedKeyIndex] = useState(0);
  const keyRefs = useRef([]);
  const containerRef = useRef();

  const handleKeyDown = (event) => {
    switch (event.key) {
      case 'ArrowRight':
        navigateToKey((focusedKeyIndex + 1) % totalKeys);
        break;
      case 'ArrowLeft':
        navigateToKey((focusedKeyIndex - 1 + totalKeys) % totalKeys);
        break;
      case 'ArrowUp':
        navigateToNextOctave();
        break;
      case 'ArrowDown':
        navigateToPreviousOctave();
        break;
      case 'Home':
        navigateToKey(0);
        break;
      case 'End':
        navigateToKey(totalKeys - 1);
        break;
      case 'Enter':
      case ' ':
        event.preventDefault();
        playNote(focusedKeyIndex);
        break;
      default:
        // Let A-Z keys propagate for keyboard piano
        break;
    }
  };

  const navigateToKey = (newIndex) => {
    setFocusedKeyIndex(newIndex);
    keyRefs.current[newIndex]?.focus();
  };

  return (
    <div
      ref={containerRef}
      role="application"
      tabIndex={0}
      aria-label="Piano keyboard, use arrow keys to select notes"
      onKeyDown={handleKeyDown}
      className="piano-keyboard"
    >
      {keys.map((key, index) => (
        <PianoKey
          key={key.id}
          ref={el => keyRefs.current[index] = el}
          note={key}
          tabIndex={-1}
          isFocused={index === focusedKeyIndex}
        />
      ))}
    </div>
  );
};
```

---

**Last Updated**: 2025-01-16
**Next Step**: Run `/speckit.clarify` to resolve open questions

---

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>
