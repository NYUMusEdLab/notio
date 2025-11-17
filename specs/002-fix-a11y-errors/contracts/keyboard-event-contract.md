# Keyboard Event Contract

**Version**: 1.0.0
**Date**: 2025-11-14
**Purpose**: Define standard keyboard event handlers for all interactive components

---

## Standard Keyboard Handler Interface

All interactive elements that respond to `onClick` MUST also respond to keyboard activation.

### Required Pattern

```jsx
const handleKeyDown = (event) => {
  // Activate on Enter or Space key
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault(); // Prevent Space from scrolling page
    handleClick(event);     // Call the same handler as onClick
  }
};

<div
  onClick={handleClick}
  onKeyDown={handleKeyDown}
  tabIndex={0}
  role="button"
>
  Interactive Content
</div>
```

### Key Requirements

1. **Keys Supported**: `Enter` and `Space` (both required for button-like elements)
2. **Event Prevention**: Call `event.preventDefault()` on Space to prevent page scroll
3. **Handler Reuse**: Keyboard handler MUST call the same logic as mouse click handler
4. **Tab Index**: Element MUST have `tabIndex={0}` to be keyboard focusable
5. **ARIA Role**: Element MUST have appropriate role (see ARIA contract)

---

## Component-Specific Implementations

### ColorKey.js

**Context**: Interactive color key that plays note on click, shows info on hover

**Implementation**:
```jsx
class ColorKey extends React.Component {
  // Add keyboard handler method
  handleKeyDown = (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      // Trigger same action as mouse click
      this.clickedMouse(event);
    }
  };

  render() {
    return (
      <div
        // Existing mouse handlers
        onMouseDown={this.clickedMouse}
        onMouseUp={this.unClickedMouse}
        onMouseOver={this.onMouseOver}
        onMouseOut={this.onMouseOut}
        // ADD: Keyboard handlers
        onKeyDown={this.handleKeyDown}
        onFocus={this.onMouseOver}   // Same as hover
        onBlur={this.onMouseOut}     // Same as unhover
        // ADD: Focusability
        tabIndex={0}
        // ADD: Role (see ARIA contract)
        role="button"
        // ... existing props
      >
        {/* content */}
      </div>
    );
  }
}
```

**Behavior**:
- Enter/Space: Trigger note playback (same as click)
- Focus: Show note information (same as hover)
- Blur: Hide note information (same as unhover)

---

### PianoKey.js

**Context**: Piano key element that plays note on click

**Implementation**:
```jsx
class PianoKey extends React.Component {
  handleKeyDown = (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      // Trigger same action as click
      this.props.onClick(event);
    }
  };

  render() {
    return (
      <div
        onClick={this.props.onClick}
        // ADD: Keyboard support
        onKeyDown={this.handleKeyDown}
        tabIndex={0}
        role="button"
        aria-label={`Play ${this.props.note}`}
        // ... existing props
      >
        {/* content */}
      </div>
    );
  }
}
```

**Behavior**:
- Enter/Space: Play note (same as click)

---

### DropdownCustomScaleMenu.js

**Context**: Menu items that select scale option

**Implementation**:
```jsx
const DropdownCustomScaleMenu = ({ scales, onSelectScale }) => {
  const handleKeyDown = (scale) => (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onSelectScale(scale);
    }
  };

  return (
    <div className="dropdown-menu">
      {scales.map((scale) => (
        <div
          key={scale.id}
          onClick={() => onSelectScale(scale)}
          // ADD: Keyboard support
          onKeyDown={handleKeyDown(scale)}
          tabIndex={0}
          role="menuitem"
          // ... existing props
        >
          {scale.name}
        </div>
      ))}
    </div>
  );
};
```

**Behavior**:
- Enter/Space: Select scale (same as click)

---

### ShareButton.js

**Context**: Button that triggers share action

**Implementation**:
```jsx
const ShareButton = ({ onShare }) => {
  const handleKeyDown = (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onShare(event);
    }
  };

  return (
    <div
      className="share-button"
      onClick={onShare}
      // ADD: Keyboard support
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="button"
      aria-label="Share"
      // ... existing props
    >
      <ShareIcon />
    </div>
  );
};
```

**Behavior**:
- Enter/Space: Trigger share (same as click)

---

### SubMenu.js

**Context**: Submenu navigation items

**Implementation**:
```jsx
const SubMenu = ({ items, onSelectItem }) => {
  const handleKeyDown = (item) => (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onSelectItem(item);
    }
  };

  return (
    <div className="submenu">
      {items.map((item) => (
        <div
          key={item.id}
          onClick={() => onSelectItem(item)}
          // ADD: Keyboard support
          onKeyDown={handleKeyDown(item)}
          tabIndex={0}
          role="menuitem"
          // ... existing props
        >
          {item.label}
        </div>
      ))}
    </div>
  );
};
```

**Behavior**:
- Enter/Space: Select menu item (same as click)

---

### VideoButton.js

**Context**: Button that opens video tutorial

**Implementation**:
```jsx
const VideoButton = ({ onOpenVideo }) => {
  const handleKeyDown = (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onOpenVideo(event);
    }
  };

  return (
    <div
      className="video-button"
      onClick={onOpenVideo}
      // ADD: Keyboard support
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="button"
      aria-label="Watch tutorial video"
      // ... existing props
    >
      <VideoIcon />
    </div>
  );
};
```

**Behavior**:
- Enter/Space: Open video (same as click)

---

## Tab Order Expectations

### Natural Tab Order (tabIndex={0})

All components MUST use `tabIndex={0}` to participate in natural tab order:

1. **ColorKey**: Tab through all color keys in DOM order (typically left-to-right)
2. **PianoKey**: Tab through piano keys in pitch order (low to high)
3. **Menu Items**: Tab through menu items in visual top-to-bottom order
4. **Buttons**: Tab reaches buttons in DOM order

### Avoid Positive tabIndex

- ❌ DO NOT use `tabIndex="1"`, `tabIndex="2"`, etc.
- ✅ Always use `tabIndex={0}` for focusable elements
- ✅ Use `tabIndex={-1}` ONLY for programmatic focus (not in initial scope)

---

## Testing Requirements

### Manual Testing

1. **Tab Navigation**: Tab key moves focus through all interactive elements in logical order
2. **Activation**: Enter key activates focused element (same result as click)
3. **Activation**: Space key activates focused element (same result as click)
4. **No Scroll**: Space key does NOT scroll page when activating element

### Automated Testing

```javascript
// Integration test example
import { render, fireEvent } from '@testing-library/react';

test('ColorKey responds to Enter key', () => {
  const handleClick = jest.fn();
  const { getByRole } = render(
    <ColorKey note="C" onClick={handleClick} />
  );

  const button = getByRole('button');
  fireEvent.keyDown(button, { key: 'Enter' });

  expect(handleClick).toHaveBeenCalled();
});

test('ColorKey responds to Space key', () => {
  const handleClick = jest.fn();
  const { getByRole } = render(
    <ColorKey note="C" onClick={handleClick} />
  );

  const button = getByRole('button');
  fireEvent.keyDown(button, { key: ' ' });

  expect(handleClick).toHaveBeenCalled();
});
```

---

## Compliance Checklist

- [ ] All elements with `onClick` also have `onKeyDown`
- [ ] `onKeyDown` handler checks for `Enter` and `Space` keys
- [ ] `event.preventDefault()` called on Space key
- [ ] Keyboard handler calls same logic as mouse handler
- [ ] All interactive elements have `tabIndex={0}`
- [ ] Tab order follows logical visual sequence
- [ ] Manual keyboard testing passes
- [ ] Automated keyboard tests pass

---

## References

- [ARIA Authoring Practices - Button Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/button/)
- [WCAG 2.1.1 - Keyboard (Level A)](https://www.w3.org/WAI/WCAG21/Understanding/keyboard.html)
- [React SyntheticEvent - keyboard](https://react.dev/reference/react-dom/components/common#react-event-object)
