import React, { Component } from "react";
import ReactPlayer from "react-player/lazy";
import { Tabs, Tab, Form, FormGroup, Button } from 'react-bootstrap';
import VideoSVG from "../../assets/img/Video";
import Popup from "./Popup";


const components = {
  video: <VideoSVG />,
};


class VideoTutorial extends Component {
  state = {
    playing: false,
    played: 0,
    loaded: 0,
    duration: 0,
    minimized: false,
    show: false,
    validated: false,
    setValidated: false,
    activeTab: "playlist",
    playerIsReady: false
  };

  handlePlayPause = () => {
    this.setState({ playing: !this.state.playing });
  };

  handleSubmit = (event) => {
    const form = event.currentTarget;
    console.log("form.checkValidity()", form.checkValidity());
    // if (form.checkValidity() === false) {
    event.preventDefault();
    // event.stopPropagation();
    console.log("form", event.target.elements[0].value);

    // }

    // set video url
    this.props.handleChangeVideoUrl(event.target.elements[0].value);

    this.setState({
      setValidated: true,
      activeTab: "playlist"
    });

  };

  handleSelect = (key) => {
    // A bit dummy but need to control tabs after submit (cf handleSumbit())
    if (key === 'playlist')
      this.setState({ activeTab: "playlist" })
    if (key === 'change_video')
      this.setState({ activeTab: "change_video" })
  }

  playerOnReady = (event) => {
    // A bit dummy but need to control tabs after submit (cf handleSumbit())
    this.setState({ playerIsReady: true })
  }


  resetVideoUrl = (event) => {
    this.props.resetVideoUrl();

    this.setState({
      activeTab: "playlist"
    })
  }


  render() {
    const { playing, validated, activeTab, playerIsReady } = this.state;

    return (
      <div>
        <Popup
          class="popup-video"
          title={this.props.title}
          draggable={true}
          picto={components[this.props.label]}
          onClickMenuHandler={this.handlePlayPause}
          onClickCloseHandler={this.handlePlayPause}
          hasMinize={true}
          content={
            <div class="tabs-wrapper">
              <Tabs defaultActiveKey="playlist" activeKey={activeTab} onSelect={this.handleSelect} id="uncontrolled-tab-example">
                <Tab eventKey="playlist" title="Playlist">
                  <ReactPlayer
                    ref={this.ref}
                    className="react-player"
                    playing={playing}
                    width="100%"
                    height="100%"
                    url={this.props.videoUrl}
                    onReady={this.playerOnReady}
                  />}
                  />


                </Tab>
                <Tab eventKey="change_video" title="Customize">
                  <div>
                    <Form onSubmit={this.handleSubmit}>
                      <Form.Group controlId="formYoutubeUrl">
                        <Form.Label>Youtube playlist url</Form.Label>
                        <Form.Control type="text" placeholder="Enter url" />
                        <Form.Text className="text-muted">
                          Change the Notio tutorials by any other url</Form.Text>

                        <Button variant="primary" type="submit">
                          Submit
                      </Button>
                        <Button variant="outline-danger" onClick={this.resetVideoUrl}>Reset to Notio Tutorial</Button>
                      </Form.Group>
                    </Form>
                  </div>
                </Tab>
              </Tabs>
            </div>
          }
        />
      </div>
    );
  }
}

export default VideoTutorial;
