import React, { useRef, useState } from "react";
import ReactPlayer from "react-player/lazy";
import { Tabs, Tab, Form, Button, Alert } from "react-bootstrap";

import Overlay from "./../OverlayPlugins/Overlay";
import { detectVideoSource } from "./utils/urlDetection";

const VideoTutorial = (props) => {
  const urlInputRef = useRef();
  const [playing, setPlaying] = useState(false);
  const [videoUrl, setVideoUrl] = useState(props.videoUrl);
  const [activeTab, setActiveTab] = useState(props.activeVideoTab);

  // T014: New state fields for universal video player
  const [videoSource, setVideoSource] = useState(null);
  const [error, setError] = useState(null);

  // T020: Network reconnection state
  const [reconnecting, setReconnecting] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  // TODO:use this : handleChangeActiveVideoTab={this.props.handleChangeActiveVideoTab}, when a tab is selected to persist the selection
  const tabKeys = ["Player", "Enter_url", "Tutorials"];

  const handleSubmit = (event) => {
    event.preventDefault();
    const url = event.target.elements[0].value;

    // T015: Detect video source and validate URL
    const source = detectVideoSource(url);

    if (!source.canPlay) {
      // Set error state if URL is not playable
      setError({
        code: "UNSUPPORTED_URL",
        message: "This video link is not supported.",
        suggestion: "Please try a YouTube, Vimeo, Dailymotion, or SoundCloud link.",
      });
      setVideoSource(source);
      return; // Don't proceed with playback
    }

    // Clear any previous errors
    setError(null);
    setVideoSource(source);

    // Maintain existing behavior
    setVideoUrl(url);
    props.handleChangeVideoUrl(url);
    props.handleChangeActiveVideoTab("Player");
    setActiveTab("Player");
  };

  // T016: Handle ReactPlayer errors (network, region-blocked, video unavailable)
  const handleVideoError = (error) => {
    console.error("Video playback error:", error);

    // Determine error type and set appropriate error state
    // Note: ReactPlayer error structure varies by platform
    let errorCode = "PLAYBACK_ERROR";
    let errorMessage = "Unable to play this video.";
    let errorSuggestion = "Please try a different video link.";
    let isNetworkError = false;

    // Check for network errors
    if (error && (error.type === "networkError" || error.message?.includes("network"))) {
      errorCode = "NETWORK_ERROR";
      errorMessage = "Network connection issue.";
      errorSuggestion = "Check your internet connection and try again.";
      isNetworkError = true;
    }

    // Check for region-blocked errors (YouTube blocking) - T018
    if (
      error &&
      (error.message?.includes("blocked") ||
        error.message?.includes("region") ||
        error.message?.includes("not available"))
    ) {
      errorCode = "REGION_BLOCKED";
      errorMessage = "This video is not available in your region.";
      errorSuggestion =
        "Try a different video or use Vimeo, Dailymotion, or SoundCloud instead.";
    }

    // Check for video unavailable
    if (error && (error.message?.includes("unavailable") || error.message?.includes("not found"))) {
      errorCode = "VIDEO_UNAVAILABLE";
      errorMessage = "This video is no longer available.";
      errorSuggestion = "The video may have been removed. Try a different link.";
    }

    // T019: Console logging for debugging
    console.log(`Playback error - URL: ${videoUrl}, Platform: ${videoSource?.platform}, Error code: ${errorCode}`);

    // T020: Network reconnection logic
    if (isNetworkError && retryCount < 3) {
      setReconnecting(true);
      setRetryCount(retryCount + 1);

      console.log(`Attempting reconnection (attempt ${retryCount + 1}/3)...`);

      // Retry playback after 2 seconds
      setTimeout(() => {
        setReconnecting(false);
        setPlaying(true); // Trigger playback restart

        // If this was the last retry and it still fails, the error will be shown
        if (retryCount + 1 >= 3) {
          setError({
            code: errorCode,
            message: "Connection failed after 3 attempts.",
            suggestion: errorSuggestion,
          });
        }
      }, 2000);
    } else {
      // Not a network error or max retries reached - show error
      setReconnecting(false);
      setError({
        code: errorCode,
        message: errorMessage,
        suggestion: errorSuggestion,
      });
    }
  };

  // //this can be used if we make the tabs controlled
  const handleTabSelected = (key) => {
    // A bit dummy but need to control tabs after submit (cf handleSumbit())

    if (tabKeys.includes(key)) {
      setActiveTab(key);
      props.handleChangeActiveVideoTab(key);
    }
    // if (key === "Player") {
    //   setActiveTab("Player");
    //   props.handleChangeActiveVideoTab("Player")
    //   // this.setState({ activeTab: "Player" });
    // }
    // if (key === "Enter_url") {
    //   setActiveTab("Enter_url");
    //   props.handleChangeActiveVideoTab("Enter_url")

    //   //   this.setState({ activeTab: "Enter_url" });
    // }
  };

  const playerOnReady = (event) => {
    // A bit dummy but need to control tabs after submit (cf handleSumbit())
    // setPlayerIsReady(false);
    setPlaying(true);

    // T020: Reset retry count on successful playback
    setRetryCount(0);
    setReconnecting(false);
    setError(null); // Clear any previous errors
  };

  const resetVideoUrl = (event) => {
    console.log(props.resetVideoUrl);
    setVideoUrl(props.resetVideoUrl);
    props.handleResetVideoUrl();
    setActiveTab("Player");
  };

  return (
    <React.Fragment>
      {/* <Overlay visible={show} key={videoUrl}> */}
      <Overlay visible={true} key={videoUrl} close={props.onClickCloseHandler} aria-label="Video player and tutorials">
        <div className="tabs-wrapper">
          {/* <Tabs defaultActiveKey="Player" activeKey={state.activeTab} onSelect={handleSelect}  id="controlled-tab-example"> */}
          {/* <Tabs defaultActiveKey="Player" activeTab={activeTab} id="controlled-tab-example"> */}

          <Tabs
            defaultActiveKey={activeTab}
            // activeTab={activeTab}
            id="controlled-tab-example"
            onSelect={handleTabSelected}>
            <Tab eventKey="Player" title="Player">
              <ReactPlayer
                className="react-player"
                playing={playing}
                width="100%"
                height="100%"
                url={videoUrl}
                controls={true}
                onReady={playerOnReady}
                onError={handleVideoError}
              />
            </Tab>
            <Tab eventKey="Enter_url" title="Enter URL">
              <div>
                <Form onSubmit={handleSubmit}>
                  <Form.Group className="video-url" controlId="formYoutubeUrl">
                    <Form.Label className="video-url__title">Video URL</Form.Label>

                    {/* T017: Error message display with accessibility attributes */}
                    {reconnecting && (
                      <Alert variant="info" role="alert" aria-live="polite" className="video-url__reconnecting">
                        <Alert.Heading>Reconnecting...</Alert.Heading>
                        <p>Attempting to reconnect (attempt {retryCount}/3)</p>
                      </Alert>
                    )}

                    {error && !reconnecting && (
                      <Alert variant="danger" role="alert" aria-live="polite" className="video-url__error">
                        <Alert.Heading>
                          {error.message}
                        </Alert.Heading>
                        <p>{error.suggestion}</p>
                      </Alert>
                    )}

                    <Form.Control
                      className="video-url__url-field"
                      type="text"
                      placeholder={"Enter URL"}
                      ref={urlInputRef}></Form.Control>

                    <Form.Text className="video-url__explainer text-muted">
                      Enter the URL for any YouTube video or playlist that you want to use with
                      Notio and hit Enter.
                    </Form.Text>
                    <Form.Text className="video-url__currently-watching">
                      You are currently watching:
                      <a href={props.videoUrl}> {props.videoUrl} </a>
                    </Form.Text>
                    {/* <Form.Text className="text-muted">Current URL: {videoUrl}</Form.Text> */}
                    <Button
                      className="video-url__btn--reset"
                      variant="outline-danger"
                      onClick={resetVideoUrl}>
                      Reset
                    </Button>
                    <Button className="video-url__btn--submit" variant="primary" type="submit">
                      Enter
                    </Button>
                  </Form.Group>
                </Form>
              </div>
            </Tab>
            <Tab eventKey="Tutorials" title="Tutorials">
              <div className="video__tutorial__list">
                <div className="video__tutorial__list__item">
                  <div className="video__tutorial__list__item__title">Keyboard on/off</div>
                  <ReactPlayer
                    className="react-player" // playing={playing}
                    width="100%"
                    height="100%"
                    url={"https://youtu.be/dkIdl51TBXA"}
                    controls={true}
                    // onReady={playerOnReady}
                  />
                </div>

                <div className="video__tutorial__list__item">
                  <div className="video__tutorial__list__item__title">Notation</div>
                  <ReactPlayer
                    className="react-player"
                    // playing={playing}
                    width="100%"
                    height="100%"
                    url={"https://youtu.be/0z88NcJy8MQ"}
                    controls={true}
                    // onReady={playerOnReady}
                  />
                </div>

                <div className="video__tutorial__list__item">
                  <div className="video__tutorial__list__item__title">Ambitus</div>
                  <ReactPlayer
                    className="react-player"
                    // playing={playing}
                    width="100%"
                    height="100%"
                    url={"https://youtu.be/RuBru-zqINU"}
                    controls={true}
                    // onReady={playerOnReady}
                  />
                </div>

                <div className="video__tutorial__list__item">
                  <div className="video__tutorial__list__item__title">Select different scales</div>
                  <ReactPlayer
                    className="react-player"
                    // playing={playing}
                    width="100%"
                    height="100%"
                    url={"https://youtu.be/Ykgavi2EjZQ"}
                    controls={true}
                    // onReady={playerOnReady}
                  />
                </div>

                <div className="video__tutorial__list__item">
                  <div className="video__tutorial__list__item__title">Video player</div>
                  <ReactPlayer
                    className="react-player"
                    // playing={playing}
                    width="100%"
                    height="100%"
                    url={"https://youtu.be/qoeHCq0N4I0"}
                    controls={true}
                    // onReady={playerOnReady}
                  />
                </div>

                <div className="video__tutorial__list__item">
                  <div className="video__tutorial__list__item__title">Share your setup</div>
                  <ReactPlayer
                    className="react-player"
                    // playing={playing}
                    width="100%"
                    height="100%"
                    url={"https://youtu.be/t-NUdl19sww"}
                    controls={true}
                    // onReady={playerOnReady}
                  />
                </div>
              </div>
            </Tab>
          </Tabs>
        </div>
      </Overlay>
    </React.Fragment>
  );
};

export default VideoTutorial;
