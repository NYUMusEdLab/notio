# Remaining Accessibility Issues

This document outlines accessibility issues that should be addressed in **separate feature branches** after the current PR is merged.

---

## Priority 1: Piano Key Tab Navigation 🎹

**Issue**: Piano keys are not currently in the natural tab order. Users can only interact with them via mouse clicks.

**⚠️ DESIGN CONSTRAINT**: Do NOT navigate TO piano keys individually. Navigation should be simultaneous to piano key and color key parent element. This prevents having 88+ tab stops for individual keys.

**⚠️ PERFORMANCE CONSTRAINT**: Maintain current note-playing latency. Implementation must NOT increase latency from previous master branch.

**What needs to be done:**
1. ~~Add `tabIndex={0}` to all Key components~~ **INCORRECT APPROACH**
2. Instead: Make the piano keyboard container focusable, handle arrow key navigation within
3. Ensure Enter/Space keys activate notes (trigger sound)
4. Verify focus indicators are visible on piano keys
5. Test with screen readers to ensure proper announcements
6. Performance test: Verify keypress-to-sound latency unchanged from master

**Files to modify:**
- `src/components/Key.js` (or similar piano key component)
- Integration tests for piano key keyboard interaction
- E2E tests for complete keyboard-only piano playing workflow

**Tests to re-enable after implementation:**
- `e2e/accessibility/keyboard-workflow.spec.js:26` - T014: Complete keyboard-only navigation
- `e2e/accessibility/keyboard-workflow.spec.js:80` - Navigate and activate menu buttons
- `e2e/accessibility/keyboard-workflow.spec.js:138` - Play multiple notes in sequence
- `e2e/accessibility/keyboard-workflow.spec.js:201` - T015: Cross-browser keyboard navigation
- `e2e/accessibility/focus-visibility-e2e.spec.js:72` - Maintain focus through piano keys
- `e2e/accessibility/focus-visibility-e2e.spec.js:117` - Show focus on menu buttons
- `e2e/accessibility/focus-visibility-e2e.spec.js:154` - Maintain focus after Enter activation
- `e2e/accessibility/focus-visibility-e2e.spec.js:197` - Maintain focus after Space activation
- `e2e/accessibility/focus-visibility-e2e.spec.js:246` - T064: Focus indicators across browsers

**Acceptance criteria:**
- User can Tab from menu buttons to first piano key
- Arrow Left/Right navigate between adjacent piano keys (optional enhancement)
- Enter/Space play the focused note
- Screen reader announces "Play C4" when focusing piano keys
- All 8 E2E tests pass

**Estimated effort:** Medium (1-2 days)

---

## Priority 2: Color Contrast Improvements 🎨

**Issue**: Some UI elements don't meet WCAG 2.1 AA minimum contrast ratio (4.5:1 for normal text, 3:1 for large text).

**⚠️ EXISTING FEATURE**: Application has colorblind settings activated using number keys (1-9). Any color contrast improvements must preserve this functionality and ensure colorblind modes also meet WCAG AA standards.

**What needs to be done:**
1. Run axe DevTools to identify all color contrast violations
2. Update colors in CSS/theme to meet WCAG AA standards
3. Ensure brand colors are preserved where possible
4. **Test with color blindness simulators AND test all colorblind modes**
5. Verify number key activation (1-9) of colorblind settings still works
6. Ensure each colorblind mode meets WCAG AA contrast ratios

**Potential affected areas:**
- Menu item text colors
- Button text/background colors
- Focus indicators
- Disabled state colors

**Tests to re-enable after implementation:**
- `e2e/sample.spec.js:25` - Strict axe audit
- `e2e/accessibility/keyboard-workflow.spec.js:238` - Axe audit for keyboard navigation
- `e2e/accessibility/screen-reader-e2e.spec.js:27` - T054: Comprehensive axe audit
- `e2e/accessibility/screen-reader-e2e.spec.js:131` - Cross-browser axe audit
- `e2e/accessibility/focus-visibility-e2e.spec.js:25` - T064: Focus indicators (original)
- `e2e/accessibility/focus-visibility-e2e.spec.js:276` - Axe audit for focus violations

**Acceptance criteria:**
- All text meets WCAG AA contrast ratios
- All interactive elements have sufficient contrast
- All 6 strict axe audit tests pass
- Visual design remains appealing

**Estimated effort:** Medium (2-3 days)

---

## Priority 3: Remove Nested Interactive Controls 🔧

**Issue**: Some components have interactive controls nested inside buttons, which violates WCAG and causes screen reader issues.

**What needs to be done:**
1. Identify all components with nested interactive controls
2. Refactor component structure to avoid nesting
3. Consider using ARIA composition patterns where appropriate
4. Ensure keyboard navigation still works correctly

**Likely affected components:**
- Key components (piano keys with nested buttons?)
- Menu items with nested controls
- Other custom interactive components

**Tests affected:**
Same as Priority 2 (strict axe audits) - these check for `nested-interactive` violations.

**Acceptance criteria:**
- No interactive controls nested inside other interactive controls
- Keyboard navigation works as expected
- Screen readers announce components correctly
- All strict axe audit tests pass

**Estimated effort:** Medium-High (3-5 days, depending on component complexity)

---

## Priority 4: Complete Icon Button Labels 🏷️

**Issue**: Some icon-only buttons are missing accessible names (aria-label or aria-labelledby).

**Status**: Partially fixed (overlay minimize/close buttons have labels now)

**What needs to be done:**
1. Audit all icon buttons in the application
2. Add appropriate `aria-label` attributes
3. Ensure labels are descriptive and helpful

**Already fixed:**
- ✅ Overlay minimize button: `aria-label="Minimize window"`
- ✅ Overlay close button: `aria-label="Close window"`

**Potentially missing labels:**
- Other icon buttons throughout the app (needs audit)
- Custom control buttons
- Toolbar buttons

**Tests to re-enable:**
Partial - strict axe audits will check for this, but specific button tests may still fail.

**Acceptance criteria:**
- All icon buttons have descriptive aria-labels
- Screen readers announce button purpose clearly
- Button-name violations reduced to zero

**Estimated effort:** Low (1 day)

---

## Priority 5: Performance Optimization ⚡

**Issue**: Page load time exceeds 5 seconds, causing E2E performance test to fail.

**⚠️ CRITICAL PERFORMANCE TARGET**: Keypress-to-sound latency must be < 20ms (preferably < 10ms). This is the highest priority performance metric for a music education app.

**What needs to be done:**
1. **PRIMARY**: Measure and optimize keypress-to-sound latency
   - Instrument keyboard event handlers to measure latency
   - Profile audio playback pipeline
   - Optimize Web Audio API usage
   - Target: < 20ms keypress-to-sound (stretch goal: < 10ms)
2. **SECONDARY**: Page load optimization
   - Analyze bundle size and identify large dependencies
   - Implement code splitting for routes/components
   - Lazy load non-critical components
   - Optimize images and assets
   - Consider CDN for static assets

**Tests to re-enable:**
- `e2e/sample.spec.js:61` - Page load performance measurement

**Acceptance criteria:**
- **CRITICAL**: Keypress-to-sound latency < 20ms
- Page load time < 5000ms (ideally < 3000ms)
- Bundle size reduced significantly
- Lighthouse performance score > 80
- E2E performance test passes
- **No degradation** in note-playing responsiveness from master

**Estimated effort:** Medium-High (3-5 days)

---

## Priority 6: Root Menu 2D Grid Navigation 🎛️

**Status**: ✅ **ALREADY IMPLEMENTED**

**Note**: Root menu 2D grid navigation (arrow keys for base tones + accidentals) has been implemented in the current PR. This priority can be marked as complete.

**Verification needed:**
- Integration tests confirm 2D grid arrow key navigation works
- Manual testing shows proper behavior
- Screen reader announces grid positions correctly

---

## Recommended Implementation Order

1. **Priority 4** (Icon Button Labels) - Quick win, low effort
2. **Priority 5** (Performance - Keypress Latency) - CRITICAL for music app UX
3. **Priority 1** (Piano Key Tab Navigation) - High user impact
4. **Priority 2** (Color Contrast) - WCAG compliance critical
5. **Priority 3** (Nested Interactive Controls) - WCAG compliance critical
6. ~~**Priority 6** (Root Menu 2D Grid)~~ - ✅ Already complete

---

## How to Create Feature Branches

For each priority:

```bash
# Create new feature branch
git checkout master
git pull origin master
git checkout -b feature/piano-key-tab-navigation

# Work on the feature...

# Create PR when ready
git push -u origin feature/piano-key-tab-navigation
gh pr create --base master --title "feat(a11y): Add piano key tab navigation" --body "Implements tab navigation for piano keys..."
```

---

## Testing Strategy

Each feature should include:

1. **Integration Tests** (60-70% coverage)
   - Test main user workflows
   - Use React Testing Library + jest-axe

2. **E2E Tests** (20-30% coverage)
   - Test cross-browser compatibility
   - Use Playwright + @axe-core/playwright

3. **Unit Tests** (10-20% coverage)
   - Test edge cases and unusual scenarios
   - Use Jest

4. **Manual Testing**
   - Test with screen readers (VoiceOver/NVDA)
   - Test with keyboard only
   - Test across browsers (Chrome, Firefox, Safari)

---

## Resources

- [WAI-ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [axe DevTools](https://www.deque.com/axe/devtools/)
- [Playwright Accessibility Testing](https://playwright.dev/docs/accessibility-testing)

---

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>
