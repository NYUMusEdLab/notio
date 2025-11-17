# Accessibility Testing Quickstart Guide

**Feature**: 002-fix-a11y-errors
**Date**: 2025-11-14
**Purpose**: Quick reference for testing keyboard accessibility and ARIA compliance

---

## Local Development Testing

### 1. Run Build to Check ESLint Compliance

**Command**:
```bash
yarn build
```

**Expected Output** (SUCCESS):
```text
Creating an optimized production build...
Compiled successfully.

File sizes after gzip:

  XX.XX KB  build/static/js/main.XXXXXXXX.js
  XX.XX KB  build/static/css/main.XXXXXXXX.css

The build folder is ready to be deployed.
```

**Expected Output** (FAILURE):
```text
Failed to compile.

[eslint]
src/components/keyboard/ColorKey.js
  Line 183:7:  onMouseOver must be accompanied by onFocus for accessibility
  Line 183:7:  onMouseOut must be accompanied by onBlur for accessibility
  Line 183:7:  Avoid non-native interactive elements. If using native HTML is not possible, add an appropriate role and...

Search for the keywords to learn more about each error.
```

**Verification**:
- ✅ Build completes without ESLint errors
- ✅ No accessibility warnings in output
- ✅ Build folder created successfully

---

### 2. Manual Keyboard Navigation Testing

**Start Local Server**:
```bash
yarn start
```

**Test Procedure**:

1. **Open application in browser** (http://localhost:3000)

2. **Focus the page**:
   - Click browser address bar
   - Press Tab to move focus into page content

3. **Test Tab Navigation**:
   - Press `Tab` repeatedly
   - Verify:
     - [ ] Focus moves through all interactive elements (color keys, piano keys, buttons, menus)
     - [ ] Focus order is logical (left-to-right, top-to-bottom)
     - [ ] Every focused element has a visible outline/indicator
     - [ ] No elements are skipped or unreachable

4. **Test Shift+Tab Navigation**:
   - Press `Shift+Tab` repeatedly
   - Verify:
     - [ ] Focus moves backward through same elements
     - [ ] Reverse order matches forward order

5. **Test Keyboard Activation**:
   - Tab to a ColorKey or PianoKey
   - Press `Enter` key
   - Verify:
     - [ ] Note plays (same as clicking with mouse)
   - Press `Space` key
   - Verify:
     - [ ] Note plays (same as clicking with mouse)
     - [ ] Page does NOT scroll

6. **Test Focus==Hover Parity**:
   - Mouse over a ColorKey
   - Observe what information appears (note name, etc.)
   - Tab to the same ColorKey
   - Verify:
     - [ ] Same information appears as with mouse hover
     - [ ] Visual feedback is identical

**Browsers to Test**:
- [ ] Chrome
- [ ] Firefox
- [ ] Safari

---

### 3. Screen Reader Testing

#### VoiceOver (macOS)

**Enable VoiceOver**:
- Press `Cmd + F5`
- Or: System Settings → Accessibility → VoiceOver → Enable

**Navigation Commands**:
- `VO` = `Ctrl + Option`
- `VO + Right Arrow`: Next element
- `VO + Left Arrow`: Previous element
- `VO + Space`: Activate element
- `VO + A`: Read all
- `VO + U`: Rotor (navigation menu)

**Test Procedure**:
1. Enable VoiceOver
2. Navigate to application in browser
3. Press `VO + Right Arrow` repeatedly
4. Verify each interactive element announces:
   - [ ] Element type ("button", "menu item")
   - [ ] Element label ("Play C", "Major Scale", "Share")
   - [ ] State (if applicable)

**Example Announcements**:
- ColorKey: "C, button"
- PianoKey: "Play C, button"
- Menu item: "Major Scale, menu item"
- ShareButton: "Share, button"

**Disable VoiceOver**:
- Press `Cmd + F5` again

---

#### NVDA (Windows)

**Download NVDA**: https://www.nvaccess.org/download/

**Enable NVDA**:
- Run NVDA installer
- Press `Ctrl + Alt + N` to start

**Navigation Commands**:
- `Down Arrow`: Next element
- `Up Arrow`: Previous element
- `Enter` or `Space`: Activate element
- `Insert + Down Arrow`: Read all
- `Insert + F7`: Elements list

**Test Procedure**:
1. Start NVDA
2. Navigate to application in browser
3. Press `Down Arrow` repeatedly
4. Verify same announcements as VoiceOver testing

**Quit NVDA**:
- `Insert + Q`

---

### 4. Browser DevTools Accessibility Inspector

#### Chrome DevTools

**Open Accessibility Inspector**:
1. Open DevTools: `F12` or `Cmd + Option + I`
2. Click "Elements" tab
3. Look for "Accessibility" sub-tab (bottom panel)
4. Click on an element in the page

**Verify**:
- [ ] **Role**: Shows "button" or "menuitem"
- [ ] **Name**: Shows accessible name (e.g., "Play C")
- [ ] **Focusable**: Shows "yes"
- [ ] **Keyboard-focusable**: Shows "yes"

**Accessibility Tree**:
1. In Elements tab, click three-dot menu
2. Select "Show Accessibility Tree"
3. Verify focus order matches visual layout

---

#### Firefox Accessibility Inspector

**Open Accessibility Inspector**:
1. Open DevTools: `F12`
2. Click "Accessibility" tab
3. Click "Check for issues" dropdown
4. Select "Keyboard" to check keyboard accessibility

**Verify**:
- [ ] No "Keyboard" issues reported
- [ ] All interactive elements have roles
- [ ] All interactive elements are keyboard-focusable

---

### 5. Run Automated Accessibility Tests

**Run Integration Tests**:
```bash
npm test:a11y
```

**Expected Output**:
```text
PASS  src/__integration__/accessibility/keyboard-navigation.test.js
PASS  src/__integration__/accessibility/keyboard-piano.test.js
PASS  src/__integration__/accessibility/screen-reader.test.js

Test Suites: 3 passed, 3 total
Tests:       15 passed, 15 total
```

**Run All Tests**:
```bash
yarn test-ci
```

**Expected Output**:
```text
PASS  src/__integration__/accessibility/*.test.js
PASS  src/__tests__/unit/accessibility/*.test.js

Test Suites: X passed, X total
Tests:       X passed, X total
Snapshots:   X passed, X total
Coverage:    100% statements, 100% branches, 100% functions, 100% lines
```

---

### 6. Run E2E Accessibility Tests

**Run Playwright E2E Tests**:
```bash
npm test:e2e
```

**Run E2E with Accessibility Checks**:
```bash
npm test:e2e -- e2e/accessibility/
```

**Expected Output**:
```text
Running 2 tests using 1 worker

  ✓ keyboard-workflow.spec.js:8:1 › Complete keyboard-only user journey (5s)
  ✓ cross-browser-a11y.spec.js:8:1 › Cross-browser keyboard + axe validation (3s)

  2 passed (8s)
```

**Run Headed Mode (See Browser)**:
```bash
npm test:e2e:headed -- e2e/accessibility/
```

---

## CI/CD Testing

### GitHub Actions

**Triggered on**:
- Pull request creation
- Push to feature branch

**Workflow**:
1. Checkout code
2. Install dependencies (yarn)
3. Run unit + integration tests (yarn test-ci)
4. Results visible in PR checks

**Verify**:
- [ ] All tests pass
- [ ] No ESLint errors
- [ ] Coverage meets 100% requirement

---

### Netlify Build

**Triggered on**:
- Pull request creation
- Push to feature branch

**Build Command**: `yarn build`

**Expected Outcome**:
- ✅ Build succeeds
- ✅ No ESLint accessibility errors
- ✅ Deploy preview available

**Failure Scenario**:
```text
Failed to compile.

[eslint]
src/components/keyboard/ColorKey.js
  Line 183:7:  onMouseOver must be accompanied by onFocus for accessibility
  ...
```

**Action**:
- Fix ESLint errors locally
- Test with `yarn build`
- Commit and push fixes

---

## Quick Checklist: Before Merging PR

### Code Changes
- [ ] All 6 components updated (ColorKey, PianoKey, DropdownCustomScaleMenu, ShareButton, SubMenu, VideoButton)
- [ ] All components have `onKeyDown` handlers
- [ ] All components with `onMouseOver/Out` also have `onFocus/Blur`
- [ ] All components have `tabIndex={0}`
- [ ] All components have appropriate ARIA `role`
- [ ] Icon-only components have `aria-label`

### Build & ESLint
- [ ] `yarn build` completes successfully
- [ ] No ESLint accessibility errors
- [ ] Build output created in /build folder

### Manual Testing
- [ ] Tab navigation works in all 3 browsers (Chrome, Firefox, Safari)
- [ ] Enter key activates all interactive elements
- [ ] Space key activates all interactive elements
- [ ] Focus matches hover behavior (ColorKey)
- [ ] Focus indicators are visible
- [ ] Screen reader announces roles and labels correctly

### Automated Testing
- [ ] `npm test:a11y` passes (integration tests)
- [ ] `yarn test-ci` passes (all tests)
- [ ] `npm test:e2e` passes (E2E tests)
- [ ] Coverage remains at 100%

### CI/CD
- [ ] GitHub Actions workflow passes
- [ ] Netlify build succeeds
- [ ] Deploy preview available and functional

---

## Troubleshooting

### Issue: yarn build fails with ESLint errors

**Solution**:
1. Read error message to identify component and line number
2. Refer to contracts:
   - [keyboard-event-contract.md](./contracts/keyboard-event-contract.md)
   - [aria-attributes-contract.md](./contracts/aria-attributes-contract.md)
   - [focus-management-contract.md](./contracts/focus-management-contract.md)
3. Add missing attributes/handlers
4. Re-run `yarn build`

---

### Issue: Tab navigation skips an element

**Diagnosis**:
- Element missing `tabIndex={0}`

**Solution**:
```jsx
<div
  onClick={handleClick}
  tabIndex={0}  // Add this
  role="button"
>
  Content
</div>
```

---

### Issue: Space key scrolls page instead of activating button

**Diagnosis**:
- Missing `event.preventDefault()` in `onKeyDown` handler

**Solution**:
```jsx
const handleKeyDown = (event) => {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault();  // Add this
    handleClick();
  }
};
```

---

### Issue: Screen reader doesn't announce button role

**Diagnosis**:
- Missing `role="button"` attribute

**Solution**:
```jsx
<div
  onClick={handleClick}
  onKeyDown={handleKeyDown}
  tabIndex={0}
  role="button"  // Add this
>
  Content
</div>
```

---

### Issue: Focus indicator not visible

**Diagnosis**:
- CSS may have `outline: none` without replacement
- Check browser zoom level (sometimes outline too thin)

**Solution**:
1. Search CSS for `outline: none`
2. Remove or replace with visible alternative
3. Test at 100% zoom

---

## References

- **Contracts**:
  - [Keyboard Event Contract](./contracts/keyboard-event-contract.md)
  - [ARIA Attributes Contract](./contracts/aria-attributes-contract.md)
  - [Focus Management Contract](./contracts/focus-management-contract.md)

- **Research**: [research.md](./research.md)

- **External Resources**:
  - [WCAG 2.1 Quick Reference](https://www.w3.org/WAI/WCAG21/quickref/)
  - [ARIA Authoring Practices Guide](https://www.w3.org/WAI/ARIA/apg/)
  - [WebAIM Keyboard Accessibility](https://webaim.org/techniques/keyboard/)
  - [MDN Accessibility](https://developer.mozilla.org/en-US/docs/Web/Accessibility)

---

## Support

**Questions about accessibility implementation?**
- Review contracts in [./contracts/](./contracts/)
- Review research findings in [./research.md](./research.md)
- Consult WCAG guidelines (linked above)

**Build failures?**
- Check ESLint error messages
- Verify all contracts implemented
- Test locally with `yarn build` before pushing
