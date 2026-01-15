# Quickstart: Text Size Controls for Video Player

**Date**: 2025-11-22
**Feature**: Improve Text Readability in Video Player Instructions

## Overview

This document provides a high-level implementation overview for developers building the text size feature. For detailed specifications, see [spec.md](spec.md). For design decisions, see [research.md](research.md). For data structures, see [data-model.md](data-model.md).

---

## Feature Summary

Enable users to adjust the text size of video player instruction text to improve readability. Feature includes:

- **3-level text size selector**: Small (0.85x), Medium (1.0x, default), Large (1.15x)
- **Persistent preferences**: Saved to localStorage and synced to Firebase
- **Minimum 16px baseline**: Meets accessibility standards
- **Simple, discoverable UI**: Button group in overlay header

---

## Architecture

### Components

```
WholeApp (state container)
  ├─ state.videoTextSize: 'small' | 'medium' | 'large'
  ├─ state.sessionId: string
  └─ handlers.handleTextSizeChange(size)
      │
      └─→ VideoButton (trigger)
            │
            └─→ Overlay (wrapper + layout)
                  │
                  ├─ TextSizeControl (NEW - button group in header)
                  │   └─ onClick → handleTextSizeChange()
                  │
                  └─ VideoTutorial (player component)
                      ├─ ReactPlayer (video display)
                      ├─ Tabs (Player, Enter_url, Tutorials)
                      └─ Instruction text (scaled by CSS multiplier)
```

### Data Flow

```
User clicks size button
        ↓
TextSizeControl.onClick(size)
        ↓
WholeApp.handleTextSizeChange(size)
        ↓
├─ setState({ videoTextSize: size })
├─ saveToLocalStorage(size)
├─ syncToFirebase(size)
└─ Re-render with new CSS class
        ↓
CSS applies --video-text-scale multiplier
        ↓
All text sizes update proportionally
```

---

## Implementation Checklist

### Phase 1A: State & Storage

- [ ] Add `videoTextSize` state to WholeApp (default: 'medium')
- [ ] Implement `loadTextSizePreference()` in WholeApp.componentDidMount()
  - Try localStorage first
  - Fall back to 'medium'
  - Later: Sync from Firebase if user authenticated
- [ ] Implement `saveTextSizePreference(size)` utility function
  - Save to localStorage
  - Sync to Firebase (async, non-blocking)
  - Handle errors gracefully
- [ ] Create `handleTextSizeChange(size)` method
  - Validate size (must be 'small', 'medium', or 'large')
  - Update state
  - Call saveTextSizePreference()

### Phase 1B: Component Changes

- [ ] **Overlay.js**: Add `textSize` and `onTextSizeChange` props
- [ ] **VideoTutorial.js**: Receive and pass through text size props
- [ ] **TextSizeControl.js** (NEW): Create button group component
  - Display 3 buttons (A, A+, A++ or Small/Med/Large)
  - Show selected state (highlight current size)
  - Handle click → call onTextSizeChange()
  - Add aria-label for accessibility

### Phase 1C: Styling Updates

- [ ] **Overlay.scss**: Add CSS class hooks for text size
  ```scss
  .overlay {
    --video-text-scale: 1; // Default multiplier

    &.video-text--small {
      --video-text-scale: 0.85;
    }
    &.video-text--large {
      --video-text-scale: 1.15;
    }
  }
  ```

- [ ] **video_overlay.scss**: Update all font-size declarations
  ```scss
  .video__title {
    // OLD: font-size: 2rem;
    // NEW:
    font-size: calc(2rem * var(--video-text-scale));
  }
  ```

- [ ] **Overlay.scss**: Update overlay-level font sizes
  ```scss
  .overlay__tab-title {
    // OLD: font-size: 1.2rem;
    // NEW:
    font-size: calc(1.2rem * var(--video-text-scale));
  }
  ```

### Phase 1D: Testing

- [ ] **Integration Tests**: React Testing Library
  - User can click text size buttons
  - Clicking updates display
  - Preference persists after reload (localStorage mock)
  - Reset button works

- [ ] **E2E Tests**: Playwright
  - User changes text size in browser
  - Page reload preserves text size
  - Text is readable at all sizes
  - No layout breaking occurs

- [ ] **Accessibility Tests**: jest-axe + @axe-core/playwright
  - Text size controls have aria-labels
  - Controls are keyboard accessible
  - ARIA roles are correct
  - Color contrast meets WCAG standards

### Phase 1E: Documentation

- [ ] Update component JSDoc with new props
- [ ] Add comments for CSS custom property usage
- [ ] Document localStorage key names
- [ ] Add troubleshooting guide for edge cases

---

## Code Examples

### Loading Preference on Mount

```javascript
// In WholeApp.js
componentDidMount() {
  // Load existing preferences
  const savedTextSize = this.loadTextSizePreference();

  // ... other initialization code

  this.setState({
    videoTextSize: savedTextSize,
    // ... other state
  });
}

loadTextSizePreference() {
  try {
    const saved = localStorage.getItem('videoTextSize');
    return ['small', 'medium', 'large'].includes(saved) ? saved : 'medium';
  } catch (e) {
    return 'medium'; // Fallback for private browsing
  }
}
```

### Handling Size Changes

```javascript
// In WholeApp.js
handleTextSizeChange = (size) => {
  const validSize = ['small', 'medium', 'large'].includes(size) ? size : 'medium';

  this.setState({ videoTextSize: validSize });
  this.saveTextSizePreference(validSize);
}

saveTextSizePreference(size) {
  // Immediate save to localStorage
  try {
    localStorage.setItem('videoTextSize', size);
  } catch (e) {
    console.warn('Could not save text size preference', e);
  }

  // Async Firebase sync (non-blocking)
  this.syncTextSizeToFirebase(size).catch(err => {
    console.warn('Firebase sync failed, preference still saved locally', err);
  });
}

syncTextSizeToFirebase(size) {
  const { sessionId, user } = this.state;
  if (!sessionId) return Promise.resolve();

  return db.collection("sessions")
    .doc(sessionId)
    .update({ videoTextSize: size })
    .catch(err => {
      // Non-critical failure - user still has local preference
      throw err;
    });
}
```

### TextSizeControl Component

```javascript
// TextSizeControl.js (NEW COMPONENT)
import React from 'react';
import { Button, ButtonGroup } from 'react-bootstrap';
import PropTypes from 'prop-types';

export default function TextSizeControl({
  currentSize = 'medium',
  onSizeChange,
  onReset,
}) {
  const sizes = ['small', 'medium', 'large'];
  const labels = { small: 'A', medium: 'A+', large: 'A++' };

  return (
    <div className="text-size-control" role="group" aria-label="Text size">
      <ButtonGroup size="sm">
        {sizes.map(size => (
          <Button
            key={size}
            variant={currentSize === size ? 'primary' : 'outline-secondary'}
            onClick={() => onSizeChange(size)}
            aria-pressed={currentSize === size}
            aria-label={`${labels[size]} - ${size} text size`}
          >
            {labels[size]}
          </Button>
        ))}
      </ButtonGroup>
      <Button
        variant="link"
        size="sm"
        onClick={onReset}
        aria-label="Reset text size to default"
      >
        Reset
      </Button>
    </div>
  );
}

TextSizeControl.propTypes = {
  currentSize: PropTypes.oneOf(['small', 'medium', 'large']),
  onSizeChange: PropTypes.func.isRequired,
  onReset: PropTypes.func.isRequired,
};
```

### Applying Text Size in Overlay

```javascript
// In Overlay.js (render method)
render() {
  const { textSize = 'medium', onTextSizeChange } = this.props;
  const sizeClass = `video-text--${textSize}`;

  return (
    <div className={`overlay ${sizeClass}`}>
      <div className="overlay__header">
        {/* Existing close/minimize buttons */}

        <TextSizeControl
          currentSize={textSize}
          onSizeChange={onTextSizeChange}
          onReset={() => onTextSizeChange('medium')}
        />
      </div>

      <div className="overlay__content">
        {this.props.children}
      </div>
    </div>
  );
}
```

---

## File Changes Summary

### New Files
- `src/components/menu/TextSizeControl.js` - Button group component
- `specs/004-text-size-in-video-overlay/research.md` - Design decisions
- `specs/004-text-size-in-video-overlay/data-model.md` - Data entities
- `tests/integration/video-text-size.test.js` - Integration tests
- `tests/e2e/video-text-size.spec.js` - E2E tests

### Modified Files
- `src/components/OverlayPlugins/Overlay.js` - Add textSize props, CSS class
- `src/components/menu/VideoTutorial.js` - Pass through text size props
- `src/WholeApp.js` - Add state, handlers, persistence logic
- `src/styles/02_components/Overlay.scss` - CSS custom property, updated sizes
- `src/styles/02_components/video_overlay.scss` - Apply multiplier to all font sizes

### No Changes
- React Bootstrap version
- Existing component APIs
- Backwards compatibility maintained

---

## Testing Strategy

### Unit Tests (10%)
- Text size validation logic
- localStorage read/write edge cases
- Size calculation formulas

### Integration Tests (70%)
- Component renders with text size controls
- State updates when user clicks
- localStorage saves and loads correctly
- Reset functionality works
- ARIA labels present and correct

### E2E Tests (20%)
- Full user flow: open video → change text size → reload → see size persisted
- Cross-browser rendering at different text sizes
- Visual regression (optional: baseline screenshots)

---

## Success Criteria Verification

| Requirement | Implementation | Verification |
|-------------|----------------|--------------|
| Default text ≥ 16px | Medium = 1.0x multiplier applied to 2rem base | Visual inspection + unit test |
| 3 size levels | Small/medium/large buttons in UI | Integration test |
| Persists across sessions | localStorage + Firebase | E2E test with reload |
| 1 click/tap to access | TextSizeControl in overlay header | UX walkthrough |
| Layout integrity | CSS overflow handling | E2E visual check |
| Readable at all sizes | CSS calculations + manual testing | Visual inspection |
| Keyboard accessible | aria-labels, button groups | jest-axe test |
| Reset to default | Reset button in control | Integration test |

---

## Known Limitations & Future Enhancements

### Limitations (Current MVP)
- Only affects video player; doesn't scale other UI elements
- 3 discrete sizes (not continuous slider)
- No per-element customization (all scales together)
- No high-contrast or special font options

### Future Enhancements
- Continuous slider for fine-tuned sizing
- Apply text size setting globally (all UI, not just video)
- Custom font family selection
- High-contrast mode support
- Text-to-speech for instructions
- Preset profiles (e.g., "dyslexia-friendly")

---

## Troubleshooting

### Text size not persisting after reload
1. Check browser console for errors
2. Verify localStorage is enabled (not in private browsing)
3. Check that `loadTextSizePreference()` is called in componentDidMount
4. Inspect `window.localStorage.getItem('videoTextSize')` in DevTools

### Text overlaps or cuts off at larger sizes
1. Verify CSS class `video-text--large` is applied
2. Check that all font-size declarations use `calc(... * var(--video-text-scale))`
3. Ensure scrollable containers have `overflow: auto`
4. Test in different browsers (Chrome, Firefox, Safari)

### Firebase sync not working
1. Check network tab for failed requests
2. Verify user is authenticated (if sync required)
3. Check Firebase permissions for `sessions` collection
4. This is non-blocking; localStorage backup works without it

---

## Related Specifications

- [Feature Spec](spec.md) - Full user stories and requirements
- [Research & Design](research.md) - Design decisions and alternatives
- [Data Model](data-model.md) - Entity definitions and persistence
- [CLAUDE.md](../../CLAUDE.md) - Project-wide guidelines

**Status**: ✅ READY FOR IMPLEMENTATION
