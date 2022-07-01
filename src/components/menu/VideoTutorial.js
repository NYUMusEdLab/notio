import React, { useRef, useState } from "react";
import ReactPlayer from "react-player/lazy";
import { Tabs, Tab, Form, Button } from "react-bootstrap";
import Overlay from "./Overlay";

const VideoTutorial = (props) => {
  const urlInputRef = useRef();
  const [playing, setPlaying] = useState(false);
  const [videoUrl, setVideoUrl] = useState(props.videoUrl);
  const [activeTab,setActiveTab] = useState(props.activeVideoTab);
  // TODO:use this : handleChangeActiveVideoTab={this.props.handleChangeActiveVideoTab}, when a tab is selected to persist the selection


  const handleSubmit = (event) => {
    event.preventDefault();
    setVideoUrl(event.target.elements[0].value);
    props.handleChangeVideoUrl(event.target.elements[0].value);
    props.handleChangeActiveVideoTab("Player")
    setActiveTab("Player");
  };

  // //this can be used if we make the tabs controlled
  const handleTabSelected = (key) => {
    // A bit dummy but need to control tabs after submit (cf handleSumbit())

    if (key === "Player") {
      setActiveTab("Player");
      props.handleChangeActiveVideoTab("Player")
      // this.setState({ activeTab: "Player" });
    }
    if (key === "Enter_url") {
      setActiveTab("Enter_url");
      props.handleChangeActiveVideoTab("Enter_url")

      //   this.setState({ activeTab: "Enter_url" });
    }
  };

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
          <Tabs defaultActiveKey={activeTab} activeTab={activeTab} id="controlled-tab-example" onSelect={handleTabSelected}>
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
              <div >
                <Form onSubmit={handleSubmit}>
                  <Form.Group className="video-url" controlId="formYoutubeUrl">
                    <Form.Label className="video-url__title">Video url</Form.Label>
                    
                    <Form.Control className="video-url__url-field" type="text" placeholder={props.videoUrl} ref={urlInputRef} >
                    </Form.Control>

                    <Form.Text className="video-url__explainer text-muted">
                      Enter the url for any youtube video or playlist that you want to use with Notio and hit Enter.
                    </Form.Text>
                    {/* <Form.Text className="text-muted">Current url: {videoUrl}</Form.Text> */}
                    <Button className="video-url__btn--reset" variant="outline-danger" onClick={resetVideoUrl}>
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
              
            </Tab>
          </Tabs>
        </div>
      </Overlay>
    </React.Fragment>
  );
};

export default VideoTutorial;
