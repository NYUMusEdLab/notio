import React, { useState } from "react";
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
 * @param {string} defaultVideoUrl - Required. The original default video URL (used for reset)
 * @param {string} currentVideoUrl - Optional. The current video URL to display
 * @param {function} onClose - Required. Callback when overlay closes
 * @param {string} initialTab - Optional. Initial tab to display ('Player' or 'Enter_url')
 * @param {function} onUrlChange - Optional. Callback when video URL changes
 */
// Helper to detect ReverbNation URLs
const isReverbNationUrl = (url) => {
  return url && url.includes("reverbnation.com");
};

// Helper to convert ReverbNation URL to embed URL
const getReverbNationEmbedUrl = (url) => {
  // Extract artist name from URL like https://www.reverbnation.com/artistname
  const match = url.match(/reverbnation\.com\/([^/?#]+)/);
  if (match && match[1]) {
    const artistName = match[1];
    // Skip if it's a system page (widget_code, etc.)
    if (artistName === "widget_code" || artistName === "main") {
      return url;
    }
    return `https://www.reverbnation.com/widget_code/html_widget/artist_${artistName}?widget_id=55&pwc[design_id]=5&pwc[layout]=detailed&pwc[size]=fit`;
  }
  return url;
};

// Helper to detect YouTube playlist-only URLs (no video ID)
const isYouTubePlaylistOnly = (url) => {
  if (!url) return false;
  // Playlist-only URL: has "list=" but no "v=" (video ID)
  const hasPlaylist = url.includes("list=");
  const hasVideoId = url.includes("v=");
  const isPlaylistPage = url.includes("youtube.com/playlist");
  return hasPlaylist && (!hasVideoId || isPlaylistPage);
};

// Helper to extract YouTube playlist ID
const getYouTubePlaylistId = (url) => {
  const match = url.match(/[?&]list=([^&]+)/);
  return match ? match[1] : null;
};

// Helper to get YouTube playlist embed URL
const getYouTubePlaylistEmbedUrl = (url) => {
  const playlistId = getYouTubePlaylistId(url);
  if (playlistId) {
    return `https://www.youtube.com/embed/videoseries?list=${playlistId}`;
  }
  return url;
};

// Get ReactPlayer config based on URL type
const getPlayerConfig = (url) => {
  return {
    youtube: {
      playerVars: {
        modestbranding: 1,
        rel: 0,
      },
    },
  };
};

const CustomVideoPlayer = (props) => {
  const { defaultVideoUrl, currentVideoUrl, onClose, initialTab, onUrlChange } = props;

  // Component state - use currentVideoUrl if provided, otherwise defaultVideoUrl
  const [currentUrl, setCurrentUrl] = useState(currentVideoUrl || defaultVideoUrl);
  const [activeTab, setActiveTab] = useState(initialTab || "Player");
  const [isPlaying, setIsPlaying] = useState(false);
  const [error, setError] = useState(null);

  // Check if current URL needs special handling (iframe instead of ReactPlayer)
  const isReverbNation = isReverbNationUrl(currentUrl);
  const isPlaylistOnly = isYouTubePlaylistOnly(currentUrl);

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
    let newUrl = event.target.elements[0].value;

    // T042: Prevent empty URL submission
    if (!newUrl || newUrl.trim() === "") {
      return;
    }

    // Shortcut: "saxjax" loads ReverbNation page
    if (newUrl.trim().toLowerCase() === "saxjax") {
      newUrl = "https://www.reverbnation.com/saxjaxlunaticorchestra";
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
    <Overlay visible={true} close={onClose}>
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
            {isReverbNation ? (
              <iframe
                className="react-player"
                src={getReverbNationEmbedUrl(currentUrl)}
                width="100%"
                height="100%"
                frameBorder="0"
                scrolling="no"
                title="ReverbNation Player"
                allow="autoplay"
                style={{ minHeight: "300px" }}
              />
            ) : isPlaylistOnly ? (
              <iframe
                className="react-player"
                src={getYouTubePlaylistEmbedUrl(currentUrl)}
                width="100%"
                height="100%"
                frameBorder="0"
                title="YouTube Playlist"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                style={{ minHeight: "300px" }}
              />
            ) : (
              <ReactPlayer
                className="react-player"
                playing={isPlaying}
                width="100%"
                height="100%"
                url={currentUrl}
                controls={true}
                onReady={handlePlayerReady}
                onError={handlePlayerError}
                config={getPlayerConfig(currentUrl)}
              />
            )}
            {error && !isReverbNation && !isPlaylistOnly && (
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

          {/* Tutorials Tab - Pre-built tutorial videos */}
          <Tab eventKey="Tutorials" title="Tutorials">
            <div className="video__tutorial__list">
              <div className="video__tutorial__list__item">
                <div className="video__tutorial__list__item__title">Keyboard on/off</div>
                <ReactPlayer
                  className="react-player"
                  width="100%"
                  height="100%"
                  url="https://youtu.be/dkIdl51TBXA"
                  controls={true}
                />
              </div>

              <div className="video__tutorial__list__item">
                <div className="video__tutorial__list__item__title">Notation</div>
                <ReactPlayer
                  className="react-player"
                  width="100%"
                  height="100%"
                  url="https://youtu.be/0z88NcJy8MQ"
                  controls={true}
                />
              </div>

              <div className="video__tutorial__list__item">
                <div className="video__tutorial__list__item__title">Ambitus</div>
                <ReactPlayer
                  className="react-player"
                  width="100%"
                  height="100%"
                  url="https://youtu.be/RuBru-zqINU"
                  controls={true}
                />
              </div>

              <div className="video__tutorial__list__item">
                <div className="video__tutorial__list__item__title">Select different scales</div>
                <ReactPlayer
                  className="react-player"
                  width="100%"
                  height="100%"
                  url="https://youtu.be/Ykgavi2EjZQ"
                  controls={true}
                />
              </div>

              <div className="video__tutorial__list__item">
                <div className="video__tutorial__list__item__title">Video player</div>
                <ReactPlayer
                  className="react-player"
                  width="100%"
                  height="100%"
                  url="https://youtu.be/qoeHCq0N4I0"
                  controls={true}
                />
              </div>

              <div className="video__tutorial__list__item">
                <div className="video__tutorial__list__item__title">Share your setup</div>
                <ReactPlayer
                  className="react-player"
                  width="100%"
                  height="100%"
                  url="https://youtu.be/t-NUdl19sww"
                  controls={true}
                />
              </div>
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
  currentVideoUrl: PropTypes.string,
  onClose: PropTypes.func.isRequired,
  initialTab: PropTypes.oneOf(["Player", "Enter_url", "Tutorials"]),
  onUrlChange: PropTypes.func,
};

CustomVideoPlayer.defaultProps = {
  currentVideoUrl: null,
  initialTab: "Player",
  onUrlChange: () => {},
};

export default CustomVideoPlayer;
