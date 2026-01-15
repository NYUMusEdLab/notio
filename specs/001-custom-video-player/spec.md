# Feature Specification: Custom Video Player

**Feature Branch**: `001-custom-video-player`
**Created**: 2026-01-15
**Status**: Draft
**Input**: User description: "create a video player similar to the existing videoplayer, it should be possible to display any content in the player, it should have a default url defined in the settings and passed to the component, the user should be able to write, or copy paste urls, it must be possible to always revert to the original default url. the videoplayer should be displayed in the portal/modal or what it is called."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - View Default Video Content (Priority: P1)

As a Notio user, I want the video player to automatically load with a pre-configured default video URL so that I can immediately access relevant content without manual configuration.

**Why this priority**: This is the foundational experience - users must see content immediately when opening the player. Without a working default URL, the player provides no value on first use.

**Independent Test**: Can be fully tested by opening the video player and verifying the default video loads and plays correctly.

**Acceptance Scenarios**:

1. **Given** the video player is not open, **When** the user opens the video player, **Then** the default URL content displays in the player
2. **Given** a default URL is configured in settings, **When** the video player component initializes, **Then** the player receives and uses that default URL
3. **Given** the player is showing content, **When** the user interacts with playback controls, **Then** standard video controls (play, pause, seek, volume) work correctly
4. **Given** the player is open, **When** the user closes the player, **Then** the overlay/modal closes and returns focus to the trigger element

---

### User Story 2 - Enter Custom Video URL (Priority: P2)

As a Notio user, I want to enter or paste my own video URL so that I can watch any compatible video content alongside my music practice.

**Why this priority**: Custom URL input extends the player beyond default content, enabling personalized learning experiences. This is the core customization feature.

**Independent Test**: Can be tested by navigating to the URL input interface, entering a valid URL, and verifying the new content loads.

**Acceptance Scenarios**:

1. **Given** the video player is open, **When** the user navigates to the URL input section, **Then** a text input field is available for entering URLs
2. **Given** the URL input field is focused, **When** the user types a URL, **Then** the input accepts and displays the text
3. **Given** the URL input field is focused, **When** the user pastes a URL from clipboard, **Then** the pasted URL appears in the input field
4. **Given** a valid URL is entered, **When** the user submits the URL, **Then** the player loads and displays the new content
5. **Given** a URL is entered, **When** the user submits, **Then** the player automatically switches to display the new content
6. **Given** the current video URL is displayed, **When** the user views the URL input section, **Then** they can see which URL is currently playing

---

### User Story 3 - Reset to Default URL (Priority: P3)

As a Notio user, I want to easily reset the video player to the original default URL so that I can return to the standard content after exploring custom videos.

**Why this priority**: Reset functionality ensures users are never stuck with custom content they no longer want. This provides a safety net for experimentation.

**Independent Test**: Can be tested by loading a custom URL, clicking reset, and verifying the default URL content reloads.

**Acceptance Scenarios**:

1. **Given** a custom URL is currently playing, **When** the user clicks the reset button, **Then** the player reverts to the default URL content
2. **Given** the default URL is already playing, **When** the user clicks reset, **Then** the default URL continues playing (no change)
3. **Given** the user has reset to default, **When** they view the current URL indicator, **Then** it shows the default URL
4. **Given** the player is showing any content, **When** the user opens URL input section, **Then** the reset button is always visible and accessible

---

### User Story 4 - Display in Overlay/Modal (Priority: P4)

As a Notio user, I want the video player to appear in a draggable overlay window so that I can position it conveniently while using other Notio features.

**Why this priority**: The overlay presentation allows multitasking - users can watch videos while practicing on the piano keyboard. This maintains the existing UX pattern.

**Independent Test**: Can be tested by opening the player and verifying it appears as an overlay with minimize and close controls.

**Acceptance Scenarios**:

1. **Given** the video player is triggered, **When** it opens, **Then** it displays in a portal/overlay above the main content
2. **Given** the overlay is open, **When** the user drags the header/grab bar, **Then** the overlay moves to the new position
3. **Given** the overlay is open, **When** the user clicks minimize, **Then** the overlay minimizes but remains accessible
4. **Given** the overlay is open, **When** the user presses Escape key, **Then** the overlay closes
5. **Given** the overlay is open, **When** the user clicks the close button, **Then** the overlay closes and returns focus appropriately

---

### Edge Cases

- What happens when the user enters an invalid or unsupported URL? The player should display a clear error message and retain the previous working URL
- What happens when the default URL becomes unavailable (video deleted/private)? The player should display an error state with option to enter a different URL
- What happens when the user enters a URL without internet connectivity? The player should show an appropriate offline/connection error message
- How does the player handle very long URLs? The input field should accept any valid URL length and display it appropriately (with truncation if needed)
- What happens if the user submits an empty URL? The submission should be prevented or ignored, keeping the current URL

### Testing Strategy *(mandatory)*

**Integration Test Focus** (Primary - 60-70% of coverage):
- Video player initialization with default URL from settings
- URL input submission flow: enter URL → submit → content loads → player updates
- Reset button flow: custom URL playing → reset clicked → default URL loads
- Tab navigation between Player and URL input sections
- Overlay open/close lifecycle with focus management
- Accessibility: keyboard navigation, ARIA attributes, screen reader compatibility

**E2E Test Focus** (Secondary - 20-30% of coverage):
- Complete user journey: open player → watch default → enter custom URL → watch custom → reset to default → close
- Cross-browser validation of video playback (Chrome, Firefox, Safari)
- URL input via keyboard typing and clipboard paste
- Overlay drag positioning across different screen sizes

**Unit Test Focus** (Minimal - 10-20%, edge cases only):
- URL validation edge cases (malformed URLs, unsupported protocols)
- Default URL configuration retrieval from settings
- State management for URL changes and resets

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST display video content using a default URL when the player first opens
- **FR-002**: System MUST receive the default URL as a configuration prop passed to the component
- **FR-003**: System MUST provide a text input field for users to enter custom video URLs
- **FR-004**: System MUST accept URLs entered via typing or paste (Ctrl+V / Cmd+V)
- **FR-005**: System MUST update the video player content when a new URL is submitted
- **FR-006**: System MUST provide a reset button that reverts to the original default URL
- **FR-007**: System MUST always preserve the original default URL for reset functionality regardless of how many custom URLs are entered
- **FR-008**: System MUST display the video player in an overlay/modal (portal) above main content
- **FR-009**: System MUST allow the overlay to be dragged and repositioned
- **FR-010**: System MUST provide minimize and close controls for the overlay
- **FR-011**: System MUST support keyboard navigation for all interactive elements (Enter/Space activation, Escape to close)
- **FR-012**: System MUST display which URL is currently being played
- **FR-013**: System MUST provide standard video playback controls (play, pause, seek, volume)
- **FR-014**: System MUST return focus to the trigger element when the overlay closes

### Key Entities

- **VideoPlayer**: The main component displaying video content with controls; has current URL, default URL reference, playback state
- **VideoURL**: A URL pointing to video content; can be default (from settings) or custom (user-entered)
- **Overlay/Modal**: The container displaying the video player; has position, minimized state, visibility state
- **Settings Configuration**: Source of the default video URL; passed as prop to the component

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can view the default video content within 2 seconds of opening the player
- **SC-002**: Users can successfully enter and play a custom URL in under 30 seconds
- **SC-003**: Users can reset to the default URL with a single click
- **SC-004**: 100% of interactive elements are accessible via keyboard navigation
- **SC-005**: The overlay can be repositioned to any location within the viewport
- **SC-006**: Video playback begins within 3 seconds of URL submission (assuming normal network conditions)
- **SC-007**: The reset button is always visible when the URL input section is displayed
- **SC-008**: Focus returns correctly to the trigger element when overlay closes (verified via accessibility audit)

## Assumptions

1. **Video Format Support**: The player will support any URL format that ReactPlayer (existing dependency) can handle, including YouTube, Vimeo, and direct video files
2. **Default URL Source**: The default URL will be passed as a prop from parent component/settings, similar to existing VideoTutorial implementation
3. **Overlay Component**: Will reuse or extend the existing Overlay component at `src/components/OverlayPlugins/Overlay.js`
4. **Tab Interface**: Will maintain the existing tab-based interface pattern (Player tab, Enter URL tab) from VideoTutorial
5. **State Persistence**: URL changes will persist during the session but not across browser refreshes (consistent with existing behavior)
6. **Network Handling**: Basic error handling for network issues will display user-friendly messages; detailed offline mode is out of scope
7. **URL Validation**: Basic URL format validation; the player will attempt to load any submitted URL and display errors from the video provider if incompatible
8. **Accessibility Standards**: Will follow WCAG 2.1 AA guidelines and existing Notio accessibility patterns (ARIA labels, keyboard navigation, focus management)
9. **Performance**: Video loading performance depends on external video providers; target is responsive UI feedback within 200ms of user actions
10. **Browser Support**: Chrome, Firefox, and Safari (modern versions) as per project constitution
