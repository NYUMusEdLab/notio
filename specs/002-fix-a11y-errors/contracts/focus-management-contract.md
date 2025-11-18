# Focus Management Contract

**Version**: 1.0.0
**Date**: 2025-11-14
**Purpose**: Define focus visibility and management requirements

---

## Focus Indicator Requirements

### WCAG 2.4.7 Focus Visible (Level AA)

All interactive elements MUST have a visible focus indicator when focused via keyboard.

**Strategy**: Rely on browser default focus indicators initially (compliant with WCAG)

---

## Browser Default Focus Indicators

### Decision: Use Browser Defaults

**Rationale**:
- Modern browsers provide WCAG-compliant focus indicators
- No custom CSS needed initially (simplicity, YAGNI principle)
- Respects user's OS/browser preferences (accessibility best practice)
- Saves development and testing time

**What browsers provide**:
- **Chrome/Edge**: Blue outline (2px solid #4285F4)
- **Firefox**: Dotted outline (1px dotted)
- **Safari**: Blue outline with shadow

**Compliance**:
- All browser defaults meet WCAG 2.4.7 (Focus Visible)
- Most meet WCAG 2.4.11 (Focus Appearance - Level AA) for contrast

---

## CSS Requirements

### DO: Preserve Browser Defaults

```css
/* No custom focus styles needed initially */
.color-key:focus,
.piano-key:focus,
.menu-item:focus {
  /* Browser default outline will show */
}
```

### DON'T: Remove Outlines Without Replacement

```css
/* ❌ NEVER do this without providing alternative */
.button {
  outline: none;  /* Fails WCAG 2.4.7 */
}

/* ✅ If removing outline, provide visible alternative */
.button {
  outline: none;
}

.button:focus {
  box-shadow: 0 0 0 3px rgba(74, 144, 226, 0.5);
  border: 2px solid #4A90E2;
}
```

---

## Future Enhancement: Custom Focus Styles

**Not implementing initially** (YAGNI), but documented for future reference:

### Custom Focus Indicator Pattern

```css
/* Future enhancement example */
.color-key:focus,
.piano-key:focus {
  outline: 2px solid #4A90E2;        /* Primary indicator */
  outline-offset: 2px;               /* Separation from element */
  box-shadow: 0 0 0 4px rgba(74, 144, 226, 0.3);  /* Secondary glow */
}

/* Ensure contrast meets WCAG 2.4.11 (3:1 minimum) */
```

### WCAG 2.4.11 Focus Appearance Requirements (Level AA)

If implementing custom focus indicators, they MUST meet:

1. **Minimum Size**: At least 2 CSS pixels thick
2. **Contrast**: 3:1 minimum against adjacent colors
3. **Visibility**: Must not be obscured by other content
4. **Persistence**: Remains visible while element has focus

**Calculation Example**:
```text
Focus outline: #4A90E2 (blue)
Background: #FFFFFF (white)
Contrast: 4.5:1 ✅ (exceeds 3:1 minimum)
```

---

## Focus Management for onMouseOver/onMouseOut

### Requirement: Match Focus to Hover Behavior

**ESLint Rule**: `jsx-a11y/mouse-events-have-key-events`

**Pattern**:
```jsx
<div
  onMouseOver={this.showInfo}
  onMouseOut={this.hideInfo}
  // MUST ADD:
  onFocus={this.showInfo}   // Same behavior as onMouseOver
  onBlur={this.hideInfo}    // Same behavior as onMouseOut
  tabIndex={0}
>
  Hoverable Content
</div>
```

**Rationale**:
- Keyboard users must access same information as mouse users
- WCAG 1.4.13: Content on Hover or Focus
- Ensures feature parity between input methods

---

## Component-Specific Focus Behavior

### ColorKey.js

**Focus Behavior**:
```jsx
<div
  onMouseOver={this.onMouseOver}  // Shows note info
  onMouseOut={this.onMouseOut}    // Hides note info
  onFocus={this.onMouseOver}      // Shows note info (same as hover)
  onBlur={this.onMouseOut}        // Hides note info (same as unhover)
  tabIndex={0}
  role="button"
>
  C
</div>
```

**Expected User Experience**:
1. User tabs to ColorKey → receives focus
2. Browser shows focus outline (blue ring)
3. onFocus handler triggered → note info appears
4. User tabs away → loses focus
5. onBlur handler triggered → note info disappears

**Visual Indicators**:
- Browser default focus outline (blue ring around element)
- Note information overlay (triggered by onFocus, same as onMouseOver)

---

### PianoKey.js

**Focus Behavior**:
```jsx
<div
  onClick={this.playNote}
  onKeyDown={this.handleKeyDown}
  tabIndex={0}
  role="button"
>
  C
</div>
```

**Expected User Experience**:
1. User tabs to PianoKey → receives focus
2. Browser shows focus outline
3. No additional visual feedback needed (focus outline sufficient)
4. User presses Enter/Space → note plays

**Visual Indicators**:
- Browser default focus outline only

---

### Menu Components (DropdownCustomScaleMenu, SubMenu)

**Focus Behavior**:
```jsx
<div
  onClick={this.selectOption}
  onKeyDown={this.handleKeyDown}
  tabIndex={0}
  role="menuitem"
>
  Major Scale
</div>
```

**Expected User Experience**:
1. User tabs to menu item → receives focus
2. Browser shows focus outline
3. No additional hover effects needed
4. User presses Enter/Space → option selected

**Visual Indicators**:
- Browser default focus outline

---

### Button Components (ShareButton, VideoButton)

**Focus Behavior**:
```jsx
<div
  onClick={this.handleClick}
  onKeyDown={this.handleKeyDown}
  tabIndex={0}
  role="button"
  aria-label="Share"
>
  <ShareIcon />
</div>
```

**Expected User Experience**:
1. User tabs to button → receives focus
2. Browser shows focus outline around icon
3. User presses Enter/Space → action triggered

**Visual Indicators**:
- Browser default focus outline around icon/button area

---

## Focus Order (Tab Order)

### Natural Tab Order with tabIndex={0}

All components use `tabIndex={0}` to participate in natural tab order (DOM order).

**Expected Tab Flow**:
1. **ColorKey components**: Tab through all color keys (left-to-right, top-to-bottom)
2. **PianoKey components**: Tab through piano keys (low pitch to high pitch)
3. **Menu items**: Tab through menu in visual order
4. **Action buttons**: Tab through buttons in DOM order

**Verification**:
- Press Tab key repeatedly
- Focus moves logically through interface
- No focus traps (always able to tab forward)
- Shift+Tab moves backward through same order

---

## Focus Traps (Not Implemented)

**Focus trap**: Confining keyboard focus within a modal/dialog

**Status**: NOT implementing focus traps in initial scope (YAGNI)

**Rationale**:
- No modal dialogs in affected components
- Dropdown menus don't require focus trap (can tab away)
- Can be added if modals are added in future

**Future Implementation** (if needed):
```javascript
// Example focus trap for modal
const FocusTrapped Modal = ({ isOpen, onClose }) => {
  const modalRef = useRef();

  useEffect(() => {
    if (isOpen) {
      const focusableElements = modalRef.current.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      // Trap focus within modal
      const handleTabKey = (e) => {
        if (e.key === 'Tab') {
          if (e.shiftKey && document.activeElement === firstElement) {
            lastElement.focus();
            e.preventDefault();
          } else if (!e.shiftKey && document.activeElement === lastElement) {
            firstElement.focus();
            e.preventDefault();
          }
        }
      };

      document.addEventListener('keydown', handleTabKey);
      firstElement.focus();

      return () => document.removeEventListener('keydown', handleTabKey);
    }
  }, [isOpen]);

  return isOpen ? <div ref={modalRef}>...</div> : null;
};
```

---

## Testing Requirements

### Manual Focus Testing

**Test Procedure**:
1. Open application in browser
2. Click address bar to ensure page has focus
3. Press Tab key repeatedly
4. Verify for each focusable element:
   - [ ] Focus outline is visible
   - [ ] Focus outline has sufficient contrast
   - [ ] onFocus handler triggers (for ColorKey, same as onMouseOver)
   - [ ] Focus order is logical (follows visual layout)
5. Press Shift+Tab to move backward
   - [ ] Focus moves in reverse order
6. Test in multiple browsers:
   - [ ] Chrome/Edge
   - [ ] Firefox
   - [ ] Safari

**Accessibility Inspector**:
- Open browser DevTools → Accessibility tab
- Verify focus indicator meets contrast requirements
- Check focus order in accessibility tree

### Automated Focus Testing

```javascript
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

test('Tab key moves focus through components', async () => {
  const { getByRole } = render(
    <div>
      <ColorKey note="C" />
      <ColorKey note="D" />
      <ColorKey note="E" />
    </div>
  );

  const user = userEvent.setup();

  // Tab to first element
  await user.tab();
  expect(getByRole('button', { name: /C/i })).toHaveFocus();

  // Tab to second element
  await user.tab();
  expect(getByRole('button', { name: /D/i })).toHaveFocus();

  // Tab to third element
  await user.tab();
  expect(getByRole('button', { name: /E/i })).toHaveFocus();
});

test('onFocus handler triggers when element receives focus', async () => {
  const handleFocus = jest.fn();
  const { getByRole } = render(
    <div onFocus={handleFocus} tabIndex={0} role="button">
      Button
    </div>
  );

  const user = userEvent.setup();
  await user.tab();

  expect(handleFocus).toHaveBeenCalled();
});
```

---

## Compliance Checklist

- [ ] All interactive elements show visible focus indicator
- [ ] Focus indicators meet WCAG 2.4.7 (visible when focused)
- [ ] onMouseOver paired with onFocus (same behavior)
- [ ] onMouseOut paired with onBlur (same behavior)
- [ ] tabIndex={0} used for all custom interactive elements
- [ ] Tab order follows logical visual sequence
- [ ] Shift+Tab moves backward through same order
- [ ] Manual keyboard testing passes in 3 browsers
- [ ] Automated focus tests pass
- [ ] No outline: none without visible alternative

---

## References

- [WCAG 2.4.7 - Focus Visible (Level AA)](https://www.w3.org/WAI/WCAG21/Understanding/focus-visible.html)
- [WCAG 2.4.11 - Focus Appearance (Level AA)](https://www.w3.org/WAI/WCAG22/Understanding/focus-appearance.html)
- [WCAG 1.4.13 - Content on Hover or Focus](https://www.w3.org/WAI/WCAG21/Understanding/content-on-hover-or-focus.html)
- [MDN - :focus pseudo-class](https://developer.mozilla.org/en-US/docs/Web/CSS/:focus)
- [WebAIM - Keyboard Accessibility - Focus Indicators](https://webaim.org/techniques/keyboard/)
