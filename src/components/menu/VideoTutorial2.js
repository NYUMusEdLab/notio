import React, { useRef, useState } from "react";
import ReactPlayer from "react-player/lazy";
import { Tabs, Tab, Form, Button } from "react-bootstrap";
import Overlay from "./Overlay";

const VideoTutorial = (props) => {
  const urlInputRef = useRef();

  const [playing, setPlaying] = useState(false);
  // const [played, setPlayed] = useState(0);
  // const [loaded, setLoaded] = useState(0);
  // const [duration, setDuration] = useState(0);
  // const [minimized, setMinimized] = useState(false);
  // const [show, setShow] = useState(props.vissible);
  const [activeTab, setActiveTab] = useState("playlist");
  // const [playerIsReady, setPlayerIsReady] = useState(false);
  const [videoUrl, setVideoUrl] = useState(props.videoUrl);

  //TODO: Remove
  // const handlePlayPause = () => {
  //   setPlaying(!playing);
  //   props.handleChangeVideoVisibility();
  // };

  const handleSubmit = (event) => {
    event.preventDefault();
    setVideoUrl(event.target.elements[0].value);
    props.handleChangeVideoUrl(event.target.elements[0].value);
    setActiveTab("playlist");
  };

  // //this can be used if we make the tabs controlled
  // const handleSelect = (key) => {
  //   // A bit dummy but need to control tabs after submit (cf handleSumbit())

  //   if (key === "playlist") {
  //     setActiveTab("playlist");
  //     // this.setState({ activeTab: "playlist" });
  //   }
  //   if (key === "change_video") {
  //     setActiveTab("change_video");
  //     //   this.setState({ activeTab: "change_video" });
  //   }
  // };

  const playerOnReady = (event) => {
    // A bit dummy but need to control tabs after submit (cf handleSumbit())
    // setPlayerIsReady(false);
    setPlaying(true);
  };

  const resetVideoUrl = (event) => {
    setVideoUrl(props.resetVideoUrl);
    setActiveTab("playlist");
    props.handleResetVideoUrl();
  };

  return (
    <React.Fragment>
      {/* <Overlay visible={show} key={videoUrl}> */}
      <Overlay visible={true} key={videoUrl}>
        <div className="tabs-wrapper">
          {/* <Tabs defaultActiveKey="playlist" activeKey={state.activeTab} onSelect={handleSelect}  id="controlled-tab-example"> */}
          <Tabs defaultActiveKey="playlist" activeTab={activeTab} id="controlled-tab-example">
            <Tab eventKey="playlist" title="Playlist">
              <ReactPlayer
                className="react-player"
                playing={playing}
                width="100%"
                height="100%"
                url={videoUrl}
                controls={true}
                onReady={playerOnReady}
              />
            </Tab>
            <Tab eventKey="change_video" title="Customize">
              <div>
                <Form onSubmit={handleSubmit}>
                  <Form.Group controlId="formYoutubeUrl">
                    <Form.Label>Video url</Form.Label>
                    <Form.Control type="text" placeholder="Enter url" ref={urlInputRef} />
                    <Form.Text className="text-muted">
                      Enter the url for any video that you want to use with the app.
                    </Form.Text>
                    <Form.Text className="text-muted">Current url: {videoUrl}</Form.Text>

                    <Button variant="primary" type="submit">
                      Use this video
                    </Button>
                    <Button variant="outline-danger" onClick={resetVideoUrl}>
                      Reset to Notio Tutorial
                    </Button>
                  </Form.Group>
                </Form>
              </div>
            </Tab>
          </Tabs>
        </div>
      </Overlay>
    </React.Fragment>
  );
};

export default VideoTutorial;
