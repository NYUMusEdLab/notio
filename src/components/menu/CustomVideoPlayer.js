import React, { useState, useRef } from "react";
import PropTypes from "prop-types";
import ReactPlayer from "react-player/lazy";
import { Tabs, Tab, Form, Button } from "react-bootstrap";
import Overlay from "../OverlayPlugins/Overlay";

/**
 * CustomVideoPlayer - A customizable video player component
 *
 * Displays video content in an overlay/modal with:
 * - Default URL from settings (US1)
 * - Custom URL entry (US2)
 * - Reset to default functionality (US3)
 * - Draggable overlay display (US4)
 *
 * @param {string} defaultVideoUrl - Required. The initial/default video URL from settings
 * @param {function} onClose - Required. Callback when overlay closes
 * @param {string} initialTab - Optional. Initial tab to display ('Player' or 'Enter_url')
 * @param {function} onUrlChange - Optional. Callback when video URL changes
 */
const CustomVideoPlayer = (props) => {
  const { defaultVideoUrl, onClose, initialTab, onUrlChange } = props;

  // Component state
  const [currentUrl, setCurrentUrl] = useState(defaultVideoUrl);
  const [activeTab, setActiveTab] = useState(initialTab || "Player");
  const [isPlaying, setIsPlaying] = useState(false);
  const [error, setError] = useState(null);

  // Refs
  const urlInputRef = useRef();

  // US1: onReady handler
  const handlePlayerReady = () => {
    setIsPlaying(true);
    setError(null);
  };

  // Error handler for ReactPlayer
  const handlePlayerError = (err) => {
    setError("Unable to load video. Please check the URL and try again.");
    setIsPlaying(false);
  };

  // Tab selection handler
  const handleTabSelect = (key) => {
    setActiveTab(key);
  };

  // US2: Handle URL form submission (T022)
  const handleSubmit = (event) => {
    event.preventDefault();
    const newUrl = urlInputRef.current?.value;

    // T042: Prevent empty URL submission
    if (!newUrl || newUrl.trim() === "") {
      return;
    }

    setCurrentUrl(newUrl);
    setActiveTab("Player");
    setError(null);
    onUrlChange(newUrl);
  };

  // US3: Reset to default URL (T030)
  const handleReset = () => {
    setCurrentUrl(defaultVideoUrl);
    setActiveTab("Player");
    setError(null);
    onUrlChange(defaultVideoUrl);
  };

  // Keyboard navigation handler for buttons
  const handleKeyDown = (event, action) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      action();
    }
  };

  return (
    <Overlay visible={true} close={onClose} key={currentUrl}>
      <div
        className="tabs-wrapper"
        data-testid="custom-video-player"
        role="region"
        aria-label="Video player"
      >
        <Tabs
          activeKey={activeTab}
          id="custom-video-player-tabs"
          onSelect={handleTabSelect}
        >
          {/* US1: Player Tab */}
          <Tab eventKey="Player" title="Player">
            <ReactPlayer
              className="react-player"
              playing={isPlaying}
              width="100%"
              height="100%"
              url={currentUrl}
              controls={true}
              onReady={handlePlayerReady}
              onError={handlePlayerError}
            />
            {error && (
              <div
                className="video-error"
                role="alert"
                aria-live="polite"
              >
                {error}
              </div>
            )}
          </Tab>

          {/* US2 & US3: Enter URL Tab */}
          <Tab eventKey="Enter_url" title="Enter URL">
            <div>
              <Form onSubmit={handleSubmit}>
                <Form.Group className="video-url" controlId="formVideoUrl">
                  <Form.Label className="video-url__title">Video URL</Form.Label>

                  {/* US2: URL input field (T021) */}
                  <Form.Control
                    className="video-url__url-field"
                    type="text"
                    placeholder="Enter URL"
                    ref={urlInputRef}
                    aria-label="Enter video URL"
                  />

                  <Form.Text className="video-url__explainer text-muted">
                    Enter the URL for any YouTube, Vimeo, or direct video file
                    that you want to use with Notio and hit Enter.
                  </Form.Text>

                  {/* US2: Currently watching display (T023) */}
                  <Form.Text className="video-url__currently-watching">
                    You are currently watching:{" "}
                    <a href={currentUrl} target="_blank" rel="noopener noreferrer">
                      {currentUrl}
                    </a>
                  </Form.Text>

                  {/* US3: Reset button (T029, T031, T032) */}
                  <Button
                    className="video-url__btn--reset"
                    variant="outline-danger"
                    onClick={handleReset}
                    onKeyDown={(e) => handleKeyDown(e, handleReset)}
                    aria-label="Reset to default video"
                    tabIndex={0}
                  >
                    Reset
                  </Button>

                  {/* US2: Submit button (T025) */}
                  <Button
                    className="video-url__btn--submit"
                    variant="primary"
                    type="submit"
                    aria-label="Enter video URL"
                  >
                    Enter
                  </Button>
                </Form.Group>
              </Form>
            </div>
          </Tab>
        </Tabs>
      </div>
    </Overlay>
  );
};

// PropTypes definitions
CustomVideoPlayer.propTypes = {
  defaultVideoUrl: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
  initialTab: PropTypes.oneOf(["Player", "Enter_url"]),
  onUrlChange: PropTypes.func,
};

CustomVideoPlayer.defaultProps = {
  initialTab: "Player",
  onUrlChange: () => {},
};

export default CustomVideoPlayer;
