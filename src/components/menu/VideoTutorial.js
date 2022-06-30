import React, { useRef, useState } from "react";
import ReactPlayer from "react-player/lazy";
import { Tabs, Tab, Form, Button } from "react-bootstrap";
import Overlay from "./Overlay";

const VideoTutorial = (props) => {
  const urlInputRef = useRef();
  const [playing, setPlaying] = useState(false);
  const [videoUrl, setVideoUrl] = useState(props.videoUrl);
  const [activeTab,setActiveTab] = useState(props.active_video_tab);
  //  activeTab = props.active_video_tab ? props.active_video_tab : "Enter_url" ;

  const handleSubmit = (event) => {
    event.preventDefault();
    setVideoUrl(event.target.elements[0].value);
    props.handleChangeVideoUrl(event.target.elements[0].value);
    // setActiveTab("Player");
  };

  // //this can be used if we make the tabs controlled
  // const handleSelect = (key) => {
  //   // A bit dummy but need to control tabs after submit (cf handleSumbit())

  //   if (key === "Player") {
  //     setActiveTab("Player");
  //     // this.setState({ activeTab: "Player" });
  //   }
  //   if (key === "Enter_url") {
  //     setActiveTab("Enter_url");
  //     //   this.setState({ activeTab: "Enter_url" });
  //   }
  // };

  const playerOnReady = (event) => {
    // A bit dummy but need to control tabs after submit (cf handleSumbit())
    // setPlayerIsReady(false);
    setPlaying(true);
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
      <Overlay visible={true} key={videoUrl} close={props.onClickCloseHandler}>
        <div className="tabs-wrapper">
          {/* <Tabs defaultActiveKey="Player" activeKey={state.activeTab} onSelect={handleSelect}  id="controlled-tab-example"> */}
          {/* <Tabs defaultActiveKey="Player" activeTab={activeTab} id="controlled-tab-example"> */}
          <Tabs defaultActiveKey={activeTab} id="controlled-tab-example">
            <Tab eventKey="Player" title="Player">
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
            <Tab eventKey="Enter_url" title="Enter url">
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
