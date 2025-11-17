# ARIA Attributes Contract

**Version**: 1.0.0
**Date**: 2025-11-14
**Purpose**: Define ARIA roles and attributes for screen reader compatibility

---

## Component ARIA Role Mapping

| Component | ARIA Role | Required Attributes | Optional Attributes |
|-----------|-----------|---------------------|---------------------|
| ColorKey.js | `button` | `tabIndex={0}` | `aria-label` (if icon only) |
| PianoKey.js | `button` | `tabIndex={0}` | `aria-label="Play {note}"` |
| DropdownCustomScaleMenu.js | `menuitem` | `tabIndex={0}` | None |
| ShareButton.js | `button` | `tabIndex={0}`, `aria-label` | None |
| SubMenu.js | `menuitem` | `tabIndex={0}` | `aria-haspopup` (if nested) |
| VideoButton.js | `button` | `tabIndex={0}`, `aria-label` | None |

---

## Role Definitions

### role="button"

**Used for**: Elements that perform an action when activated (play note, open modal, trigger share)

**Requirements**:
- MUST respond to Enter and Space keys
- MUST be keyboard focusable (`tabIndex={0}`)
- SHOULD have accessible name (visible text or `aria-label`)

**Screen Reader Announcement**: "Play C, button" (role announced after label)

**Example**:
```jsx
<div
  role="button"
  tabIndex={0}
  aria-label="Play middle C"
  onClick={playNote}
  onKeyDown={handleKeyDown}
>
  <PlayIcon />
</div>
```

### role="menuitem"

**Used for**: Items within a menu or dropdown that select an option

**Requirements**:
- MUST respond to Enter and Space keys
- MUST be keyboard focusable (`tabIndex={0}`)
- Parent container SHOULD have `role="menu"` (optional for this scope)

**Screen Reader Announcement**: "Major Scale, menu item"

**Example**:
```jsx
<div
  role="menuitem"
  tabIndex={0}
  onClick={selectScale}
  onKeyDown={handleKeyDown}
>
  Major Scale
</div>
```

---

## Component-Specific ARIA Implementations

### ColorKey.js

**ARIA Requirements**:
```jsx
<div
  role="button"
  tabIndex={0}
  // aria-label optional - visible note name provides label
  data-testid={"ColorKey:" + note}
>
  C
</div>
```

**Screen Reader Behavior**:
- Focus: "C, button"
- Activation: Plays note (user hears audio feedback)

**Rationale**:
- Visible text "C" serves as accessible name
- No aria-label needed (avoid redundancy)
- role="button" indicates element is activatable

---

### PianoKey.js

**ARIA Requirements**:
```jsx
<div
  role="button"
  tabIndex={0}
  aria-label={`Play ${note}`}  // Enhanced context
>
  {note}
</div>
```

**Screen Reader Behavior**:
- Focus: "Play C, button"
- Activation: Plays note

**Rationale**:
- aria-label adds "Play" context (more descriptive than just "C")
- Helps users understand purpose of button
- Visual label still shows just "C" (not cluttered)

---

### DropdownCustomScaleMenu.js

**ARIA Requirements**:
```jsx
<div className="dropdown-menu" role="menu">  {/* Optional container role */}
  <div
    role="menuitem"
    tabIndex={0}
  >
    Major Scale
  </div>
  <div
    role="menuitem"
    tabIndex={0}
  >
    Minor Scale
  </div>
</div>
```

**Screen Reader Behavior**:
- Focus: "Major Scale, menu item"
- Navigation: Arrow keys (future enhancement, not in scope)

**Rationale**:
- role="menuitem" indicates selectable option
- Visible text "Major Scale" serves as accessible name
- Container role="menu" is optional but improves context

---

### ShareButton.js

**ARIA Requirements**:
```jsx
<div
  role="button"
  tabIndex={0}
  aria-label="Share"  // Required - icon only, no visible text
>
  <ShareIcon />
</div>
```

**Screen Reader Behavior**:
- Focus: "Share, button"
- Activation: Opens share modal/menu

**Rationale**:
- Icon-only button requires aria-label
- "Share" is clear and concise
- Could be more specific: "Share on social media" (but "Share" acceptable)

---

### SubMenu.js

**ARIA Requirements**:
```jsx
<div
  role="menuitem"
  tabIndex={0}
  aria-haspopup="true"  // Optional - if opens nested menu
>
  Settings
</div>
```

**Screen Reader Behavior**:
- Focus: "Settings, menu item, has popup"
- Activation: Opens submenu

**Rationale**:
- role="menuitem" for menu context
- aria-haspopup="true" indicates nested menu exists (optional enhancement)
- Visible text "Settings" serves as accessible name

---

### VideoButton.js

**ARIA Requirements**:
```jsx
<div
  role="button"
  tabIndex={0}
  aria-label="Watch tutorial video"  // Required - icon only
>
  <VideoIcon />
</div>
```

**Screen Reader Behavior**:
- Focus: "Watch tutorial video, button"
- Activation: Opens video player/modal

**Rationale**:
- Icon-only button requires aria-label
- "Watch tutorial video" is descriptive and actionable
- Could be shorter ("Tutorial video") but longer is clearer

---

## ARIA Labeling Best Practices

### When to Use aria-label

✅ **Use aria-label when**:
- Element has no visible text (icon only)
- Visible text is insufficient context (generic "Share" → "Share on Twitter")
- Visual label is redundant/cluttered ("Play" button showing play icon)

❌ **Don't use aria-label when**:
- Element already has descriptive visible text
- Text is already clear and actionable
- You want text visible to ALL users (use visible text instead)

### Aria-label Examples

```jsx
// ✅ Good - Icon only, needs label
<div role="button" aria-label="Play">
  <PlayIcon />
</div>

// ✅ Good - Generic text, label adds context
<div role="button" aria-label="Share on Twitter">
  Share
</div>

// ❌ Bad - Redundant, visible text already clear
<div role="button" aria-label="Play">
  Play
</div>

// ✅ Better - No aria-label needed
<div role="button">
  Play
</div>
```

---

## ARIA State Attributes (Not Implemented)

The following ARIA state attributes are NOT required for initial implementation but could be added in future enhancements:

### aria-pressed (Toggle Buttons)

```jsx
// Future enhancement for toggle buttons
<div
  role="button"
  aria-pressed={isActive}  // "true" or "false"
  onClick={toggle}
>
  Mute
</div>
```

**Use case**: Buttons that toggle between states (mute/unmute, play/pause)

### aria-expanded (Dropdown/Accordion)

```jsx
// Future enhancement for dropdown menus
<div
  role="button"
  aria-expanded={isOpen}  // "true" or "false"
  aria-haspopup="true"
  onClick={toggleMenu}
>
  Menu
</div>
```

**Use case**: Elements that expand/collapse content

### aria-selected (Selectable Items)

```jsx
// Future enhancement for selectable list items
<div
  role="option"  // Note: different role
  aria-selected={isSelected}  // "true" or "false"
>
  Option 1
</div>
```

**Use case**: Items in a selectable list (different from menu items)

**Rationale for not implementing**:
- Not required by current ESLint errors
- Adds implementation complexity (state management)
- YAGNI principle - implement only what's needed
- Can be added incrementally based on user testing feedback

---

## Accessibility Tree Expectations

### ColorKey.js Accessibility Tree

```text
button "C"
  ├─ Role: button
  ├─ Name: "C" (from text content)
  ├─ Focusable: yes (tabIndex=0)
  └─ States: focusable, clickable
```

### PianoKey.js Accessibility Tree

```text
button "Play C"
  ├─ Role: button
  ├─ Name: "Play C" (from aria-label)
  ├─ Focusable: yes (tabIndex=0)
  └─ States: focusable, clickable
```

### DropdownCustomScaleMenu.js Accessibility Tree

```text
menu
  ├─ menuitem "Major Scale"
  │   ├─ Role: menuitem
  │   ├─ Name: "Major Scale" (from text content)
  │   ├─ Focusable: yes (tabIndex=0)
  │   └─ States: focusable, clickable
  └─ menuitem "Minor Scale"
      ├─ Role: menuitem
      ├─ Name: "Minor Scale" (from text content)
      ├─ Focusable: yes (tabIndex=0)
      └─ States: focusable, clickable
```

---

## Testing Requirements

### Manual Testing with Screen Reader

**VoiceOver (Mac)**:
1. Enable: Cmd + F5
2. Navigate: VO + Right Arrow (Ctrl + Option + Right Arrow)
3. Activate: VO + Space

**NVDA (Windows)**:
1. Start: Ctrl + Alt + N
2. Navigate: Down Arrow
3. Activate: Enter or Space

**Test Checklist**:
- [ ] Each component announces correct role (button, menuitem)
- [ ] Each component announces descriptive name
- [ ] Focus order is logical (follows visual layout)
- [ ] Activation works with screen reader commands

### Automated Testing with jest-axe

```javascript
import { render } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';

expect.extend(toHaveNoViolations);

test('ColorKey has correct ARIA attributes', async () => {
  const { container } = render(<ColorKey note="C" />);

  // Automated accessibility check
  const results = await axe(container);
  expect(results).toHaveNoViolations();

  // Verify specific attributes
  const button = container.querySelector('[role="button"]');
  expect(button).toHaveAttribute('tabIndex', '0');
});
```

---

## Compliance Checklist

- [ ] All interactive elements have appropriate ARIA role
- [ ] All elements with role="button" respond to Enter/Space keys
- [ ] All elements with role="menuitem" respond to Enter/Space keys
- [ ] Icon-only elements have aria-label
- [ ] Text-only elements do NOT have redundant aria-label
- [ ] Accessibility tree shows correct roles and names
- [ ] Manual screen reader testing passes
- [ ] jest-axe automated tests pass

---

## References

- [ARIA Roles - W3C](https://www.w3.org/TR/wai-aria-1.2/#role_definitions)
- [ARIA Authoring Practices - Button](https://www.w3.org/WAI/ARIA/apg/patterns/button/)
- [ARIA Authoring Practices - Menu](https://www.w3.org/WAI/ARIA/apg/patterns/menu/)
- [ARIA Labels and Descriptions](https://www.w3.org/WAI/ARIA/apg/practices/names-and-descriptions/)
- [eslint-plugin-jsx-a11y - role](https://github.com/jsx-eslint/eslint-plugin-jsx-a11y/blob/main/docs/rules/role-has-required-aria-props.md)
