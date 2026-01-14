# Research: Custom Video Player

**Feature**: 001-custom-video-player
**Date**: 2026-01-15
**Status**: Complete

## Research Summary

This feature has minimal unknowns because it extends well-established patterns already in the codebase. Research focused on confirming existing implementation patterns and identifying any gaps.

---

## 1. Existing VideoTutorial Pattern Analysis

### Decision
Extend the existing `VideoTutorial.js` component pattern rather than creating a new architecture.

### Rationale
- VideoTutorial already implements: ReactPlayer integration, URL input form, tab navigation, Overlay display, reset functionality
- The existing pattern is well-tested and understood by the team
- Constitution Principle V (Simplicity) mandates preferring edits over new abstractions

### Alternatives Considered
| Alternative | Rejected Because |
|-------------|------------------|
| New standalone component | Would duplicate existing patterns, violate simplicity principle |
| Abstract video player factory | Over-engineering for single use case |
| Context-based state management | Overkill for component-local URL state |

### Key Findings from Existing Code

**VideoTutorial.js (src/components/menu/VideoTutorial.js)**:
```javascript
// Key patterns to reuse:
- useState for videoUrl, activeTab, playing state
- props.videoUrl for default URL from parent
- props.resetVideoUrl for original default preservation
- props.handleChangeVideoUrl for URL updates
- Form with onSubmit for URL entry
- Reset button with onClick handler
- Tab-based UI (Player, Enter_url tabs)
```

**Overlay.js (src/components/OverlayPlugins/Overlay.js)**:
```javascript
// Key patterns to reuse:
- ReactDOM.createPortal for modal display
- Draggable wrapper for repositioning
- Escape key handler for close
- Minimize/close button controls
- Focus management (overlayRef, tabIndex)
```

---

## 2. ReactPlayer Best Practices

### Decision
Use ReactPlayer with lazy loading and standard controls configuration.

### Rationale
- Already a project dependency (react-player ^2.10.1)
- Supports YouTube, Vimeo, and direct URLs out of the box
- Lazy loading reduces bundle size

### Key Configuration
```javascript
import ReactPlayer from "react-player/lazy";

<ReactPlayer
  className="react-player"
  playing={playing}
  width="100%"
  height="100%"
  url={videoUrl}
  controls={true}
  onReady={onReadyHandler}
  onError={onErrorHandler}  // NEW: Add error handling
/>
```

### Error Handling Pattern
```javascript
const onErrorHandler = (error) => {
  // Display user-friendly error message
  // Retain previous working URL
  setError("Unable to load video. Please check the URL.");
};
```

---

## 3. Accessibility Implementation

### Decision
Follow existing Notio accessibility patterns with WCAG 2.1 AA compliance.

### Rationale
- Constitution Principle III mandates accessibility
- Existing VideoButton.js demonstrates the required pattern
- jest-axe already configured for integration tests

### Key Implementation Patterns

**Keyboard Navigation**:
```javascript
handleKeyDown = (event) => {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault();
    // Trigger action
  }
};
```

**ARIA Attributes**:
```jsx
<button
  role="button"
  aria-label="Reset to default video"
  tabIndex={0}
  onKeyDown={handleKeyDown}
  onClick={resetHandler}
>
  Reset
</button>
```

**Focus Management**:
- Return focus to trigger element on overlay close (already in Overlay.js)
- Use `tabIndex={-1}` on overlay container for programmatic focus

---

## 4. Props Interface Design

### Decision
Define clear props interface following existing VideoTutorial pattern.

### Rationale
- Constitution Principle II requires clear prop interfaces
- Consistency with existing components

### Props Definition
```javascript
CustomVideoPlayer.propTypes = {
  // Required
  defaultVideoUrl: PropTypes.string.isRequired,  // Initial URL from settings
  onClose: PropTypes.func.isRequired,            // Handler when overlay closes

  // Optional
  initialTab: PropTypes.oneOf(['Player', 'Enter_url']),  // Default: 'Player'
  onUrlChange: PropTypes.func,                   // Callback when URL changes
};

CustomVideoPlayer.defaultProps = {
  initialTab: 'Player',
  onUrlChange: () => {},
};
```

---

## 5. State Management

### Decision
Use component-local state with React hooks (useState).

### Rationale
- Matches existing VideoTutorial pattern
- No need for global state (URL changes are session-scoped)
- Simplest solution that meets requirements

### State Shape
```javascript
const [currentUrl, setCurrentUrl] = useState(props.defaultVideoUrl);
const [activeTab, setActiveTab] = useState(props.initialTab);
const [isPlaying, setIsPlaying] = useState(false);
const [error, setError] = useState(null);

// defaultVideoUrl is stored via props reference - never mutated
// Reset simply sets: setCurrentUrl(props.defaultVideoUrl)
```

---

## 6. Testing Strategy Confirmation

### Decision
Follow constitution-mandated test distribution.

### Test Distribution
| Type | Target | Files |
|------|--------|-------|
| Integration | 60-70% | `__integration__/CustomVideoPlayer.integration.test.js` |
| E2E | 20-30% | `tests/e2e/custom-video-player.spec.js` |
| Unit | 10-20% | `__test__/CustomVideoPlayer.unit.test.js` |

### Key Test Scenarios

**Integration Tests** (React Testing Library + jest-axe):
- Render with default URL → verify ReactPlayer receives URL
- Enter custom URL → submit → verify URL updates
- Click reset → verify default URL restored
- Tab navigation between Player and Enter_url
- Accessibility audit (axe)

**E2E Tests** (Playwright):
- Full user journey: open → view default → enter custom → reset → close
- Keyboard-only navigation through entire flow
- Cross-browser playback verification

**Unit Tests** (Jest):
- URL validation edge cases (empty, malformed)
- State transitions (reset when already default)

---

## Resolved Clarifications

All technical context items are resolved. No NEEDS CLARIFICATION items remain.

| Item | Resolution |
|------|------------|
| Component architecture | Extend existing VideoTutorial pattern |
| State management | Component-local useState |
| Overlay integration | Reuse existing Overlay.js |
| Error handling | Display message, retain previous URL |
| Accessibility | Follow existing ARIA/keyboard patterns |
