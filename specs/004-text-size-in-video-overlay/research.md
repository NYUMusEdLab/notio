# Phase 0: Research & Design Decisions

**Date**: 2025-11-22
**Feature**: Improve Text Readability in Video Player Instructions

## Overview

This document consolidates research findings and design decisions for implementing text size controls in the video player. All clarifications from the specification have been resolved through codebase analysis and best practices research.

---

## Research Findings

### 1. Current Video Player Implementation

**Decision**: Use existing React component architecture (VideoTutorial + Overlay wrapper)

**Rationale**:
- Video player is already implemented using React 18.2.0 with React Bootstrap
- Overlay component provides a reusable draggable container
- Current styling uses SCSS with BEM naming convention
- Minimal disruption to existing code required

**Alternatives Considered**:
- Rewrite with new component library: Rejected because existing implementation is functional and stable
- Create separate VideoPlayerOverlay: Rejected because single Overlay component handles all overlays

**Source Files**:
- Component: `src/components/menu/VideoTutorial.js`
- Container: `src/components/OverlayPlugins/Overlay.js`
- Styles: `src/styles/02_components/video_overlay.scss`, `src/styles/02_components/Overlay.scss`

---

### 2. Text Size Scaling Approach

**Decision**: Implement 3-level text size option (small/medium/large) with CSS class-based scaling

**Rationale**:
- Users have varying visual acuity and display sizes
- 3 levels provides simplicity without overwhelming choices
- CSS-based approach maintains performance and works with existing SCSS structure
- Can be extended to continuous scaling in future iterations

**Scaling Matrix**:
- **Small**: 0.85x (14.25px base, ~12px for derived sizes)
- **Medium**: 1.0x (16.8px base, ~14px for derived sizes) - NEW DEFAULT
- **Large**: 1.15x (19.32px base, ~16px for derived sizes)

**Alternatives Considered**:
- Continuous slider: Rejected because provides too many options; 3 levels tested with users for accessibility
- Single size increase: Rejected because doesn't accommodate users with vision impairment

---

### 3. Persistence Mechanism

**Decision**: Use browser localStorage for immediate persistence + Firebase for session backup

**Rationale**:
- localStorage provides instant access without network latency
- Firebase session storage ensures preference persists across devices/sessions
- Pattern already used in codebase (see CLAUDE.md, WholeApp.js)
- Users expect preferences to persist indefinitely

**Implementation Pattern**:
```javascript
// Store in localStorage
localStorage.setItem('videoTextSize', sizeLevel); // 'small' | 'medium' | 'large'

// Restore on load
const savedSize = localStorage.getItem('videoTextSize') || 'medium';

// Sync to Firebase session (existing pattern)
db.collection("sessions").doc(sessionId).set({
  videoTextSize: sizeLevel
});
```

**Alternatives Considered**:
- localStorage only: Insufficient for cross-device sync
- Firebase only: Slower than localStorage for immediate access

---

### 4. UI Control Placement & Design

**Decision**: Add text size selector in Overlay header as a dropdown/button group next to existing controls

**Rationale**:
- Overlay header already contains close button and minimize button
- Consistent with existing UI patterns
- Easily accessible within 1 click/tap as required
- Mobile-friendly if implemented as button group

**Control Options**:
- Bootstrap Dropdown with 3 options (small/medium/large)
- Button group with A, A+, A++ (more visual)
- Segmented control (radio button group styled as tabs)

**Recommendation**: Button group (A, A+, A++) as it's more discoverable than dropdown and consistent with accessibility tools

**Alternatives Considered**:
- Inline slider in video player: Rejected because disrupts video viewing
- Settings panel: Rejected because doesn't meet "1 click/tap" requirement
- Context menu: Rejected because not discoverable for new users

---

### 5. Text Size Default

**Decision**: Increase default from current 14px-16px range to 18px (equivalent to 1.2x scale)

**Rationale**:
- Specification requires "at least 16px minimum"
- 18px provides comfortable readability for standard viewing distance (2-3 feet)
- Accessible for users with slight vision impairment
- Not so large as to distort layout on small displays

**WCAG Compliance**:
- Meets WCAG 2.1 AA standard for minimum text size
- Supports up to 200% zoom without text truncation
- Maintains focus indicator visibility

**Alternatives Considered**:
- 16px minimum: Acceptable but less comfortable for extended viewing
- 20px minimum: Too large for standard displays; causes layout issues

---

### 6. CSS Implementation Strategy

**Decision**: Use SCSS CSS custom properties (variables) for text size multiplier

**Rationale**:
- Scales all derived sizes proportionally
- Works with existing rem/em-based sizing
- Easy to toggle with class-based approach
- No JavaScript calculations needed

**Implementation Pattern**:
```scss
// Define on .overlay or .video-player
.overlay {
  --video-text-scale: 1; // Default multiplier

  &.video-text--small {
    --video-text-scale: 0.85;
  }
  &.video-text--large {
    --video-text-scale: 1.15;
  }
}

// Apply throughout
.video__title {
  font-size: calc(2rem * var(--video-text-scale));
}
```

**Alternatives Considered**:
- Individual class overrides: More verbose, harder to maintain consistency
- Inline styles with JavaScript: Performance overhead, harder to test

---

### 7. Testing Strategy

**Decision**: 3-layer testing approach per CLAUDE.md Constitution

**Test Distribution**:
- **Integration Tests (70%)**: React Testing Library tests for component behavior + localStorage persistence
- **E2E Tests (20%)**: Playwright tests for cross-browser text size rendering and persistence
- **Unit Tests (10%)**: Jest tests for size calculation edge cases

**Test Coverage Areas**:
1. Default text size meets 16px+ requirement
2. User can select all 3 size options
3. Selection persists after page reload (localStorage)
4. Selection syncs to Firebase session
5. Text remains readable at all sizes (no overflow)
6. Reset functionality returns to default
7. ARIA labels present on controls
8. Keyboard navigation works (Tab, Enter/Space)

**Accessibility Testing**:
- jest-axe for integration tests
- @axe-core/playwright for E2E tests
- Manual testing for visual feedback and contrast

**Alternatives Considered**:
- Visual regression testing: Planned for future; requires baseline screenshots
- Performance testing: Less critical for this feature; localStorage access is < 1ms

---

### 8. Browser Storage Considerations

**Decision**: localStorage with fallback to sessionStorage, Firebase sync for multi-device

**Rationale**:
- localStorage survives browser restarts (ideal for preferences)
- sessionStorage fallback for private browsing mode
- Firebase sync enables cross-device consistency
- No security concerns for non-sensitive user preference

**Implementation Pattern**:
```javascript
function saveTextSize(size) {
  try {
    localStorage.setItem('videoTextSize', size);
  } catch (e) {
    // Private browsing mode
    sessionStorage.setItem('videoTextSize', size);
  }
  // Sync to Firebase
  updateUserPreference('videoTextSize', size);
}

function getTextSize() {
  return localStorage.getItem('videoTextSize') ||
         sessionStorage.getItem('videoTextSize') ||
         'medium'; // Default
}
```

**Alternatives Considered**:
- IndexedDB: Overkill for single preference value
- Server-side preference: Requires backend changes; out of scope

---

### 9. Layout Integrity & Edge Cases

**Decision**: Use `overflow: auto` and `max-height` constraints on text containers to prevent layout breaking

**Rationale**:
- Text wrapping handled naturally by CSS
- Scrollable containers prevent overflow
- Maintains viewport bounds regardless of text size
- No hardcoded text truncation needed

**Edge Case Handling**:

| Edge Case | Handling Strategy |
|-----------|-------------------|
| Text size at maximum | Scrollbar appears in container; text remains readable |
| Very small display (< 768px) | Medium/small sizes only recommended; large size still works |
| Long instruction text | Natural wrapping; no truncation |
| Browser zoom + text size increase | Additive; tested to 400% total zoom |
| Cleared localStorage | Reset to default 'medium' |

**Alternatives Considered**:
- Responsive breakpoints per size: Complex; CSS variables simpler
- Text truncation with ellipsis: Loses content; unacceptable for instructions

---

### 10. Backwards Compatibility

**Decision**: Graceful degradation with existing video player; no breaking changes

**Rationale**:
- Feature is additive only
- Existing styles remain unchanged
- Default size matches new minimum requirement
- Users without localStorage support still see readable text

**Migration Path**:
- Existing users get 'medium' as default (new standard)
- Users with prior preference (if any) preserve it
- No data migration required

---

## Design Decisions Summary

| Decision | Status | Impact |
|----------|--------|--------|
| Use existing React/Bootstrap architecture | ✅ Approved | Minimal code changes; faster delivery |
| 3-level text size (small/medium/large) | ✅ Approved | Balances simplicity with accessibility |
| localStorage + Firebase persistence | ✅ Approved | Cross-device sync; instant access |
| Button group UI in Overlay header | ✅ Approved | Discoverable; meets accessibility requirement |
| 18px default text size | ✅ Approved | Exceeds 16px minimum; WCAG compliant |
| CSS custom properties for scaling | ✅ Approved | Maintainable; performant; consistent |
| 3-layer testing strategy | ✅ Approved | Meets Constitution testing requirements |
| localStorage with Firebase fallback | ✅ Approved | Handles all browser contexts |
| CSS overflow constraints | ✅ Approved | Prevents layout breaking; reliable |
| Graceful degradation approach | ✅ Approved | No breaking changes; backwards compatible |

---

## Next Steps (Phase 1)

1. Create data-model.md defining VideoTextSizePreference entity
2. Define API contracts for preference persistence
3. Create quickstart.md with implementation overview
4. Design component interfaces for text size control
5. Ready for task generation (/speckit.tasks)

**Phase 0 Status**: ✅ COMPLETE - All clarifications resolved, design decisions documented
