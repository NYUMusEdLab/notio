# Quickstart: Testing Menu Arrow Key Navigation

**Feature**: 003-menu-arrow-navigation
**Date**: 2025-11-15

## Purpose

This guide explains how to manually and automatically test arrow key navigation in dropdown menus.

## Manual Testing

### Prerequisites

- Development server running (`yarn start`)
- Browser open to `http://localhost:3000`

### Test Procedure

#### 1. Basic Arrow Key Navigation

1. **Tab to a menu trigger** (e.g., "Notation" menu)
   - Verify: Focus indicator appears on trigger

2. **Press Enter or Space** to open menu
   - Verify: Menu opens
   - Verify: Focus remains on trigger (not on first menu item)

3. **Press Down Arrow**
   - Verify: Focus moves to first menu item
   - Verify: Focus indicator is visible

4. **Press Down Arrow multiple times**
   - Verify: Focus moves through menu items sequentially
   - Verify: Disabled items are skipped (if any)

5. **Press Down Arrow on last item**
   - Verify: Focus wraps to first menu item (circular navigation)

6. **Press Up Arrow**
   - Verify: Focus moves to previous menu item
   - Verify: Disabled items are skipped

7. **Press Up Arrow on first item**
   - Verify: Focus wraps to last menu item

#### 2. Home/End Key Navigation

1. **Open menu and navigate to middle item**

2. **Press Home key**
   - Verify: Focus jumps to first menu item

3. **Press End key**
   - Verify: Focus jumps to last menu item

#### 3. Menu Activation

1. **Navigate to a menu item with arrow keys**

2. **Press Enter or Space**
   - Verify: Menu item action executes
   - Verify: Menu closes
   - Verify: Focus returns to trigger (or appropriate element)

#### 4. Escape Key

1. **Open menu and navigate with arrow keys**

2. **Press Escape**
   - Verify: Menu closes
   - Verify: Focus returns to trigger

#### 5. Tab Key Behavior

1. **Open menu**

2. **Press Tab**
   - Verify: Focus moves to next focusable element on page
   - Verify: Menu remains open (does not close)

3. **Press Shift+Tab to return**
   - Verify: Focus returns to menu area
   - Verify: Menu still open

#### 6. Submenu/Overlay Interaction (CustomScale)

1. **Navigate to "Customize" menu item**

2. **Press Enter or Space**
   - Verify: CustomScale overlay opens

3. **Press Escape**
   - Verify: Overlay closes
   - Verify: Focus returns to "Customize" menu item

4. **Press Escape again**
   - Verify: Parent menu closes
   - Verify: Focus returns to trigger

### Test Checklist

- [ ] Arrow Down navigates to next enabled item
- [ ] Arrow Up navigates to previous enabled item
- [ ] Wrapping works (last to first, first to last)
- [ ] Disabled items are skipped
- [ ] Home/End keys jump to first/last items
- [ ] Enter/Space activates items
- [ ] Escape closes menu and restores focus
- [ ] Tab exits menu without closing it
- [ ] Focus indicators are visible throughout
- [ ] Submenu/overlay keyboard navigation works

## Automated Testing

### Running Jest Integration Tests

```bash
# Run all accessibility integration tests
npm test -- src/__integration__/accessibility

# Run specific menu navigation test
npm test -- menu-keyboard-navigation.test.js

# Run with coverage report
npm test -- --coverage src/__integration__/accessibility
```

**What to verify**:
- All tests pass
- Coverage reports show 100% for menu components
- jest-axe reports zero accessibility violations

### Running Playwright E2E Tests

```bash
# Run all E2E accessibility tests
npm run test:e2e -- e2e/accessibility

# Run specific menu workflow test
npm run test:e2e -- e2e/accessibility/menu-keyboard-workflow.spec.js

# Run with headed browser (see what's happening)
npm run test:e2e -- e2e/accessibility --headed

# Run in specific browser
npm run test:e2e -- e2e/accessibility --project=firefox
```

**What to verify**:
- All E2E tests pass across browsers (Chrome, Firefox, Safari)
- Axe accessibility scans report zero violations
- Keyboard workflows complete successfully

### Running Accessibility Audit

```bash
# Build the application
yarn build

# Run ESLint to check for jsx-a11y violations
yarn lint

# Expected: Zero ESLint jsx-a11y errors
```

## Browser DevTools Testing

### Using Accessibility Inspector

**Chrome DevTools**:
1. Open DevTools (F12)
2. Go to "Accessibility" tab
3. Select menu trigger element
4. Verify:
   - Role: `button`
   - Name: Descriptive label
   - State: `aria-expanded` present

5. Open menu and select menu item
6. Verify:
   - Role: `menuitem`
   - State: `aria-disabled` if disabled

**Firefox Accessibility Inspector**:
1. Open DevTools (F12)
2. Go to "Accessibility" tab
3. Enable accessibility features if prompted
4. Navigate accessibility tree
5. Verify ARIA roles and states match expectations

### Focus Ring Visibility Test

1. Tab through page and open a menu
2. Navigate with arrow keys
3. Take screenshots of each focused state
4. Verify:
   - Focus indicator is visible (not `outline: none`)
   - Contrast meets WCAG AA standards (3:1 minimum)
   - Focus indicator is consistent across browsers

## Screen Reader Testing

### macOS VoiceOver

**Enable VoiceOver**: Cmd + F5

**Test Procedure**:
1. Navigate to menu trigger with VoiceOver cursor
   - Expected announcement: "Menu name, button, collapsed" (or similar)

2. Activate trigger with VO+Space
   - Expected announcement: "Menu name, button, expanded"

3. Press Down Arrow
   - Expected announcement: "Menu item name, menu item"

4. Continue navigating with arrow keys
   - Expected: Each menu item announced with role and name

5. If item is disabled:
   - Expected announcement: "Menu item name, dimmed, menu item"

### Windows NVDA (if available)

**Enable NVDA**: Ctrl+Alt+N

**Test Procedure**:
Similar to VoiceOver test above, verify menu and menuitem roles are announced correctly.

## Common Issues and Troubleshooting

### Focus not visible

- Check CSS for `outline: none` without replacement
- Verify `tabIndex={0}` or `tabIndex={-1}` is set appropriately
- Test in multiple browsers (Safari sometimes has different default focus styles)

### Arrow keys not working

- Verify menu is actually open (`active: true` state)
- Check `onKeyDown` handler is attached to correct element
- Ensure `event.preventDefault()` is called for arrow keys
- Check browser console for JavaScript errors

### Disabled items not being skipped

- Verify `aria-disabled="true"` is set on disabled items
- Check `isMenuItemDisabled()` function logic
- Ensure refs array is populated correctly

### Focus not returning to trigger on Escape

- Verify trigger has a ref (`triggerRef`)
- Check `triggerRef.current?.focus()` is called on menu close
- Ensure Escape key handler calls close function

### Tests failing

- Check test setup (mocks, providers)
- Verify menu items are rendered before testing navigation
- Use `screen.debug()` to see rendered output
- Check for timing issues (use `await` with user interactions)

## Additional Resources

- [ARIA Authoring Practices - Menu Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/menu/)
- [React Testing Library - Keyboard Interactions](https://testing-library.com/docs/user-event/keyboard)
- [Playwright Accessibility Testing](https://playwright.dev/docs/accessibility-testing)
- [WCAG 2.1 - Keyboard Accessible](https://www.w3.org/WAI/WCAG21/quickref/?showtechniques=211#keyboard-accessible)

## Reporting Issues

If you encounter issues during testing:

1. Document the exact steps to reproduce
2. Note the browser and version
3. Capture screenshots showing the issue
4. Check browser console for errors
5. Verify the issue exists in latest code on branch `003-menu-arrow-navigation`
6. Report via project issue tracker with `accessibility` label
