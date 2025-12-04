# Quickstart Guide: URL Settings Storage - Testing and Code Quality

**Feature**: 005-url-storage-completion
**Date**: 2025-12-03
**Branch**: `005-url-storage-completion`

## Overview

This guide provides quick instructions for manually testing the modal positioning functionality with test coverage, Context API refactoring, and consolidated state.

## Prerequisites

```bash
# Ensure you're on the correct branch
git checkout 005-url-storage-completion

# Install dependencies (if needed)
npm install

# Start development server
npm start

# In separate terminal, run tests
npm test
```

---

## Manual Test Scenarios

### Scenario 1: Test Coverage Verification

**Purpose**: Verify 100% test coverage is achieved

**Steps**:
1. Run test suite with coverage:
   ```bash
   npm test -- --coverage
   ```

2. Verify coverage report shows:
   - ✅ 100% line coverage
   - ✅ 100% branch coverage
   - ✅ 100% function coverage
   - ✅ 100% statement coverage

3. Open HTML report:
   ```bash
   open coverage/lcov-report/index.html
   ```

4. Check specific files have 100% coverage:
   - `src/services/urlEncoder.js`
   - `src/contexts/ModalPositionContext.js`
   - `src/components/OverlayPlugins/Overlay.js`
   - `src/WholeApp.js` (modal position related code)

**Expected Result**: All coverage metrics at 100%, green indicators in HTML report

**Troubleshooting**:
- If coverage < 100%, check which lines are uncovered in HTML report
- Add tests for uncovered branches (usually error handling paths)

---

### Scenario 2: Modal Positioning - Drag and URL Update

**Purpose**: Verify modals can be positioned and URL updates correctly

**Steps**:
1. Open app in browser: `http://localhost:3000`

2. Open Video modal:
   - Click "Video Player" button in top menu
   - Modal should appear

3. Drag modal to new position:
   - Click and hold drag handle (top bar of modal)
   - Move mouse to drag modal to right and down
   - Release mouse

4. Wait 600ms for debounced URL update

5. Check browser URL bar:
   - Should contain `videoModalX=` parameter
   - Should contain `videoModalY=` parameter
   - Values should be positive integers

6. Refresh page (F5 or Cmd+R)

7. Verify modal restored:
   - Video modal should appear at same position as before refresh
   - Position should match URL parameters (±10px tolerance)

**Expected Result**: Modal positions persist across page reloads via URL

**Troubleshooting**:
- If URL doesn't update: Check console for errors, verify debounce is working
- If position not restored: Check URL decoding logic, verify context provider

---

### Scenario 3: Multiple Modals Positioning

**Purpose**: Verify multiple modals can be positioned simultaneously

**Steps**:
1. Open Video modal and drag to position (100, 100)
2. Wait for URL update
3. Open Help modal and drag to position (300, 200)
4. Wait for URL update
5. Open Share modal and drag to position (500, 300)
6. Wait for URL update

7. Check URL contains all 6 parameters:
   - `videoModalX`, `videoModalY`
   - `helpModalX`, `helpModalY`
   - `shareModalX`, `shareModalY`

8. Refresh page

9. Verify all three modals restored to correct positions

**Expected Result**: All modals positioned independently, all positions persist

**Troubleshooting**:
- If modals overlap: Verify each modal uses correct context key ('video', 'help', 'share')
- If positions conflict: Check state consolidation in WholeApp

---

### Scenario 4: Context API - No Props Drilling

**Purpose**: Verify Context API eliminates props drilling

**Steps**:
1. Open browser DevTools
2. Install React DevTools extension if not already installed
3. Open React DevTools "Components" tab

4. Inspect component tree:
   - Find `WholeApp` component
   - Look for `ModalPositionContext.Provider`
   - Find `Overlay` component

5. Verify props:
   - TopMenu should NOT have `initialPosition` or `onPositionChange` props
   - VideoButton should NOT have `initialPosition` or `onPositionChange` props
   - VideoTutorial should NOT have position-related props
   - Overlay should only have `modalName` prop

6. Verify context:
   - Click on Overlay component
   - Look for "hooks" section in DevTools
   - Should see `Context` hook with positions value

**Expected Result**: Props drilling eliminated, Overlay gets positions from context

**Troubleshooting**:
- If props still present: Refactoring not complete, check migration status
- If context not found: Verify ModalPositionContext.Provider is wrapping app

---

### Scenario 5: Consolidated State Structure

**Purpose**: Verify state consolidated from 6 fields to nested object

**Steps**:
1. Open React DevTools
2. Select `WholeApp` component
3. Look at "state" section

4. Verify state structure:
   - Should see `modalPositions` object
   - Should NOT see flat fields like `videoModalX`, `videoModalY`
   - `modalPositions` should have nested structure:
     ```
     modalPositions:
       video: { x: ..., y: ... }
       help: { x: ..., y: ... }
       share: { x: ..., y: ... }
     ```

5. Drag a modal
6. Watch state update in DevTools:
   - Only corresponding modal's position should update
   - Other modals' positions should remain unchanged
   - Update should use nested structure

**Expected Result**: State uses consolidated nested object, updates correctly

**Troubleshooting**:
- If flat fields still present: State migration not complete
- If nested structure wrong: Check setState calls use correct spread syntax

---

### Scenario 6: Integration Tests

**Purpose**: Run and verify integration tests pass

**Steps**:
1. Run integration tests only:
   ```bash
   npm test -- --testPathPattern=integration
   ```

2. Verify tests pass:
   - `url-encoder-positions.test.js` - All passing
   - `state-sync.test.js` - All passing
   - `overlay-positioning.test.js` - All passing
   - `sharelink-positions.test.js` - All passing
   - `browser-history.test.js` - All passing
   - `context-integration.test.js` - All passing

3. Check test output for timing:
   - Each test should complete in < 5 seconds
   - Total integration suite should complete in < 30 seconds

**Expected Result**: All integration tests passing, within performance targets

**Troubleshooting**:
- If tests fail: Check error messages, verify mocks are properly restored
- If tests slow: Check for missing jest.useFakeTimers() or unnecessary delays

---

### Scenario 7: E2E Tests

**Purpose**: Run and verify E2E tests pass

**Steps**:
1. Ensure dev server is running: `npm start`

2. Run E2E tests:
   ```bash
   npx playwright test
   ```

3. Verify tests pass in all browsers:
   - Chromium: `modal-positioning.spec.js` - ✅
   - Firefox: `modal-positioning.spec.js` - ✅
   - WebKit: `modal-positioning.spec.js` - ✅
   - All: `cross-browser-modals.spec.js` - ✅
   - All: `accessibility-modals.spec.js` - ✅

4. Check test duration:
   - Each E2E test should complete in < 30 seconds
   - Total E2E suite should complete in < 3 minutes

5. View HTML report (if test fails):
   ```bash
   npx playwright show-report
   ```

**Expected Result**: All E2E tests passing across all browsers, within performance targets

**Troubleshooting**:
- If tests fail in specific browser: Check browser-specific console logs
- If tests timeout: Increase timeout or optimize test (remove unnecessary waits)
- If accessibility tests fail: Check axe violations in report, fix ARIA issues

---

### Scenario 8: Accessibility Testing

**Purpose**: Verify positioned modals meet accessibility standards

**Steps**:
1. Open app in browser: `http://localhost:3000`

2. Test keyboard navigation:
   - Tab through UI until "Video Player" button is focused
   - Press Enter to open modal
   - Press Tab - focus should move into modal content
   - Press Escape - modal should close and focus return to trigger

3. Test screen reader (optional, if available):
   - Enable screen reader (VoiceOver on Mac, NVDA on Windows)
   - Navigate to modal trigger
   - Verify screen reader announces role and label
   - Open modal and verify modal content is announced

4. Run automated accessibility audit:
   ```bash
   npx playwright test accessibility-modals.spec.js
   ```

5. Verify zero violations reported

**Expected Result**: Keyboard navigation works, screen reader compatibility maintained, zero axe violations

**Troubleshooting**:
- If focus not managed: Check Overlay componentDidMount/componentWillUnmount
- If axe violations: Check ARIA roles/labels, color contrast, focus indicators

---

### Scenario 9: Backwards Compatibility

**Purpose**: Verify existing shared URLs still work

**Steps**:
1. Use existing URL from feature 004 (before this refactoring):
   ```
   http://localhost:3000/?octave=4&scale=Major&videoModalX=100&videoModalY=150
   ```

2. Open URL in browser

3. Verify settings loaded:
   - Octave should be 4
   - Scale should be Major
   - Video modal should be positioned at (100, 150) when opened

4. Generate new URL after refactoring:
   - Configure same settings (octave 4, scale Major)
   - Position video modal at (100, 150)
   - Copy URL from browser

5. Compare URLs:
   - Parameter format should be identical
   - Both should work interchangeably

**Expected Result**: Old and new URLs have identical format and behavior

**Troubleshooting**:
- If URL format differs: Check urlEncoder hasn't changed parameter names
- If old URLs don't work: Check decoding logic handles both old and new state structures

---

### Scenario 10: Performance Validation

**Purpose**: Verify performance requirements are met

**Steps**:
1. Open browser DevTools Performance tab

2. Start recording

3. Perform modal positioning workflow:
   - Open modal
   - Drag to new position
   - Wait for URL update
   - Refresh page
   - Verify position restored

4. Stop recording

5. Analyze performance:
   - Drag interactions should maintain 60fps
   - URL update should be debounced (only 1 update after 500ms)
   - Page reload should restore position quickly (< 200ms)

6. Run test suite and measure duration:
   ```bash
   time npm test
   ```

7. Verify timings:
   - Integration tests: < 5s per test
   - Total test suite: < 2 minutes
   - E2E tests: < 30s per test

**Expected Result**: UI remains responsive, tests complete within performance budgets

**Troubleshooting**:
- If drag is janky: Check for excessive re-renders (React DevTools Profiler)
- If tests slow: Profile tests, look for unnecessary async waits or timeouts

---

## Quick Reference

### Run All Tests
```bash
npm test                      # Run all Jest tests
npx playwright test           # Run all E2E tests
npm test -- --coverage        # Run with coverage report
```

### Test Specific Category
```bash
npm test -- --testPathPattern=integration     # Integration tests only
npm test -- --testPathPattern=unit            # Unit tests only
npx playwright test modal-positioning         # Specific E2E test
```

### View Coverage
```bash
npm test -- --coverage
open coverage/lcov-report/index.html
```

### Debug Tests
```bash
npm test -- --watch                           # Watch mode
npm test -- --verbose                         # Verbose output
npx playwright test --debug                   # Debug E2E tests
```

---

## Verification Checklist

After completing all scenarios, verify:

- [x] Test coverage at 100% (all metrics)
- [x] Integration tests comprise 60-70% of suite
- [x] E2E tests comprise 20-30% of suite
- [x] Unit tests comprise 10-20% of suite
- [x] All tests pass
- [x] Integration tests < 5s per test
- [x] E2E tests < 30s per test
- [x] Modal positioning works in browser
- [x] URL parameters update on drag
- [x] Positions persist across page reloads
- [x] Multiple modals can be positioned
- [x] Props drilling eliminated (verified in DevTools)
- [x] State consolidated (verified in DevTools)
- [x] Keyboard navigation works
- [x] Zero accessibility violations
- [x] Backwards compatibility maintained
- [x] Performance targets met

---

## Next Steps

Once all manual tests pass:

1. Create pull request
2. Run CI/CD pipeline (tests + coverage gates)
3. Request code review
4. Address feedback
5. Merge to master

## Support

If you encounter issues:

1. Check console for error messages
2. Review React DevTools for component state
3. Check test output for failure details
4. Review contracts in `/specs/005-url-storage-completion/contracts/`
5. Consult research document for implementation patterns
