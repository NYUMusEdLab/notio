# Contract: Keyboard Navigation for Menus

**Feature**: 003-menu-arrow-navigation
**Version**: 1.0.0
**Date**: 2025-11-15

## Purpose

Define the keyboard navigation behavior for dropdown menu components, ensuring consistent arrow key navigation, circular wrapping, disabled item skipping, and proper integration with existing menu components.

## Scope

This contract applies to:
- `SubMenu.js` - Dropdown submenus with selectable items
- `DropdownCustomScaleMenu.js` - Custom scale menu trigger
- Any future menu components that contain navigable items

## Keyboard Event Handling

### Arrow Key Navigation

**Down Arrow (`ArrowDown`)**:
- **When**: Menu is open and user presses Down Arrow
- **If focus on trigger**: Move focus to first enabled menu item
- **If focus on menu item**: Move focus to next enabled menu item
- **If on last enabled item**: Wrap to first enabled item (circular navigation)
- **Behavior**: Skip all disabled items during navigation
- **preventDefault**: Yes (prevent page scrolling)

**Up Arrow (`ArrowUp`)**:
- **When**: Menu is open and user presses Up Arrow
- **If focus on trigger**: Move focus to first enabled menu item
- **If focus on menu item**: Move focus to previous enabled menu item
- **If on first enabled item**: Wrap to last enabled item (circular navigation)
- **Behavior**: Skip all disabled items during navigation
- **preventDefault**: Yes (prevent page scrolling)

**Home Key**:
- **When**: Menu is open and user presses Home
- **Behavior**: Move focus to first enabled menu item (regardless of current focus)
- **preventDefault**: Yes

**End Key**:
- **When**: Menu is open and user presses End
- **Behavior**: Move focus to last enabled menu item (regardless of current focus)
- **preventDefault**: Yes

**Enter/Space Key**:
- **On trigger**: Toggle menu open/closed
- **On menu item**: Activate item action and close menu
- **preventDefault**: Yes (prevent Space from scrolling page)

**Escape Key**:
- **When**: Menu is open
- **Behavior**: Close menu and return focus to trigger
- **If submenu open**: Close submenu first, return focus to parent menu item
- **preventDefault**: Yes

**Tab Key**:
- **When**: Menu is open
- **Behavior**: Allow default Tab behavior (focus moves to next focusable element in page)
- **Menu state**: Menu remains open
- **preventDefault**: No (allow natural tab order)

## State Management

### Focus Index Tracking

```typescript
interface MenuState {
  active: boolean;       // Menu open/closed
  focusedIndex: number;  // -1 = trigger, 0+ = menu item index
}
```

**Initial State**:
- `active: false`
- `focusedIndex: -1` (trigger has focus)

**When menu opens**:
- `active: true`
- `focusedIndex: -1` (focus remains on trigger per clarification)

**When arrow key pressed from trigger**:
- `focusedIndex: <index of first enabled item>`
- Programmatically focus that item

**When navigating between items**:
- Update `focusedIndex` to new item index
- Programmatically focus new item

**When menu closes**:
- `active: false`
- `focusedIndex: -1`
- Programmatically focus trigger

## Navigation Algorithm

### findNextEnabledIndex(currentIndex, direction)

```javascript
/**
 * Find the next enabled menu item index
 * @param {number} currentIndex - Current focused item index
 * @param {number} direction - 1 for down, -1 for up
 * @returns {number} Next enabled item index
 */
function findNextEnabledIndex(currentIndex, direction) {
  const items = menuItemRefs.current;
  const totalItems = items.length;
  let nextIndex = currentIndex;
  let attempts = 0;

  do {
    // Wrap using modulo arithmetic
    nextIndex = (nextIndex + direction + totalItems) % totalItems;
    attempts++;

    // Prevent infinite loop if all items disabled
    if (attempts > totalItems) {
      return currentIndex; // Stay on current item
    }
  } while (isMenuItemDisabled(items[nextIndex]));

  return nextIndex;
}

/**
 * Check if menu item is disabled
 * @param {HTMLElement} element - Menu item DOM element
 * @returns {boolean} True if disabled
 */
function isMenuItemDisabled(element) {
  return element?.hasAttribute('aria-disabled') &&
         element.getAttribute('aria-disabled') === 'true';
}
```

### findFirstEnabledItem()

```javascript
/**
 * Find the first enabled menu item index (for initial navigation from trigger)
 * @returns {number} First enabled item index, or 0 if all disabled
 */
function findFirstEnabledItem() {
  const items = menuItemRefs.current;
  for (let i = 0; i < items.length; i++) {
    if (!isMenuItemDisabled(items[i])) {
      return i;
    }
  }
  return 0; // Fallback if all disabled
}
```

### findLastEnabledItem()

```javascript
/**
 * Find the last enabled menu item index (for End key)
 * @returns {number} Last enabled item index, or length-1 if all disabled
 */
function findLastEnabledItem() {
  const items = menuItemRefs.current;
  for (let i = items.length - 1; i >= 0; i--) {
    if (!isMenuItemDisabled(items[i])) {
      return i;
    }
  }
  return items.length - 1; // Fallback if all disabled
}
```

## Implementation Requirements

### Menu Trigger Component

```jsx
<div
  ref={triggerRef}
  onClick={toggleMenu}
  onKeyDown={handleTriggerKeyDown}
  tabIndex={0}
  role="button"
  aria-label="Menu name"
  aria-expanded={isOpen}>
  Menu Label
</div>
```

### Menu Item Component

```jsx
<div
  ref={el => menuItemRefs.current[index] = el}
  onClick={handleItemClick}
  tabIndex={-1}  // Items not in natural tab order, focus managed programmatically
  role="menuitem"
  aria-disabled={item.disabled ? "true" : undefined}>
  Item Label
</div>
```

### Menu Container

```jsx
<div
  role="menu"
  onKeyDown={handleMenuKeyDown}>
  {menuItems.map((item, index) => (
    <MenuItem key={index} index={index} ... />
  ))}
</div>
```

## Testing Requirements

### Integration Tests (Primary)

1. **Arrow key navigation workflow**:
   - Open menu → Arrow Down from trigger → Focus on first enabled item
   - Arrow Down from item → Focus on next enabled item
   - Arrow Down from last → Wrap to first
   - Arrow Up from item → Focus on previous enabled item
   - Arrow Up from first → Wrap to last

2. **Disabled item skipping**:
   - Navigate past disabled items without landing on them
   - Wrap navigation skips disabled items at boundaries

3. **Home/End key navigation**:
   - Home → Focus first enabled item
   - End → Focus last enabled item

### E2E Tests (Secondary)

1. **Complete keyboard workflow**:
   - Tab to trigger → Enter to open → Arrow keys to navigate → Enter to select
   - Verify menu closes and focus returns appropriately

2. **Cross-browser validation**:
   - Test in Chrome, Firefox, Safari
   - Verify arrow key behavior is consistent

### Unit Tests (Edge Cases)

1. **Wrapping logic**:
   - Test circular navigation at boundaries
   - Test with disabled items at boundaries

2. **All items disabled**:
   - Verify graceful handling (no focus movement or stay on current)

## Performance Requirements

- Arrow key press to focus change: < 50ms
- No perceptible lag during rapid arrow key presses
- No memory leaks from ref arrays

## Accessibility Requirements

- ARIA roles: `role="menu"` on container, `role="menuitem"` on items
- ARIA states: `aria-disabled="true"` on disabled items, `aria-expanded` on trigger
- Focus indicators: Browser default focus outline visible on all focused items
- Screen reader announcements: Correct role and state announced for all items

## Edge Cases

1. **Single menu item**: Arrow keys have no effect (already on only item)
2. **All items disabled**: Navigation attempts do nothing, focus stays on current item
3. **Menu closes while navigating**: Focus returns to trigger
4. **Rapid arrow key presses**: Debounce not required, each key press processes sequentially

## Version History

- **1.0.0** (2025-11-15): Initial contract based on research.md and clarifications
