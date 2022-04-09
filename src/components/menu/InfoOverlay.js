import React, { useRef, useState } from "react";
import ReactPlayer from "react-player/lazy";
import { Tabs, Tab, Form, Button, FormLabel } from "react-bootstrap";
import Overlay from "./Overlay";

const InfoOverlay = (props) => {
  const urlInputRef = useRef();

  const [playing, setPlaying] = useState(false);
  // const [played, setPlayed] = useState(0);
  // const [loaded, setLoaded] = useState(0);
  // const [duration, setDuration] = useState(0);
  // const [minimized, setMinimized] = useState(false);
  // const [show, setShow] = useState(props.vissible);
  // const [activeTab, setActiveTab] = useState("playlist");
  // const [playerIsReady, setPlayerIsReady] = useState(false);
  const [videoUrl, setVideoUrl] = useState(props.videoUrl);

  const handleSubmit = (event) => {
    event.preventDefault();
    setVideoUrl(event.target.elements[0].value);
    props.handleChangeVideoUrl(event.target.elements[0].value);
    // setActiveTab("playlist");
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
    // setActiveTab("playlist");
    props.handleResetVideoUrl();
  };

  return (
    <React.Fragment>
      {/* <Overlay visible={show} key={videoUrl}> */}
      <Overlay visible={true} key={videoUrl}>
        <div className="tabs-wrapper">
          {/* <Tabs defaultActiveKey="playlist" activeKey={state.activeTab} onSelect={handleSelect}  id="controlled-tab-example"> */}
          {/* <Tabs defaultActiveKey="playlist" activeTab={activeTab} id="controlled-tab-example"> */}
          <Tabs defaultActiveKey="Howto" id="controlled-tab-example">
            <Tab eventKey="Howto" title="How to">
              <div>
                <Form>
                  <Form.Group controlId="formYoutubeUrl">
                    <Form.Label>How to use Notio</Form.Label>
                    <Form.Text className="text-muted">
                      Notio can be used for exploring musical scales and scalemodes. Assisted with
                      youtube videos.
                    </Form.Text>
                    <Form.Text className="text-muted">
                      The menu: Notation:, Root, Scale, Clefs Videoplayer, Share
                    </Form.Text>
                    <Form.Text className="text-muted">
                      The colored stripes: can be played they correspond to a piano keyboard, and
                      can be played using the mouse, or the qwerty keyboard.
                    </Form.Text>
                    <Form.Text className="text-muted">
                      Sharing: You create a unique setup in Notio when adjusting the particular
                      scale, selecting a video url, setting the root note and more. This setup can
                      be shared to other people using the "Share this setup" button and copying the
                      url. When this url is visited, the Notio setup will be persisted connected to
                      that particular url.
                    </Form.Text>
                  </Form.Group>
                </Form>
              </div>
              <p></p>
            </Tab>
            <Tab eventKey="About" title="About">
              <div>
                <Form onSubmit={handleSubmit}>
                  <Form.Group controlId="AboutText">
                    <Form.Label>About</Form.Label>
                    <Form.Text className="text-muted">
                      The Notio Project focuses on developing new pedagogies and technologies for
                      improving the teaching of music theory together within the creative music
                      practices of songwriting and improvisation to improve music education in
                      schools in Finland. This project is funded as a Bridging the Theory and
                      Practice of Music through Educational Research and Technology research grant
                      from the Åbo Academy University Foundation (Finland). The MusEDLab is
                      collaborating with PI Cecilia Björk (Åbo Academy), Mats Granfors (Novia
                      University of Applied Sciences), and Jan Jansson (Vasa Övningsskola).
                    </Form.Text>
                  </Form.Group>
                </Form>
              </div>
            </Tab>
            <Tab eventKey="InstructVideo" title="Instruction Videos">
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
          </Tabs>
        </div>
      </Overlay>
    </React.Fragment>
  );
};

export default InfoOverlay;
