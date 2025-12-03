# Feature Specification: URL-Based Settings Storage

**Feature Branch**: `004-url-settings-storage`
**Created**: 2025-12-02
**Status**: Draft
**Input**: User description: "I want to refactor this app to encode the settings in the url and in that way outfase our firebase database. then the share link will be enterpreted to hold all the possible settings (selected scale, key, open windows, youtube video link ...) It must be a link that can be added to in the future without loosing backwards compatibility."

## Clarifications

### Session 2025-12-02

- Q: When a user's configuration would generate a URL exceeding 2000 characters (the 5% edge case from SC-003), what should happen? → A: Block share creation and show message suggesting user disable video URL or simplify custom scales
- Q: When a URL contains duplicate/conflicting parameters (e.g., `?scale=Major&scale=Minor`), which value should the system use? → A: Use the last occurrence in the URL
- Q: When a URL contains a custom scale with invalid steps or numbers (e.g., steps outside 0-11 range, non-numeric values, mismatched array lengths), what should happen? → A: Load the URL but show error message and use default Major scale for that parameter only
- Q: How should the system validate video URLs to prevent XSS attacks while maintaining flexibility for future video platforms? → A: Validate URL format with regex (https only, no javascript: protocol) but allow any domain
- Q: When should the system update the browser URL as users change settings? → A: Debounced updates on any setting change (wait 500-1000ms after last change before updating)

### Session 2025-12-02 (Update)

- Q: Should URL parameters use abbreviated names (o, s, bn) or human-readable names (octave, scale, baseNote)? → A: Use human-readable names for manual editability. Feature not yet released, so no backwards compatibility needed.
- Q: Should help overlay visibility be controlled via URL? → A: Yes, teachers want to share links with help visible for tutorials, while experienced users want it hidden.
- Q: Should modal positions be encoded in URLs? → A: Yes, users want to share links with multiple modals open and positioned in a cascaded arrangement to avoid overlap, especially for tutorial scenarios.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Load Shared Settings from URL (Priority: P1)

Users receive a shared link and want to open the app with the exact same settings (scale, key, notation, etc.) as the person who shared it, without requiring any database connection.

**Why this priority**: This is the core replacement for Firebase functionality. Without this, the entire feature fails and users cannot share configurations.

**Independent Test**: Can be fully tested by opening a URL with encoded settings and verifying all settings are applied correctly. Delivers immediate value by enabling offline sharing without database dependency.

**Acceptance Scenarios**:

1. **Given** a URL with encoded settings parameters, **When** user opens the URL, **Then** all settings (scale, base note, octave, notation, instrument sound, clef, theme, keyboard visibility, video URL, etc.) are applied to the app state
2. **Given** a URL with partial settings encoded, **When** user opens the URL, **Then** specified settings are applied and unspecified settings use application defaults
3. **Given** a legacy shared link (Firebase format `/shared/{id}`), **When** user opens the URL, **Then** the app attempts to load from Firebase as a fallback for backwards compatibility
4. **Given** a URL with an invalid or corrupted parameter, **When** user opens the URL, **Then** the app loads with default settings for that parameter and shows an informative error message
5. **Given** a URL with invalid custom scale data (steps outside 0-11, non-numeric values, or mismatched array lengths), **When** user opens the URL, **Then** the app loads other settings correctly, uses default Major scale, and displays an error message about the invalid scale data

---

### User Story 2 - Generate Shareable URL (Priority: P1)

Users want to share their current app configuration by generating a URL that encodes all their settings, eliminating the need to save to a database first.

**Why this priority**: This is the primary user-facing action that triggers URL generation. Without this, users cannot create sharable links with the new system.

**Independent Test**: Can be fully tested by configuring settings, clicking share, and verifying the generated URL contains all current settings. Delivers value by enabling instant sharing without database writes.

**Acceptance Scenarios**:

1. **Given** user has configured various settings, **When** user clicks "Create Share Link", **Then** a URL is generated with all current settings encoded and copied to clipboard
2. **Given** user has a custom scale configured, **When** user generates a share link, **Then** the custom scale definition (steps and numbers) is included in the URL
3. **Given** user has a YouTube video URL set, **When** user generates a share link, **Then** the video URL is properly encoded in the share URL
4. **Given** user clicks share multiple times, **When** generating subsequent links, **Then** each generated URL reflects the current state without making database calls
5. **Given** user's configuration would generate a URL exceeding 2000 characters, **When** user clicks "Create Share Link", **Then** share creation is blocked and a message suggests disabling video URL or simplifying custom scales to reduce URL length

---

### User Story 3 - Browser Navigation with Settings (Priority: P2)

Users expect the browser's back/forward buttons to work naturally with their configuration changes, preserving settings history as they explore different scales and keys.

**Why this priority**: Enhances user experience by leveraging browser capabilities, but the app is still functional without it.

**Independent Test**: Can be fully tested by changing settings, using browser back button, and verifying settings revert. Delivers improved navigation UX.

**Acceptance Scenarios**:

1. **Given** user changes a setting (e.g., scale), **When** 500-1000ms passes without further changes, **Then** the URL is automatically updated to reflect the new state
2. **Given** URL has been updated with new settings, **When** user clicks browser back button, **Then** previous settings are restored from the earlier URL
3. **Given** user navigates back to a previous state, **When** user clicks browser forward button, **Then** the more recent settings are restored
4. **Given** user changes multiple settings rapidly within 1 second, **When** navigating browser history later, **Then** only the final state is recorded (intermediate rapid changes are not in history)

---

### User Story 4 - Bookmark Custom Configurations (Priority: P3)

Users want to save specific configurations as browser bookmarks for quick access to frequently used setups (e.g., "C Major Practice", "Jazz Scales").

**Why this priority**: Nice-to-have enhancement that adds convenience but isn't essential for core functionality.

**Independent Test**: Can be fully tested by configuring settings, bookmarking the page, and later opening the bookmark to verify settings are restored.

**Acceptance Scenarios**:

1. **Given** user has configured a specific setup, **When** user bookmarks the page, **Then** the bookmark URL contains all settings
2. **Given** user has multiple bookmarked configurations, **When** user opens any bookmark, **Then** the corresponding configuration loads correctly
3. **Given** user opens a bookmark created with an older URL format, **When** the page loads, **Then** settings are correctly parsed (backwards compatibility)

---

### User Story 5 - Future-Proof URL Extensions (Priority: P2)

The system must support adding new settings parameters to URLs in future updates without breaking existing shared links.

**Why this priority**: Critical for long-term maintainability and preventing link rot, but doesn't affect initial launch.

**Independent Test**: Can be tested by loading URLs that omit newly added parameters and verifying they load with defaults for new fields.

**Acceptance Scenarios**:

1. **Given** a URL created with version N of the app, **When** opened in version N+1 with new settings, **Then** old parameters are read correctly and new parameters use defaults
2. **Given** a URL with an unrecognized parameter name, **When** the URL is parsed, **Then** unknown parameters are ignored gracefully
3. **Given** a URL created in version N+1, **When** opened in version N (older version), **Then** known parameters load correctly and unknown parameters are ignored

---

### User Story 6 - Help Overlay Visibility Control (Priority: P2)

Teachers and content creators want to share links with the help overlay either visible or hidden depending on their audience's experience level.

**Why this priority**: Enhances tutorial and educational use cases, allowing teachers to provide different experiences for beginners vs. experienced users.

**Independent Test**: Can be fully tested by creating URLs with helpVisible=true and helpVisible=false, verifying the help overlay opens/closes accordingly.

**Acceptance Scenarios**:

1. **Given** a URL with `helpVisible=true`, **When** user opens the URL, **Then** the help overlay is displayed automatically
2. **Given** a URL with `helpVisible=false`, **When** user opens the URL, **Then** the help overlay is hidden
3. **Given** a URL without the helpVisible parameter, **When** user opens the URL, **Then** the help overlay uses the application default (hidden)
4. **Given** a teacher creating a tutorial link, **When** they enable the help overlay and generate a share link, **Then** the URL includes `helpVisible=true`
5. **Given** a user manually edits a URL to change `helpVisible=true` to `helpVisible=false`, **When** they open the modified URL, **Then** the help overlay is hidden as specified

---

### User Story 7 - Modal Positioning Control (Priority: P3)

Users want to share links with multiple modals (Share, Video, Help) open simultaneously and positioned in a cascaded arrangement to avoid complete overlap, especially useful for complex tutorial scenarios.

**Why this priority**: Nice-to-have enhancement for advanced sharing scenarios, but core functionality works without it.

**Independent Test**: Can be fully tested by positioning modals, generating a share link, and verifying the modals reopen at the specified positions.

**Acceptance Scenarios**:

1. **Given** a URL with share modal position parameters (`shareModalX=100&shareModalY=50`), **When** user opens the URL, **Then** the share modal opens at the specified coordinates
2. **Given** a URL with multiple modal positions encoded (`videoModalOpen=true&videoModalX=50&videoModalY=100&helpVisible=true&helpModalX=300&helpModalY=150`), **When** user opens the URL, **Then** all specified modals open at their respective positions in a cascaded arrangement
3. **Given** a URL with `shareModalOpen=true` but no position parameters, **When** user opens the URL, **Then** the share modal opens at the default position (top: 7%, left: 5%)
4. **Given** invalid position values (e.g., `videoModalX=-100` or `videoModalY=abc`), **When** user opens the URL, **Then** the modal opens at the default position and an error is logged
5. **Given** position values that would place a modal off-screen, **When** user opens the URL, **Then** the position is adjusted to keep the modal visible within the viewport
6. **Given** a user manually edits a URL to add modal position parameters, **When** they open the modified URL, **Then** the modals open at the hand-edited positions

---

### Edge Cases

- When URL would exceed 2000 characters, share creation is blocked and user is shown a message suggesting they disable the video URL or simplify custom scale names/definitions to reduce URL length
- Special characters in custom scale names or video URLs are URL-encoded using standard URLSearchParams encoding
- When URL contains duplicate/conflicting parameters (e.g., `scale=Major&scale=Minor`), the system uses the last occurrence in the URL
- Malformed or partially corrupted URLs are parsed gracefully, with invalid parameters falling back to defaults while valid parameters are applied
- When URL contains invalid custom scale data (steps outside 0-11 range, non-numeric values, mismatched array lengths), the system uses default Major scale for that parameter and displays an error message while loading other settings correctly
- Video URLs are validated using regex to ensure https-only protocol and reject dangerous protocols (javascript:, data:, file:) while allowing any domain for flexibility with future video platforms
- Tooltip refs and other transient UI state are never encoded in URLs (excluded from encoding logic)
- Locale-specific characters in base note names follow standard Western notation (A-G with # or b modifiers)
- Modal position coordinates outside viewport bounds are clamped to keep modals visible (with minimum padding from edges)
- Negative modal position values are treated as invalid and fall back to default positions
- Non-numeric modal position values are ignored and fall back to default positions
- Help overlay visibility defaults to false (hidden) when parameter is not present in URL

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST parse URL query parameters on application load to populate all user-configurable settings
- **FR-002**: System MUST support encoding all current Firebase-stored settings in URL format: octave, scale name, scale object (steps and numbers), base note, notation array, instrument sound, piano visibility, extended keyboard state, treble staff visibility, theme, show off-notes toggle, clef, video URL, video active state, active video tab, help overlay visibility, and modal positions
- **FR-003**: System MUST generate a shareable URL containing all current settings when user requests to share
- **FR-004**: System MUST maintain backwards compatibility by attempting to load from Firebase when detecting legacy `/shared/{id}` URL format
- **FR-005**: System MUST use URL-safe encoding for all parameters, especially for special characters in video URLs and custom scale names
- **FR-006**: System MUST gracefully handle missing or invalid URL parameters by falling back to application default values
- **FR-007**: System MUST update browser URL (via History API) using debounced updates (500-1000ms delay after last setting change) to enable browser back/forward navigation without creating excessive history entries
- **FR-008**: System MUST preserve custom scale definitions (name, steps, numbers) in URL parameters
- **FR-009**: Share functionality MUST generate URLs instantly without requiring asynchronous database operations
- **FR-010**: System MUST validate parsed URL parameters to ensure data integrity (e.g., octave within valid range 1-8, valid note names, etc.)
- **FR-010a**: System MUST handle duplicate/conflicting parameters by using the last occurrence in the URL (following standard URLSearchParams behavior)
- **FR-010b**: System MUST detect invalid custom scale data (steps outside 0-11 range, non-numeric values, mismatched array lengths), fall back to default Major scale, display an error message to the user, and continue loading other valid settings
- **FR-011**: System MUST use human-readable parameter names (octave, scale, baseNote, pianoVisible, etc.) instead of abbreviated names to support manual URL editing
- **FR-011a**: System MUST block share creation when generated URL would exceed 2000 characters and display a message suggesting user disable video URL or simplify custom scales
- **FR-012**: System MUST prevent parsing of tooltip refs and other transient UI state from URLs
- **FR-013**: System MUST validate video URLs using regex to ensure https-only protocol and reject dangerous protocols (javascript:, data:, file:) while allowing any domain
- **FR-014**: System MUST support both query string (?key=value) and hash-based (#key=value) URL formats for maximum browser compatibility
- **FR-015**: Copy to clipboard functionality MUST work with the new URL-based share links
- **FR-016**: System MAY retain Firebase as read-only for existing shared links during transition period
- **FR-017**: System MUST document the URL parameter schema for future developers
- **FR-018**: System MUST support encoding and decoding help overlay visibility state via `helpVisible` parameter (boolean: true/false)
- **FR-019**: System MUST support encoding and decoding share modal open state and position via `shareModalOpen`, `shareModalX`, and `shareModalY` parameters
- **FR-020**: System MUST support encoding and decoding video modal position via `videoModalX` and `videoModalY` parameters (when `videoModalOpen=true`)
- **FR-021**: System MUST support encoding and decoding help modal position via `helpModalX` and `helpModalY` parameters (when `helpVisible=true`)
- **FR-022**: System MUST validate modal position parameters to ensure they are numeric and within reasonable viewport bounds
- **FR-023**: System MUST clamp modal positions to keep modals visible within the viewport with minimum padding from edges
- **FR-024**: System MUST use pixel coordinates for modal positions (not percentages) for precise control across different screen sizes
- **FR-025**: System MUST default help overlay visibility to false (hidden) when parameter is not present in URL

### Key Entities

- **URL Parameter Schema**: Defines the mapping between application state and URL query parameters, including:
  - Human-readable parameter names (e.g., `octave`, `scale`, `baseNote`, `pianoVisible`, `videoModalOpen`, `helpVisible`)
  - Encoding strategies for complex objects (scaleObject encoded as separate parameters: `scaleName`, `scaleSteps`, `scaleNumbers`)
  - Array serialization format (notation as comma-separated values)
  - Boolean encoding as `true`/`false` strings
  - Numeric values for modal positions (pixels)
  - Version indicator for future format changes

- **Settings State**: The complete user configuration that can be encoded/decoded:
  - Musical settings (octave, scale, base note, clef)
  - Display settings (notation, theme, visibility toggles)
  - Sound settings (instrument, piano state)
  - Video settings (URL, active state, tab, modal position)
  - Custom scales (user-defined scale objects)
  - Help overlay settings (visibility, modal position)
  - Share modal settings (open state, modal position)

- **Modal State**: Defines the state for each modal/overlay that can be encoded:
  - Video Modal: open state (`videoModalOpen`), X position (`videoModalX`), Y position (`videoModalY`)
  - Help Modal: visibility (`helpVisible`), X position (`helpModalX`), Y position (`helpModalY`)
  - Share Modal: open state (`shareModalOpen`), X position (`shareModalX`), Y position (`shareModalY`)
  - Default positions: top 7%, left 5% when positions not specified
  - Position validation: must be numeric, clamped to viewport bounds

- **Migration Strategy**: Handles transition from Firebase to URL-based storage:
  - Legacy URL detection pattern (`/shared/{id}`)
  - Fallback mechanism for reading Firebase
  - Deprecation timeline for Firebase dependency
  - No backwards compatibility needed for abbreviated parameter names (feature not yet released)

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can generate a shareable link in under 1 second (compared to current Firebase write latency)
- **SC-002**: Generated URLs successfully restore all settings with 100% accuracy when opened
- **SC-003**: URLs remain under 2000 characters for 95% of typical user configurations
- **SC-004**: All existing shared links (Firebase-based) continue to work during transition period
- **SC-005**: Users can bookmark and reopen configurations with complete setting preservation
- **SC-006**: Browser back/forward navigation correctly restores previous settings states
- **SC-007**: Share functionality works offline (no network dependency for URL generation)
- **SC-008**: URLs created today continue to work in future versions of the application (backwards compatibility)
- **SC-009**: Zero Firebase database writes for new share operations (complete migration from write operations)
- **SC-010**: Custom scales with up to 12 steps can be encoded and restored from URLs
- **SC-011**: Users can manually edit URL parameters to change settings without consulting documentation (human-readable parameter names)
- **SC-012**: Help overlay visibility state is preserved in shared URLs with 100% accuracy
- **SC-013**: Multiple modals can be opened simultaneously with positions preserved in shared URLs
- **SC-014**: Modal positions are restored within 10 pixels of original position when URL is opened on same screen size
- **SC-015**: Modals remain visible on screen even when URL contains out-of-bounds position values (automatic clamping)

## Assumptions

1. **URL Encoding Format**: We will use standard URL query parameter format with human-readable parameter names for manual editability (e.g., `?octave=4&scale=Major&baseNote=C&videoModalOpen=true&videoModalX=100&videoModalY=150`)
2. **Complex Object Serialization**: Scale objects will be encoded as separate parameters (e.g., `scaleName=Custom&scaleSteps=0,2,4,5,7,9,11&scaleNumbers=1,2,3,4,5,6,7`)
3. **Browser History Updates**: The app will use `history.pushState()` or `history.replaceState()` to update URLs without page reloads, with 500-1000ms debouncing on any setting change to avoid excessive history entries from rapid changes
4. **Default Values**: Any parameter not present in the URL will fall back to the same defaults currently used in `WholeApp.js` initial state. Help overlay defaults to hidden when not specified.
5. **Security**: Video URLs will be validated using regex to ensure https-only protocol and reject dangerous protocols (javascript:, data:, file:) while allowing any domain for flexibility with future video platforms
6. **Backwards Compatibility Window**: Firebase read capability will be maintained for at least 6 months to support existing shared links. No backwards compatibility needed for abbreviated parameter names since feature is not yet released.
7. **URL Length Management**: If a configuration would generate a URL exceeding 2000 characters, the system will block share creation and display a message suggesting the user disable video URL or simplify custom scale definitions
8. **Browser Support**: The History API is supported in all modern browsers (IE10+), which aligns with the app's existing browser support policy
9. **Share Link Format**: New share links will use the same domain and path structure, just replacing the Firebase ID with query parameters (e.g., `/` or `/?octave=4&scale=Major...` instead of `/shared/abc123`)
10. **Performance**: URL parsing and state initialization will occur synchronously during app mount, with minimal performance impact compared to asynchronous Firebase reads
11. **Modal Positioning**: Modal positions will be encoded as pixel coordinates (not percentages) relative to viewport. Positions will be validated and clamped to ensure modals remain visible with minimum 20px padding from screen edges.
12. **Modal Position Persistence**: Modal positions are only encoded when modals are open. Dragging a modal updates its position in the app state, which will be included in the next URL update (debounced).
13. **Cross-Device Position Behavior**: Modal positions encoded in URLs may not translate perfectly across devices with different screen sizes. Positions will be clamped to viewport bounds on smaller screens.
14. **Help Overlay Default**: The help overlay defaults to hidden (false) when the `helpVisible` parameter is not present in the URL, aligning with the current application behavior of not showing help on initial load.

## Dependencies

- Current Firebase integration (for read-only fallback during transition)
- Browser History API support
- URL encoding/decoding utilities
- React component lifecycle (for URL parameter parsing on mount)
- React Draggable library (for modal positioning and drag functionality)
- Modal component state management (ShareButton, VideoButton, HelpButton)
- Overlay component positioning system

## Out of Scope

- URL shortening services integration (may be added in future)
- Migrating existing Firebase data to URL format (old links continue using Firebase)
- User accounts or authentication (remains stateless)
- Persisting user preferences across sessions without URLs (remains client-side only via localStorage if needed)
- Analytics or tracking of shared link usage
- Social media preview cards/metadata for shared links (Open Graph tags)
- QR code generation for shared links
- Backwards compatibility with abbreviated parameter names (feature not yet released)
- Automatic cascading layout algorithm for multiple modals (positions must be manually arranged by user)
- Responsive modal repositioning for different screen sizes (positions are clamped but not adjusted proportionally)
- Z-index management for stacked modals (browser default behavior used)
- Modal size encoding in URLs (only positions are encoded, sizes use defaults)
