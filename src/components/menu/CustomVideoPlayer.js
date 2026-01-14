import React, { useState, useRef } from "react";
import PropTypes from "prop-types";
import ReactPlayer from "react-player/lazy";
import { Tabs, Tab, Form, Button } from "react-bootstrap";
import Overlay from "../OverlayPlugins/Overlay";

/**
 * CustomVideoPlayer - A customizable video player component
 *
 * Displays video content in an overlay/modal with:
 * - Default URL from settings
 * - Custom URL entry
 * - Reset to default functionality
 *
 * @param {string} defaultVideoUrl - Required. The initial/default video URL from settings
 * @param {function} onClose - Required. Callback when overlay closes
 * @param {string} initialTab - Optional. Initial tab to display ('Player' or 'Enter_url')
 * @param {function} onUrlChange - Optional. Callback when video URL changes
 */
const CustomVideoPlayer = (props) => {
  const { defaultVideoUrl, onClose, initialTab, onUrlChange } = props;

  // Component state (T006)
  const [currentUrl, setCurrentUrl] = useState(defaultVideoUrl);
  const [activeTab, setActiveTab] = useState(initialTab || "Player");
  const [isPlaying, setIsPlaying] = useState(false);
  const [error, setError] = useState(null);

  // Refs
  const urlInputRef = useRef();

  // T012: onReady handler
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

  // T015: Keyboard navigation handler for interactive elements
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
          defaultActiveKey={activeTab}
          id="custom-video-player-tabs"
          onSelect={handleTabSelect}
        >
          {/* Player Tab - T010, T011 */}
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

          {/* Enter URL Tab - placeholder for US2 */}
          <Tab eventKey="Enter_url" title="Enter URL">
            <div className="video-url-placeholder">
              <p>URL entry functionality coming in User Story 2</p>
            </div>
          </Tab>
        </Tabs>
      </div>
    </Overlay>
  );
};

// PropTypes definitions (T005)
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
