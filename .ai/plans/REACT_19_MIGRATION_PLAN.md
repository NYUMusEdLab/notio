# NOTIO REACT 19 MIGRATION PLAN
## Comprehensive Phased Implementation Strategy

**Document Version:** 1.0
**Created:** 2025-11-11
**Status:** Pending Approval
**Total Duration:** 10-12 weeks (3 months)

---

## EXECUTIVE SUMMARY

This migration plan addresses upgrading Notio from React 18.2.0 to React 19.2.0 and updating 9 major dependencies. The plan prioritizes **zero regression** through comprehensive test coverage before any dependency changes. The codebase has 26 class components, 496-line state management, global module state issues, and only 5 test files - all critical blockers that must be resolved first.

**Total Estimated Duration:** 8-12 weeks
**Risk Level:** High (reduces to Medium after Phase 1 completion)
**Critical Success Factor:** Do NOT proceed past Phase 1 until test coverage reaches 80%

---

## TABLE OF CONTENTS

1. [Dependencies to Update](#dependencies-to-update)
2. [Phase 1: Test Safety Net (Weeks 1-4)](#phase-1-establish-test-safety-net-weeks-1-4)
3. [Phase 2: Refactor for Compatibility (Weeks 5-7)](#phase-2-refactor-for-compatibility-weeks-5-7)
4. [Phase 3: Incremental Dependency Updates (Weeks 8-9)](#phase-3-incremental-dependency-updates-weeks-8-9)
5. [Phase 4: React 18 → 19 Migration (Week 10)](#phase-4-react-18--19-migration-week-10)
6. [Phase 5: React Router 6 → 7 Migration (Week 11)](#phase-5-react-router-6--7-migration-week-11)
7. [Phase 6: Validation & Optimization (Week 12)](#phase-6-validation--optimization-week-12)
8. [Final Deployment Checklist](#final-deployment-checklist)
9. [Rollback Strategy](#rollback-strategy)

---

## DEPENDENCIES TO UPDATE

### Major Version Bumps Required:
- **React:** 18.2.0 → 19.2.0
- **React DOM:** 18.2.0 → 19.2.0
- **React Router DOM:** 6.3.0 → 7.9.5
- **Firebase:** 9.9.4 → 12.5.0
- **VexFlow:** 4.0.3 → 5.0.0
- **Tone.js:** 14.7.77 → 15.1.22
- **react-tooltip:** 4.2.21 → 5.30.0
- **webmidi:** 2.0.0 → 3.1.14
- **react-player:** 2.10.1 → 3.3.3

### Current Codebase Blockers:
1. 25 class components (React 19 favors hooks, Router 7 requires functional components)
2. Only 5 test files exist (insufficient coverage for safe migration)
3. WholeApp.js has 496 lines with 27 state properties
4. Global module state in Keyboard.js (memory leak risk)
5. No PropTypes or TypeScript (type safety needed for migration)

---

## PHASE 1: ESTABLISH TEST SAFETY NET (WEEKS 1-4)

**Goal:** Create comprehensive test coverage to enable safe refactoring and migration

**Prerequisites:** None - this is the foundation

**Risk Level:** Low
**Estimated Duration:** 3-4 weeks

### Step 1.1: Set Up Testing Infrastructure (Days 1-2)

**Commands to run:**
```bash
# Install additional testing dependencies
npm install --save-dev @testing-library/react-hooks
npm install --save-dev jest-canvas-mock
npm install --save-dev jest-webgl-canvas-mock
npm install --save-dev resize-observer-polyfill

# Create test coverage script
npm pkg set scripts.test:coverage="react-scripts test --coverage --watchAll=false --transformIgnorePatterns \"node_modules/(?!(vexflow|gsap)/)\""
```

**Files to modify:**
- `package.json` - Add coverage thresholds

**Testing strategy:**
```bash
# Run to verify setup
npm run test:coverage
```

**Success criteria:**
- Coverage report generates successfully
- All existing 5 tests still pass

**Rollback plan:** Git revert the package.json changes

**Human review checkpoint:** Verify coverage report shows current baseline (likely <20%)

---

### Step 1.2: Document Current Functionality as Acceptance Criteria (Days 2-3)

**Create file:** `ACCEPTANCE_CRITERIA.md`

**Manual testing checklist to document:**

1. **Keyboard Input**
   - QWERTY keys F-G-H-J-K-L-; play notes
   - Extended keyboard (A-S-D-F-G-H-J-K-L-;-'-[) works
   - Left hand keys (Z-X-C-A-S-D-Q-W-E) play correct scale tones
   - Arrow up/down changes octave distribution
   - Number keys 1-9 change color schemes

2. **Musical Functionality**
   - Scale selection changes available notes
   - Root note selection transposes correctly
   - Custom scale creation works
   - Clef changes update notation (treble, bass, alto, tenor)
   - Notation toggles (Colors, English, German, Romance, Relative, Scale Steps, Chord extensions)

3. **Audio**
   - Piano sounds play and release correctly
   - Sound changes (different instruments via dropdown)
   - No audio context errors in console
   - No memory leaks after extended playing

4. **Visual Rendering**
   - VexFlow staff notation displays correctly
   - Piano keys highlight on press
   - Color coding matches selected scale tones
   - Extended keyboard toggle shows/hides extra keys

5. **Firebase Session Sharing**
   - Share button creates session URL
   - Shared URL loads session correctly
   - All settings restore from session

6. **Mobile Block**
   - Mobile devices show "no mobile support" popup
   - Desktop allows full functionality

**Human review checkpoint:** Manual testing session to verify all features work, document screenshots

---

### Step 1.3: Create Unit Tests for MusicScale (Days 3-5)

**Create file:** `src/__test__/MusicScale.comprehensive.test.js`

**Key test cases needed:**
```javascript
describe('MusicScale', () => {
  // Constructor tests
  test('creates scale with default parameters')
  test('creates scale with custom root notes (all 12)')
  test('creates major scale correctly')
  test('creates minor scale correctly')
  test('creates chromatic scale')
  test('creates pentatonic scale')

  // Notation tests
  test('generates English notation correctly')
  test('generates German notation (H instead of B)')
  test('generates Romance notation (Do-Re-Mi)')
  test('generates Relative notation')
  test('generates Scale Steps notation')
  test('generates Chord extensions notation')

  // Edge cases
  test('handles double sharps (##)')
  test('handles double flats (bb)')
  test('handles Cb (displays as B)')
  test('handles B# (displays as C)')

  // Extended scale tests
  test('BuildExtendedScaleSteps with ambitus 24')
  test('BuildExtendedScaleSteps with ambitus 13')
  test('BuildExtendedScaleSteps with startingFromStep 7')

  // Transposition tests
  test('transposes from C to F# correctly')
  test('transposes from C to Db correctly')

  // MIDI numbering
  test('MakeMidinumbering returns correct MIDI notes')

  // Helper functions
  test('noteNameToIndex converts correctly')
  test('addAccidental handles multiple sharps')
  test('addAccidental handles multiple flats')
  test('convertDoubleAccidental works correctly')
})
```

**Commands to run:**
```bash
npm test MusicScale.comprehensive.test.js
npm run test:coverage -- --collectCoverageFrom="src/Model/MusicScale.js"
```

**Success criteria:**
- [ ] MusicScale.js has >90% coverage
- [ ] All 12 root notes tested
- [ ] All notation systems tested
- [ ] Edge cases for accidentals covered

**Rollback plan:** Delete test file if blocking development

**Human review checkpoint:** Review test output, verify no false positives

---

### Step 1.4: Create Unit Tests for WholeApp State Management (Days 5-7)

**Create file:** `src/__test__/WholeApp.state.test.js`

**Key test cases needed:**
```javascript
describe('WholeApp State Management', () => {
  // State initialization
  test('initializes with default state values')
  test('initializes with sessionId from props')

  // Octave handlers
  test('handleClickOctave minus decreases octave')
  test('handleClickOctave plus increases octave')
  test('handleClickOctave respects min/max bounds (1-8)')
  test('handleClickOctave ArrowDown decreases octaveDist')
  test('handleClickOctave ArrowUp increases octaveDist')

  // Scale handlers
  test('handleSelectScale updates scale and scaleObject')
  test('handleChangeCustomScale adds new scale to scaleList')
  test('handleChangeCustomScale prevents duplicate scale names')

  // Notation handlers
  test('handleChangeNotation updates notation array')
  test('handleSelectClef updates clef and trebleStaffOn')
  test('handleChangeRoot updates baseNote')
  test('handleChangeRoot converts HB to Bb')
  test('handleChangeRoot converts H to B')

  // Toggle handlers
  test('togglePiano toggles pianoOn')
  test('toggleExtendedKeyboard toggles extendedKeyboard')
  test('toggleStaff toggles trebleStaffOn')
  test('toggleShowOffNotes toggles showOffNotes')

  // Video handlers
  test('handleChangeVideoUrl updates videoUrl and activates video')
  test('handleResetVideoUrl resets to resetVideoUrl')
  test('handleChangeVideoVisibility toggles videoActive')
  test('handleChangeActiveVideoTab updates activeVideoTab')

  // Tooltip handlers
  test('handleChangeTooltip toggles showTooltip')
  test('handleChangeTooltip shows all tooltips when enabled')
  test('handleChangeTooltip hides all tooltips when disabled')
  test('setRef stores refs for all menu items')

  // Theme handlers
  test('handleSelectTheme updates theme')
  test('handleChangeSound updates instrumentSound')
})
```

**Create file:** `src/__test__/WholeApp.firebase.test.js`

**Key test cases needed:**
```javascript
describe('WholeApp Firebase Integration', () => {
  // Mock Firebase
  beforeEach(() => {
    // Setup Firebase mocks
  })

  test('saveSessionToDB creates session document')
  test('saveSessionToDB returns document ID')
  test('saveSessionToDB handles errors gracefully')
  test('openSavedSession loads session data')
  test('openSavedSession handles missing session gracefully')
  test('openSavedSession sets loading to false')
  test('openSavedSession calls handleChangeCustomScale for custom scales')
})
```

**Commands to run:**
```bash
npm test WholeApp.state.test.js
npm test WholeApp.firebase.test.js
npm run test:coverage -- --collectCoverageFrom="src/WholeApp.js"
```

**Success criteria:**
- [ ] WholeApp.js has >75% coverage
- [ ] All 27 state properties tested
- [ ] All handler functions tested
- [ ] Firebase integration tested with mocks

**Human review checkpoint:** Verify state transitions match documented behavior

---

### Step 1.5: Create Integration Tests for Keyboard Component (Days 7-10)

**Create file:** `src/__test__/Keyboard.integration.test.js`

**Key test cases needed:**
```javascript
describe('Keyboard Component Integration', () => {
  // Rendering tests
  test('renders 13 keys for standard keyboard')
  test('renders 24 keys for extended keyboard')
  test('renders keys with correct colors from scale')
  test('renders only scale tones as playable')
  test('grays out non-scale tones')

  // Key press simulation
  test('KeyF triggers first scale tone')
  test('KeyG triggers second scale tone')
  test('pressing multiple keys plays multiple notes')
  test('releasing key stops note')
  test('key repeat prevention works')

  // Left hand keys
  test('KeyZ plays correct scale tone')
  test('KeyC plays correct scale tone')
  test('left hand keys respect octaveDist')

  // Mouse interaction
  test('mouse down on key plays note')
  test('mouse up stops note')
  test('mouse drag over keys plays notes')

  // Scale changes
  test('changing scale updates playable keys')
  test('changing root note transposes keyboard')
  test('changing to extended keyboard adds keys')

  // Sound engine integration
  test('SoundMaker.startSound called on key press')
  test('SoundMaker.stopSound called on key release')
  test('instrument change creates new SoundMaker instance')

  // Audio context
  test('audio context resumes on first interaction')
  test('getState returns "running" after resume')

  // Edge cases
  test('handles double accidentals in note names')
  test('convertDoubleAccidental converts correctly')
  test('no memory leaks with module-level variables')
})
```

**Commands to run:**
```bash
npm test Keyboard.integration.test.js
npm run test:coverage -- --collectCoverageFrom="src/components/keyboard/Keyboard.js"
```

**Success criteria:**
- [ ] Keyboard.js has >70% coverage
- [ ] All keycodes tested
- [ ] Scale integration tested
- [ ] Sound engine integration tested
- [ ] Memory leak test passes

**Rollback plan:** Document issues blocking testing for Phase 2 refactor

**Human review checkpoint:** Manual keyboard testing to verify tests match reality

---

### Step 1.6: Create Visual Regression Tests for VexFlow (Days 10-12)

**Install visual testing tools:**
```bash
npm install --save-dev jest-image-snapshot
npm install --save-dev canvas
```

**Create file:** `src/__test__/MusicalStaff.visual.test.js`

**Key test cases needed:**
```javascript
describe('MusicalStaff Visual Regression', () => {
  test('renders treble clef staff correctly')
  test('renders bass clef staff correctly')
  test('renders alto clef staff correctly')
  test('renders tenor clef staff correctly')

  test('renders C note on staff')
  test('renders C# note with sharp')
  test('renders Db note with flat')
  test('renders notes with double sharps')
  test('renders notes with double flats')

  test('renders notes in different octaves')
  test('staff sizing is consistent')
  test('no clipping or overflow')
})
```

**Testing strategy:**
- Generate baseline images
- Compare future renders to baseline
- Store snapshots in `src/__test__/__image_snapshots__/`

**Commands to run:**
```bash
npm test MusicalStaff.visual.test.js -- -u  # Generate baselines
npm test MusicalStaff.visual.test.js        # Compare to baselines
```

**Success criteria:**
- [ ] Baseline images generated for all clefs
- [ ] Visual regression tests pass
- [ ] Staff rendering verified correct

**Human review checkpoint:** Manual review of generated baseline images

---

### Step 1.7: Create End-to-End User Flow Tests (Days 12-15)

**Create file:** `src/__test__/E2E.userflows.test.js`

**Key user flows to test:**
```javascript
describe('End-to-End User Flows', () => {
  test('Complete workflow: Load app -> Select scale -> Play notes -> Share session', async () => {
    // 1. App loads with default state
    // 2. User selects "Minor (Aeolian)" scale
    // 3. User selects "D" as root
    // 4. User presses keys and hears notes
    // 5. User clicks share button
    // 6. Session URL is generated
  })

  test('Custom scale creation flow', async () => {
    // 1. User opens custom scale menu
    // 2. User enters scale name "MyScale"
    // 3. User selects steps [0,2,3,5,7,9,10]
    // 4. User clicks create
    // 5. New scale appears in scale list
    // 6. Keyboard updates with new scale
  })

  test('Session sharing flow', async () => {
    // 1. User configures app (scale, root, octave, etc.)
    // 2. User clicks share
    // 3. Session saves to Firebase
    // 4. Copy session URL
    // 5. Navigate to session URL
    // 6. All settings restore correctly
  })

  test('Extended keyboard workflow', async () => {
    // 1. Toggle extended keyboard on
    // 2. Verify 24 keys render
    // 3. Play notes on extended range
    // 4. Toggle back off
    // 5. Verify 13 keys render
  })

  test('Notation system changes', async () => {
    // 1. Toggle English notation
    // 2. Verify English note names show
    // 3. Toggle German notation
    // 4. Verify H instead of B
    // 5. Toggle Romance notation
    // 6. Verify Do-Re-Mi
  })
})
```

**Commands to run:**
```bash
npm test E2E.userflows.test.js
```

**Success criteria:**
- [ ] All 5 user flows pass
- [ ] Flows cover critical paths
- [ ] Firebase mocking works correctly

**Human review checkpoint:** Verify flows match actual user behavior

---

### Step 1.8: Measure and Document Coverage (Day 15)

**Commands to run:**
```bash
# Generate full coverage report
npm run test:coverage

# Generate HTML report
npm run test:coverage -- --coverageReporters=html

# Open report in browser (macOS)
open coverage/index.html
```

**Create file:** `COVERAGE_REPORT.md`

Document:
- Overall coverage percentage
- Coverage by file
- Uncovered critical paths
- Known gaps

**Success criteria:**
- [ ] Overall coverage >80%
- [ ] MusicScale.js >90%
- [ ] WholeApp.js >75%
- [ ] Keyboard.js >70%
- [ ] MusicalStaff.js >60%
- [ ] All critical paths covered

**Rollback plan:** If coverage <80%, continue adding tests before proceeding

**Human review checkpoint:** ⚠️ **CRITICAL** - Do not proceed to Phase 2 unless coverage targets met

---

### PHASE 1 SUCCESS CRITERIA (MUST MEET ALL BEFORE PHASE 2)

- [ ] Test coverage >80% overall
- [ ] All existing functionality documented
- [ ] Unit tests for MusicScale, WholeApp state
- [ ] Integration tests for Keyboard
- [ ] Visual regression tests for VexFlow
- [ ] End-to-end user flow tests
- [ ] All tests passing
- [ ] Coverage report generated and reviewed
- [ ] Human approval to proceed

**⚠️ STOP**: If any criterion not met, add more tests until satisfied

---

## PHASE 2: REFACTOR FOR COMPATIBILITY (WEEKS 5-7)

**Goal:** Convert class components to functional components, eliminate global state, add type safety

**Prerequisites:**
- Phase 1 complete with >80% coverage
- All Phase 1 tests passing
- Human approval received

**Risk Level:** Medium (mitigated by test coverage)
**Estimated Duration:** 2-3 weeks

---

### Step 2.1: Eliminate Global Module State in Keyboard.js (Days 1-2)

**Problem:** Lines 44-48 in Keyboard.js use module-level variables that persist across component unmounts (memory leak risk)

```javascript
// CURRENT (BAD):
let targetArr, activeElementsforKeyboard, activeScale;
let threeLowerOctave = new Set();
const pressedKeys = new Set();
const pressedKeysLeftHand = new Set();
```

**Files to modify:**
- `src/components/keyboard/Keyboard.js`

**Refactor approach:**
Move all module-level state into component state or refs

```javascript
// NEW (GOOD):
// In constructor or as state:
this.state = {
  activeNotes: new Set(),
  mouse_is_down: false,
  targetArr: [],
  activeElementsforKeyboard: [],
  activeScale: null,
  threeLowerOctave: new Set(),
  pressedKeys: new Set(),
  pressedKeysLeftHand: new Set(),
  // ... existing state
}
```

**Testing strategy:**
```bash
# Run Keyboard integration tests
npm test Keyboard.integration.test.js

# Test for memory leaks
npm test Keyboard.integration.test.js -- --detectLeaks
```

**Success criteria:**
- [ ] All module-level variables moved to component state
- [ ] All Keyboard tests still pass
- [ ] No memory leaks detected
- [ ] Manual keyboard testing confirms functionality

**Rollback plan:**
```bash
git checkout src/components/keyboard/Keyboard.js
```

**Human review checkpoint:** Test keyboard functionality manually, verify no regressions

---

### Step 2.2: Convert WholeApp from Class to Functional Component (Days 3-7)

**Problem:** 496-line class component with 27 state properties, blocking React Router 7 and React 19 patterns

**Files to modify:**
- `src/WholeApp.js`

**Refactor approach:**

#### Step 2.2a: Extract custom hooks (Day 3)

Create `src/hooks/useWholeAppState.js`:
```javascript
import { useState } from 'react';

export function useWholeAppState() {
  const [octave, setOctave] = useState(4);
  const [octaveDist, setOctaveDist] = useState(0);
  const [scale, setScale] = useState("Major (Ionian)");
  // ... all 27 state properties

  return {
    octave, setOctave,
    octaveDist, setOctaveDist,
    scale, setScale,
    // ... all state values and setters
  };
}
```

Create `src/hooks/useFirebaseSession.js`:
```javascript
import { useState, useCallback } from 'react';
import db from '../Firebase';

export function useFirebaseSession() {
  const [loading, setLoading] = useState(true);
  const [sessionError, setSessionError] = useState(null);

  const saveSessionToDB = useCallback(async (sessionData) => {
    // ... existing saveSessionToDB logic
  }, []);

  const openSavedSession = useCallback((sessionId) => {
    // ... existing openSavedSession logic
  }, []);

  return { loading, sessionError, saveSessionToDB, openSavedSession };
}
```

Create `src/hooks/useTooltipRefs.js`:
```javascript
import { useState, useCallback } from 'react';

export function useTooltipRefs() {
  const [refs, setRefs] = useState({
    keyboardTooltipRef: null,
    showKeyboardTooltipRef: null,
    // ... all 11 tooltip refs
  });

  const setRef = useCallback((ref, menu) => {
    // ... existing setRef logic
  }, []);

  return { refs, setRef };
}
```

**Testing strategy:**
```bash
# Test each hook independently
npm test useWholeAppState.test.js
npm test useFirebaseSession.test.js
npm test useTooltipRefs.test.js
```

#### Step 2.2b: Convert WholeApp to functional component (Days 4-5)

**Create new file:** `src/WholeApp.functional.js`

```javascript
import React, { useEffect } from 'react';
import { useWholeAppState } from './hooks/useWholeAppState';
import { useFirebaseSession } from './hooks/useFirebaseSession';
import { useTooltipRefs } from './hooks/useTooltipRefs';
// ... other imports

function WholeApp({ sessionId }) {
  const state = useWholeAppState();
  const { loading, saveSessionToDB, openSavedSession } = useFirebaseSession();
  const { refs, setRef } = useTooltipRefs();

  useEffect(() => {
    // Disable right click
    document.oncontextmenu = () => false;

    if (sessionId) {
      openSavedSession(sessionId);
    } else {
      setLoading(false);
    }
  }, [sessionId]);

  // ... all handler functions as const callbacks
  const handleClickOctave = useCallback((action) => {
    // ... existing logic using state setters
  }, [state.octave, state.octaveDist]);

  // ... render (same JSX as before)
}

export default WholeApp;
```

**Testing strategy:**
```bash
# Run all WholeApp tests against new functional component
npm test WholeApp.state.test.js
npm test WholeApp.firebase.test.js
npm test E2E.userflows.test.js

# Run full test suite
npm test
```

#### Step 2.2c: Swap implementation (Day 6)

```bash
# Backup current class component
cp src/WholeApp.js src/WholeApp.class.backup.js

# Replace with functional component
mv src/WholeApp.functional.js src/WholeApp.js
```

#### Step 2.2d: Validate and test (Day 7)

```bash
# Run full test suite
npm test

# Run development server and manual test
npm start

# Generate coverage report
npm run test:coverage
```

**Success criteria:**
- [ ] All custom hooks created and tested
- [ ] Functional component passes all tests
- [ ] Coverage maintained or improved
- [ ] Manual testing confirms no regressions
- [ ] Development server runs without errors
- [ ] No console warnings

**Rollback plan:**
```bash
mv src/WholeApp.class.backup.js src/WholeApp.js
rm -rf src/hooks/
```

**Human review checkpoint:**
- Manual testing session (minimum 30 minutes)
- Test all features from ACCEPTANCE_CRITERIA.md
- Verify Firebase session sharing works
- Check browser console for errors

---

### Step 2.3: Convert Keyboard to Functional Component (Days 8-10)

**Files to modify:**
- `src/components/keyboard/Keyboard.js`

**Refactor approach:**

**Create hooks:**
- `useKeyboardState()` - manage state
- `useKeyboardEvents()` - handle key events
- `useSoundEngine()` - manage SoundMaker
- `useScaleMapping()` - handle scale/keyboard mapping

**Create file:** `src/hooks/useKeyboardEvents.js`

```javascript
import { useEffect, useCallback } from 'react';

export function useKeyboardEvents({
  extendedKeyboard,
  octave,
  octaveDist,
  activeScale,
  onNoteOn,
  onNoteOff
}) {
  const handleKeyDown = useCallback((e) => {
    // ... existing handleKeyDown logic
  }, [extendedKeyboard, octave, octaveDist, activeScale, onNoteOn]);

  const handleKeyUp = useCallback((e) => {
    // ... existing handleKeyUp logic
  }, [extendedKeyboard, octave, octaveDist, activeScale, onNoteOff]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keyup', handleKeyUp);
    };
  }, [handleKeyDown, handleKeyUp]);

  return { handleKeyDown, handleKeyUp };
}
```

**Convert Keyboard.js:**
```javascript
import React, { useRef, useEffect, useState } from 'react';
import { useKeyboardState } from '../../hooks/useKeyboardState';
import { useKeyboardEvents } from '../../hooks/useKeyboardEvents';
import { useSoundEngine } from '../../hooks/useSoundEngine';

function Keyboard(props) {
  const keyboardRef = useRef(null);
  const state = useKeyboardState(props);
  const soundEngine = useSoundEngine(props.instrumentSound);
  const events = useKeyboardEvents({
    ...props,
    activeScale: state.activeScale,
    onNoteOn: soundEngine.noteOnHandler,
    onNoteOff: soundEngine.noteOffHandler
  });

  // ... rest of component logic
}

export default Keyboard;
```

**Testing strategy:**
```bash
npm test Keyboard.integration.test.js
npm test useKeyboardEvents.test.js
npm test useSoundEngine.test.js
npm test -- --testPathPattern=Keyboard
```

**Success criteria:**
- [ ] All keyboard tests pass
- [ ] No global module state remains
- [ ] Event listeners clean up properly
- [ ] Manual keyboard testing confirms functionality
- [ ] All keycodes work identically

**Rollback plan:**
```bash
git checkout src/components/keyboard/Keyboard.js
```

**Human review checkpoint:** Test all keyboard shortcuts, verify audio works

---

### Step 2.4: Convert Remaining Class Components to Functional (Days 11-13)

**Files to modify (26 total, prioritized):**

**High priority (blocking migration):**
1. `src/components/musicScore/MusicalStaff.js`
2. `src/components/keyboard/Key.js`
3. `src/Model/SoundMaker.js`

**Medium priority:**
4. `src/components/menu/TopMenu.js`
5. `src/components/menu/CustomScaleSelector.js`
6-10. Other menu components

**Low priority (simple components):**
11-26. Form components, buttons, simple presentational components

**Conversion pattern for simple components:**
```javascript
// BEFORE
class SimpleComponent extends Component {
  render() {
    return <div>{this.props.value}</div>;
  }
}

// AFTER
function SimpleComponent({ value }) {
  return <div>{value}</div>;
}
```

**Commands to run after each conversion:**
```bash
# Test specific component
npm test ComponentName.test.js

# Run full suite after every 5 conversions
npm test
```

**Success criteria:**
- [ ] All 26 class components converted
- [ ] All tests pass after each conversion
- [ ] No class-based components remain
- [ ] Coverage maintained

**Rollback plan:** Git revert individual files as needed

**Human review checkpoint:** Review diff of each major component conversion

---

### Step 2.5: Add PropTypes to All Components (Days 14-15)

**Goal:** Add type safety before migration (helps catch breaking changes)

**Install if needed:**
```bash
npm install --save prop-types
```

**Files to modify:** All 26+ components

**Example for WholeApp:**
```javascript
import PropTypes from 'prop-types';

function WholeApp({ sessionId }) {
  // ... component logic
}

WholeApp.propTypes = {
  sessionId: PropTypes.string
};

WholeApp.defaultProps = {
  sessionId: null
};

export default WholeApp;
```

**Example for Keyboard:**
```javascript
Keyboard.propTypes = {
  octave: PropTypes.number.isRequired,
  octaveDist: PropTypes.number.isRequired,
  scale: PropTypes.string.isRequired,
  scaleObject: PropTypes.shape({
    name: PropTypes.string.isRequired,
    steps: PropTypes.arrayOf(PropTypes.number).isRequired,
    numbers: PropTypes.arrayOf(PropTypes.string).isRequired
  }).isRequired,
  scaleList: PropTypes.array.isRequired,
  baseNote: PropTypes.string.isRequired,
  notation: PropTypes.arrayOf(PropTypes.string).isRequired,
  instrumentSound: PropTypes.string.isRequired,
  pianoOn: PropTypes.bool.isRequired,
  extendedKeyboard: PropTypes.bool.isRequired,
  trebleStaffOn: PropTypes.bool.isRequired,
  showOffNotes: PropTypes.bool.isRequired,
  theme: PropTypes.string.isRequired,
  clef: PropTypes.string.isRequired,
  handleClickOctave: PropTypes.func.isRequired
};
```

**Testing strategy:**
```bash
# Run in development mode to see PropType warnings
npm start

# Check console for PropType violations
```

**Success criteria:**
- [ ] All components have PropTypes
- [ ] No PropType warnings in console
- [ ] All required props documented
- [ ] All default props defined

**Human review checkpoint:** Review PropTypes for critical components (WholeApp, Keyboard, MusicScale)

---

### Step 2.6: Add Error Boundaries (Day 15)

**Create file:** `src/components/ErrorBoundary.js`

```javascript
import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught error:', error, errorInfo);
    // Could send to error tracking service here
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '20px', textAlign: 'center' }}>
          <h1>Something went wrong</h1>
          <p>Please refresh the page</p>
          <details style={{ whiteSpace: 'pre-wrap' }}>
            {this.state.error && this.state.error.toString()}
          </details>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
```

**Files to modify:**
- `src/index.js`

```javascript
import ErrorBoundary from './components/ErrorBoundary';

root.render(
  <ErrorBoundary>
    <BrowserRouter>
      <Routes>
        <Route path="/shared/:sessionId" element={<WholeAppWrapper />} />
        <Route path="/" element={<WholeApp />} />
      </Routes>
    </BrowserRouter>
  </ErrorBoundary>
);
```

**Create strategic error boundaries:**
- Around Keyboard component
- Around MusicalStaff component
- Around Firebase operations

**Testing strategy:**
```bash
# Create test that throws error
npm test ErrorBoundary.test.js
```

**Success criteria:**
- [ ] ErrorBoundary component created
- [ ] Wrapped around app root
- [ ] Strategic boundaries around critical components
- [ ] Error states display gracefully

**Human review checkpoint:** Manually trigger error to test boundary

---

### PHASE 2 SUCCESS CRITERIA

- [ ] No module-level global state
- [ ] All class components converted to functional
- [ ] All custom hooks created and tested
- [ ] PropTypes added to all components
- [ ] Error boundaries implemented
- [ ] All tests passing
- [ ] Coverage maintained >80%
- [ ] Manual testing confirms no regressions
- [ ] Human approval to proceed

---

## PHASE 3: INCREMENTAL DEPENDENCY UPDATES (WEEKS 8-9)

**Goal:** Update dependencies in small batches, testing after each change

**Prerequisites:**
- Phase 2 complete
- All components functional
- All tests passing

**Risk Level:** Medium
**Estimated Duration:** 1.5-2 weeks

---

### Step 3.1: Update Development Dependencies (Day 1)

**Low-risk updates first:**

```bash
# Update Jest and testing libraries
npm install --save-dev @testing-library/react@14.0.0
npm install --save-dev @testing-library/user-event@14.5.1
npm install --save-dev @testing-library/jest-dom@6.1.5
npm install --save-dev jest@29.7.0
npm install --save-dev react-test-renderer@18.2.0  # Keep at 18 for now
```

**Testing strategy:**
```bash
npm test
npm run test:coverage
```

**Success criteria:**
- [ ] All tests pass with new testing libraries
- [ ] No new warnings
- [ ] Coverage reports still generate

**Rollback plan:**
```bash
git checkout package.json package-lock.json
npm install
```

**Human review checkpoint:** Review test output for any new warnings

---

### Step 3.2: Update Minor Dependencies (Days 2-3)

**Update non-breaking dependencies:**

```bash
# Update styling/UI dependencies
npm install sass@1.70.0
npm install react-bootstrap@2.10.0
npm install reactjs-popup@2.0.6
npm install react-draggable@4.4.6

# Update utility libraries
npm install color@4.2.3
npm install react-device-detect@2.2.3
npm install web-vitals@3.5.0
```

**Testing strategy:**
```bash
npm test
npm start  # Visual check
```

**Success criteria:**
- [ ] All tests pass
- [ ] App starts without errors
- [ ] UI renders correctly
- [ ] No console warnings

**Rollback plan:**
```bash
git checkout package.json package-lock.json
npm install
```

**Human review checkpoint:** Visual inspection of UI, test popups and draggable elements

---

### Step 3.3: Update react-tooltip (BREAKING: 4.2.21 → 5.30.0) (Days 4-5)

**This is a MAJOR update with breaking changes**

**Breaking changes:**
- Import path changed
- API changes for tooltip props
- ReactTooltip.show/hide API changed

**Commands:**
```bash
npm install react-tooltip@5.30.0
```

**Files to modify:**
- `src/WholeApp.js`

**Migration changes:**
```javascript
// OLD
import ReactTooltip from "react-tooltip";
ReactTooltip.show(this.state.keyboardTooltipRef);
ReactTooltip.hide();

// NEW
import { Tooltip } from 'react-tooltip';
// Use data-tooltip-id instead of data-tip
// Use imperative API differently or migrate to declarative
```

**Update all tooltip usage:**
- TopMenu component
- All menu components with tooltips
- 11 tooltip refs in WholeApp

**Testing strategy:**
```bash
npm test
npm start
# Manually test tooltip show/hide functionality
# Test handleChangeTooltip function
```

**Success criteria:**
- [ ] All tooltips display correctly
- [ ] Show/hide functionality works
- [ ] No console errors
- [ ] All tooltip tests pass

**Rollback plan:**
```bash
npm install react-tooltip@4.2.21
git checkout src/WholeApp.js src/components/menu/*.js
```

**Human review checkpoint:** Test all tooltips manually, verify positioning and content

---

### Step 3.4: Update react-player (BREAKING: 2.10.1 → 3.3.3) (Day 6)

**Breaking changes:**
- Props API changes
- Player ref handling changes

**Commands:**
```bash
npm install react-player@3.3.3
```

**Files to modify:**
- `src/components/menu/VideoTutorial.js` (likely location)
- Update mock at `src/__mocks__/react-player/lazy.js`

**Testing strategy:**
```bash
npm test
npm start
# Test video player functionality
# Test YouTube URL playback
```

**Success criteria:**
- [ ] Video player renders
- [ ] Video playback works
- [ ] URL changing works
- [ ] No console errors

**Rollback plan:**
```bash
npm install react-player@2.10.1
git checkout src/components/menu/VideoTutorial.js src/__mocks__/react-player/
```

**Human review checkpoint:** Test video playback with YouTube URLs

---

### Step 3.5: Update Tone.js (BREAKING: 14.7.77 → 15.1.22) (Days 7-9)

**⚠️ This is critical - audio engine changes**

**Breaking changes in Tone.js 15:**
- Audio context initialization changes
- Some API method signatures changed
- Transport changes
- TypeScript definitions improved

**Commands:**
```bash
npm install tone@15.1.22
npm install @tonejs/piano@0.3.0  # Compatible version
```

**Files to modify:**
- `src/Model/Adapters/Adapter_Tonejs_to_SoundMaker.js`
- `src/__mocks__/tone.js`

**Migration guide:** Check https://github.com/Tonejs/Tone.js/wiki/Migration

**Testing strategy:**
```bash
# Update tone mock
npm test

# Start app and test audio
npm start
# Test piano sounds
# Test sound switching
# Test note on/off
# Check for audio context warnings
```

**Success criteria:**
- [ ] Audio context initializes correctly
- [ ] Piano sounds play without distortion
- [ ] Instrument switching works
- [ ] No audio glitches
- [ ] No console warnings about audio context
- [ ] Memory doesn't leak with repeated note playing

**Rollback plan:**
```bash
npm install tone@14.7.77 @tonejs/piano@0.2.1
git checkout src/Model/Adapters/Adapter_Tonejs_to_SoundMaker.js
```

**Human review checkpoint:**
- ⚠️ **CRITICAL**: Test audio extensively
- Play notes for several minutes
- Switch instruments
- Test sustained notes
- Check browser DevTools memory profiler

---

### Step 3.6: Update WebMIDI (BREAKING: 2.0.0 → 3.1.14) (Day 10)

**Breaking changes:**
- API restructure
- Promise-based initialization
- Event handling changes

**Commands:**
```bash
npm install webmidi@3.1.14
```

**Files to search for WebMIDI usage:**
```bash
grep -r "webmidi" src/
```

**If WebMIDI is used:**
- Update initialization code
- Update event listeners
- Test MIDI input functionality

**Testing strategy:**
```bash
npm test
npm start
# If app has MIDI support, test with MIDI keyboard
```

**Success criteria:**
- [ ] MIDI functionality works (if implemented)
- [ ] No breaking changes affect app
- [ ] Tests pass

**Rollback plan:**
```bash
npm install webmidi@2.0.0
```

**Human review checkpoint:** Test with MIDI keyboard if feature is implemented

---

### Step 3.7: Update VexFlow (BREAKING: 4.0.3 → 5.0.0) (Days 11-13)

**⚠️ This is critical - musical notation rendering**

**Breaking changes in VexFlow 5:**
- API restructuring
- New rendering engine
- Different import paths
- Some method signature changes

**Commands:**
```bash
npm install vexflow@5.0.0
```

**Files to modify:**
- `src/components/musicScore/MusicalStaff.js`

**VexFlow 5 migration:**
```javascript
// OLD (VexFlow 4)
import Vex from 'vexflow';
const { Renderer, Stave, Accidental, StaveNote, Voice, Formatter } = Vex.Flow;

// NEW (VexFlow 5)
import { Renderer, Stave, Accidental, StaveNote, Voice, Formatter, Barline } from 'vexflow';
```

**Testing strategy:**
```bash
# Run visual regression tests
npm test MusicalStaff.visual.test.js

# Update snapshots if rendering changes are intentional
npm test MusicalStaff.visual.test.js -- -u

# Manual testing
npm start
# Test all clefs (treble, bass, alto, tenor)
# Test notes with sharps/flats
# Test double accidentals
```

**Success criteria:**
- [ ] Staff renders correctly
- [ ] All clefs display properly
- [ ] Notes with accidentals render
- [ ] Visual regression tests pass (or updated intentionally)
- [ ] No rendering errors in console

**Rollback plan:**
```bash
npm install vexflow@4.0.3
git checkout src/components/musicScore/MusicalStaff.js
```

**Human review checkpoint:**
- ⚠️ **CRITICAL**: Visual inspection of staff rendering
- Compare before/after screenshots
- Verify musical accuracy of notation

---

### PHASE 3 SUCCESS CRITERIA

- [ ] All non-React dependencies updated
- [ ] react-tooltip updated and working
- [ ] react-player updated and working
- [ ] Tone.js updated, audio working correctly
- [ ] WebMIDI updated (if used)
- [ ] VexFlow updated, notation rendering correctly
- [ ] All tests passing
- [ ] No console errors or warnings
- [ ] Manual testing confirms all features work
- [ ] Human approval to proceed to React update

---

## PHASE 4: REACT 18 → 19 MIGRATION (WEEK 10)

**Goal:** Update React and ReactDOM to version 19

**Prerequisites:**
- Phase 3 complete
- All dependencies updated except React
- All tests passing
- No class components remain

**Risk Level:** Medium-High
**Estimated Duration:** 1 week

---

### Step 4.1: Review React 19 Breaking Changes (Day 1)

**Read official migration guide:**
- https://react.dev/blog/2024/12/05/react-19
- Breaking changes documentation
- New features documentation

**Key breaking changes to prepare for:**
1. Automatic batching changes
2. New JSX transform (already using in React 18)
3. `ref` as prop (no more forwardRef needed)
4. Deprecated APIs removed
5. StrictMode behavior changes
6. Suspense improvements
7. useFormStatus, useFormState, useOptimistic hooks

**Document potential issues:**
- Any usage of deprecated APIs
- Custom ref forwarding
- Suspense usage (if any)

**Human review checkpoint:** Review breaking changes, identify risks

---

### Step 4.2: Update React Types and Prepare Code (Day 2)

**Install React 19 types in preparation:**
```bash
npm install --save-dev @types/react@19.0.0 @types/react-dom@19.0.0
```

**Search for deprecated patterns:**
```bash
# Check for forwardRef usage
grep -r "forwardRef" src/

# Check for legacy context
grep -r "contextTypes" src/

# Check for UNSAFE_ lifecycle methods
grep -r "UNSAFE_" src/

# Check for findDOMNode
grep -r "findDOMNode" src/
```

**Fix any deprecated patterns found**

**Success criteria:**
- [ ] No deprecated patterns found
- [ ] Code ready for React 19

---

### Step 4.3: Update React and ReactDOM (Day 3)

**Create a new branch:**
```bash
git checkout -b react-19-migration
git commit -m "Pre React 19 migration checkpoint"
```

**Update React:**
```bash
npm install react@19.2.0 react-dom@19.2.0
```

**Update React testing libraries:**
```bash
npm install --save-dev @testing-library/react@14.2.0
npm install --save-dev react-test-renderer@19.2.0
```

**Testing strategy:**
```bash
# Run tests
npm test

# Check for warnings
npm start
```

**Expected issues:**
- Possible console warnings about deprecated patterns
- Potential test failures due to stricter checks
- StrictMode may reveal issues

**Success criteria:**
- [ ] React 19 installed
- [ ] App starts without errors
- [ ] No critical console errors

**Rollback plan:**
```bash
git checkout main
npm install
```

**Human review checkpoint:** Review console for warnings, document any new errors

---

### Step 4.4: Fix React 19 Issues (Days 4-5)

**Common issues and fixes:**

**Issue 1: Ref forwarding**
```javascript
// OLD (React 18)
const MyComponent = forwardRef((props, ref) => {
  return <div ref={ref}>{props.children}</div>;
});

// NEW (React 19)
function MyComponent({ ref, ...props }) {
  return <div ref={ref}>{props.children}</div>;
}
```

**Issue 2: Automatic batching**
- React 19 batches more aggressively
- May need to use `flushSync` for immediate updates

**Issue 3: StrictMode double-rendering**
- Effects may run differently
- Check useEffect cleanup functions

**Files likely needing updates:**
- Any components using refs
- Components with complex useEffect logic
- State updates that depend on timing

**Testing strategy:**
```bash
# Run full test suite
npm test

# Check each component visually
npm start
```

**Success criteria:**
- [ ] No console errors
- [ ] All tests pass
- [ ] App functions identically to before

---

### Step 4.5: Enable React Compiler (Optional) (Day 6)

**React 19 includes an optional compiler for automatic memoization**

**Install:**
```bash
npm install --save-dev babel-plugin-react-compiler@19.2.0
```

**Configure in package.json or create `.babelrc`:**
```json
{
  "plugins": ["babel-plugin-react-compiler"]
}
```

**Testing strategy:**
```bash
npm test
npm start
# Monitor performance
```

**This is OPTIONAL - only enable if:**
- Tests pass
- Performance improves
- No new bugs introduced

**Success criteria:**
- [ ] Compiler enabled (optional)
- [ ] No performance regressions
- [ ] All tests pass

---

### Step 4.6: Test Concurrent Features (Day 7)

**React 19 concurrent features:**

**Test with StrictMode enabled:**
```javascript
// In index.js
root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <BrowserRouter>
        <Routes>
          <Route path="/shared/:sessionId" element={<WholeAppWrapper />} />
          <Route path="/" element={<WholeApp />} />
        </Routes>
      </BrowserRouter>
    </ErrorBoundary>
  </React.StrictMode>
);
```

**Test useTransition for smooth UI:**
```javascript
// In WholeApp or Keyboard
import { useTransition } from 'react';

function WholeApp() {
  const [isPending, startTransition] = useTransition();

  const handleScaleChange = (newScale) => {
    startTransition(() => {
      // Non-urgent state update
      setScale(newScale);
    });
  };
}
```

**Testing strategy:**
```bash
npm start
# Test rapid scale changes
# Test rapid note playing
# Monitor for janky UI
```

**Success criteria:**
- [ ] StrictMode doesn't break app
- [ ] Concurrent features work smoothly
- [ ] No performance regressions

---

### PHASE 4 SUCCESS CRITERIA

- [ ] React 19.2.0 installed
- [ ] ReactDOM 19.2.0 installed
- [ ] All tests passing
- [ ] No console errors or warnings
- [ ] App functions identically
- [ ] StrictMode enabled
- [ ] Concurrent features tested
- [ ] Performance maintained or improved
- [ ] Human approval to proceed

---

## PHASE 5: REACT ROUTER 6 → 7 MIGRATION (WEEK 11)

**Goal:** Update React Router to version 7

**Prerequisites:**
- Phase 4 complete
- React 19 working
- All components functional

**Risk Level:** Medium
**Estimated Duration:** 1 week

---

### Step 5.1: Review React Router 7 Changes (Day 1)

**Read migration guide:**
- https://reactrouter.com/upgrading/v6-to-v7

**Key changes:**
- New data APIs (loader, action)
- Route configuration changes
- Potential bundle size improvements
- Better TypeScript support

**Current routing structure:**
```javascript
<Routes>
  <Route path="/shared/:sessionId" element={<WholeAppWrapper />} />
  <Route path="/" element={<WholeApp />} />
</Routes>
```

**This is relatively simple, should be straightforward**

---

### Step 5.2: Update React Router (Day 2)

**Commands:**
```bash
npm install react-router-dom@7.9.5
```

**Testing strategy:**
```bash
npm test
npm start
# Test navigation
# Test /shared/:sessionId route
# Test / route
```

**Success criteria:**
- [ ] Router 7 installed
- [ ] Both routes work
- [ ] useParams still works in WholeAppWrapper
- [ ] No console errors

**Rollback plan:**
```bash
npm install react-router-dom@6.3.0
```

---

### Step 5.3: Consider Data Router Pattern (Days 3-4, Optional)

**React Router 7 recommends data router pattern:**

```javascript
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

const router = createBrowserRouter([
  {
    path: "/",
    element: <WholeApp />,
  },
  {
    path: "/shared/:sessionId",
    element: <WholeApp />,
    loader: async ({ params }) => {
      // Could load Firebase session here
      return { sessionId: params.sessionId };
    },
  },
]);

root.render(<RouterProvider router={router} />);
```

**Benefits:**
- Better data loading patterns
- Eliminates WholeAppWrapper
- More modern React Router usage

**This is OPTIONAL** - current pattern works fine

---

### Step 5.4: Test Routing Thoroughly (Day 5)

**Create routing tests:**
```javascript
describe('Routing', () => {
  test('/ route renders WholeApp', () => {
    // Test home route
  });

  test('/shared/:sessionId route loads session', () => {
    // Test session route
  });

  test('invalid route shows 404', () => {
    // Test error handling
  });
});
```

**Manual testing:**
```bash
npm start
# Navigate to /
# Navigate to /shared/test123
# Test browser back/forward
# Test deep linking
```

**Success criteria:**
- [ ] All routes work
- [ ] Session loading works
- [ ] Navigation smooth
- [ ] No console errors

---

### PHASE 5 SUCCESS CRITERIA

- [ ] React Router 7.9.5 installed
- [ ] All routes working
- [ ] Session sharing works
- [ ] Navigation tests pass
- [ ] Manual routing testing complete
- [ ] Human approval

---

## PHASE 6: VALIDATION & OPTIMIZATION (WEEK 12)

**Goal:** Final validation, performance testing, documentation

**Prerequisites:**
- All previous phases complete
- All dependencies updated
- All tests passing

**Risk Level:** Low
**Estimated Duration:** 1 week

---

### Step 6.1: Full Regression Testing (Days 1-2)

**Execute full test suite:**
```bash
npm run test:coverage
```

**Manual testing checklist from ACCEPTANCE_CRITERIA.md:**
- [ ] All keyboard shortcuts work
- [ ] All scales selectable
- [ ] Custom scale creation
- [ ] Audio playback correct
- [ ] VexFlow notation renders
- [ ] Firebase session sharing
- [ ] Mobile block works
- [ ] Video player works
- [ ] All tooltips work
- [ ] Theme switching works
- [ ] All menu interactions work

**Human review checkpoint:** Full manual testing session (2-3 hours)

---

### Step 6.2: Performance Benchmarking (Day 3)

**Install performance tools:**
```bash
npm install --save-dev lighthouse
```

**Run performance tests:**
```bash
# Build production bundle
npm run build

# Serve production build
npx serve -s build

# Run Lighthouse
npx lighthouse http://localhost:3000 --view
```

**Measure:**
- Bundle size
- Time to Interactive
- First Contentful Paint
- Total Blocking Time
- Memory usage during note playing

**Compare to baseline (if available)**

**Success criteria:**
- [ ] Performance maintained or improved
- [ ] Bundle size not significantly larger
- [ ] No memory leaks
- [ ] Lighthouse score >90

---

### Step 6.3: Bundle Size Analysis (Day 4)

**Analyze bundle:**
```bash
npm install --save-dev source-map-explorer

# Add to package.json scripts
npm pkg set scripts.analyze="source-map-explorer 'build/static/js/*.js'"

# Build and analyze
npm run build
npm run analyze
```

**Check for:**
- Unexpected large dependencies
- Duplicate dependencies
- Opportunities for code splitting

**Document findings**

---

### Step 6.4: Update Documentation (Day 5)

**Update files:**
- `README.md`
- `package.json` description
- `CLAUDE.md`

**Document:**
- Updated dependency versions
- Migration notes
- Any breaking changes for contributors
- New development practices

**Create file:** `MIGRATION_NOTES.md`

---

### Step 6.5: Final Code Cleanup (Day 6)

**Remove:**
- Backup files (WholeApp.class.backup.js, etc.)
- Unused imports
- Console.log statements
- Commented code

**Commands:**
```bash
# Find console.log
grep -r "console.log" src/

# Find commented code
grep -r "//" src/ | grep -v "Copyright"
```

**Run linter:**
```bash
npm run lint  # if available
```

**Success criteria:**
- [ ] No backup files
- [ ] No console.logs
- [ ] Code clean
- [ ] Linter passes

---

### Step 6.6: Create Migration Report (Day 7)

**Create file:** `MIGRATION_REPORT.md`

**Include:**
- Migration timeline
- Issues encountered
- Performance comparison
- Test coverage improvement
- Dependency version changes
- Recommendations for future

**Success criteria:**
- [ ] Report complete
- [ ] All stakeholders reviewed
- [ ] Migration approved

---

### PHASE 6 SUCCESS CRITERIA

- [ ] All regression tests pass
- [ ] Performance benchmarked
- [ ] Bundle size acceptable
- [ ] Documentation updated
- [ ] Code cleaned up
- [ ] Migration report created
- [ ] Final human approval

---

## FINAL DEPLOYMENT CHECKLIST

**Before deploying to production:**

- [ ] All 6 phases complete
- [ ] All phase success criteria met
- [ ] Coverage >80%
- [ ] All tests passing
- [ ] Manual testing complete
- [ ] Performance acceptable
- [ ] No console errors
- [ ] Browser compatibility tested
- [ ] Firebase integration tested
- [ ] Session sharing tested
- [ ] Audio functionality verified
- [ ] VexFlow rendering verified
- [ ] Mobile block verified
- [ ] Documentation updated
- [ ] Stakeholder approval received

**Deployment strategy:**
```bash
# Create release branch
git checkout -b release/react-19-migration

# Final build test
npm run build

# Deploy to staging
npm run deploy-staging  # (if available)

# Test staging thoroughly

# Deploy to production
npm run deploy
```

---

## ROLLBACK STRATEGY

**If critical issues discovered after deployment:**

```bash
# Immediate rollback
git revert HEAD
npm install
npm run build
npm run deploy

# Or restore from backup
git checkout <pre-migration-commit>
npm install
npm run build
npm run deploy
```

**Maintain pre-migration branch:**
```bash
git branch backup/pre-react-19-migration main
git push origin backup/pre-react-19-migration
```

---

## RISK MITIGATION SUMMARY

**High-Risk Items:**
1. VexFlow migration (musical notation critical)
2. Tone.js migration (audio critical)
3. WholeApp refactor (496 lines, 27 state props)
4. Keyboard global state (memory leak risk)

**Mitigation:**
- Comprehensive test coverage (Phase 1)
- Incremental updates (Phase 3)
- Multiple checkpoints
- Human review at each major step
- Clear rollback paths

---

## ESTIMATED TIMELINE

| Phase | Duration | Calendar |
|-------|----------|----------|
| Phase 1: Testing | 3-4 weeks | Weeks 1-4 |
| Phase 2: Refactoring | 2-3 weeks | Weeks 5-7 |
| Phase 3: Dependencies | 1.5-2 weeks | Weeks 8-9 |
| Phase 4: React 19 | 1 week | Week 10 |
| Phase 5: Router 7 | 1 week | Week 11 |
| Phase 6: Validation | 1 week | Week 12 |
| **Total** | **10-12 weeks** | **3 months** |

---

## HUMAN REVIEW CHECKPOINTS

**Critical checkpoints requiring human approval:**

1. ✅ After Phase 1.8 - Coverage >80% before proceeding
2. ✅ After Step 2.2 - WholeApp conversion complete
3. ✅ After Step 2.3 - Keyboard conversion complete
4. ✅ After Phase 2 - All refactoring complete
5. ✅ After Step 3.5 - Tone.js audio working
6. ✅ After Step 3.7 - VexFlow notation rendering
7. ✅ After Phase 4 - React 19 migration complete
8. ✅ After Phase 6.1 - Final regression testing
9. ✅ Before deployment - Final approval

---

## SUCCESS METRICS

**Technical Metrics:**
- Test coverage: >80% (from ~20%)
- Performance: Maintained or improved
- Bundle size: <10% increase acceptable
- Lighthouse score: >90
- Zero regressions

**Functional Metrics:**
- All features work identically
- Audio quality maintained
- Notation rendering accurate
- Session sharing works
- No user-facing errors

---

## CONCLUSION

This migration plan prioritizes safety through comprehensive testing before making any breaking changes. The phased approach allows for rollback at any point, and human checkpoints ensure no regressions slip through.

**Critical Success Factor:** Do not skip Phase 1. Without adequate test coverage, this migration is extremely risky. The investment in testing will pay off by catching regressions early and enabling confident refactoring.

**Next Steps:**
1. Review this plan with stakeholders
2. Get approval for 12-week timeline
3. Begin Phase 1 immediately
4. Schedule weekly check-ins
5. Maintain migration log throughout

---

## APPENDIX

### Useful Commands Reference

```bash
# Testing
npm test                          # Run tests in watch mode
npm run test:coverage             # Generate coverage report
npm test -- --testPathPattern=X   # Run specific test file
npm test -- --detectLeaks         # Detect memory leaks

# Development
npm start                         # Start dev server
npm run build                     # Production build
npm run analyze                   # Analyze bundle size

# Deployment
npm run deploy                    # Deploy to production

# Rollback
git checkout <commit>             # Rollback to specific commit
npm install                       # Restore dependencies
```

### Contact & Support

- **Project Lead:** [Your Name]
- **Migration Lead:** [Your Name]
- **Questions:** [Email/Slack channel]

---

**Document Status:** Draft for Review
**Last Updated:** 2025-11-11
**Version:** 1.0
