import React, { Component } from 'react';
import ReactPlayer from 'react-player';
import VideoSVG from "../../assets/img/Video";
import Overlay from './Overlay';
import VideoTutorial from './VideoTutorial';
import { Tabs, Tab, Form, Button } from 'react-bootstrap';

const components = {
    video: <VideoSVG />,
  };


export default class VideoButton extends Component {
    static defaultProps = {
        onClickMenuHandler: () => { },
        onClickCloseHandler: () => { },
        hasBG: false,
        hasMinize: false,
        draggable: false,
      };
      state = {
        minimized: false,
        show: this.props.active ? true : false,
        activeTab: "playlist",

      };

    handleShow = () => {
        this.setState({ show: !this.state.show });
      };


// ----------------
// state = {
//   playing: false,
//   played: 0,
//   loaded: 0,
//   duration: 0,
//   minimized: false,
//   show: false,
//   activeTab: "playlist",
//   playerIsReady: false
// };

handlePlayPause = () => {
  this.setState({ playing: !this.state.playing });
  this.props.handleChangeVideoVisibility()
};

handleSubmit = (event) => {
  event.preventDefault();
  // set video url
  this.props.handleChangeVideoUrl(event.target.elements[0].value);

  this.setState({
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
// ______________________


  render() {
    return (
      <React.Fragment>
        <div className="button">
          <div
            className="circledButton"
            onClick={(e) => {
              this.props.onClickMenuHandler();
              this.handleShow();
            }}>
            {components[this.props.label]}
          </div>
          <div className="title--wrapper">
            <span className="title" title={this.props.title}>
              {this.props.title}
            </span>
          </div>
        </div>
        {this.state.show && <Overlay>
          {/* <VideoTutorial
              handleChangeVideoUrl={this.props.handleChangeVideoUrl}
              videoUrl={this.props.videoUrl}
              resetVideoUrl={this.props.resetVideoUrl}
            />  */}
            <div className="tabs-wrapper">
            <Tabs defaultActiveKey="playlist" activeKey={this.state.activeTab} onSelect={this.handleSelect} id="uncontrolled-tab-example">

            <Tab eventKey="playlist" title="Playlist">
            <ReactPlayer
                    ref={this.ref}
                    className="react-player"
                    playing={true}
                    width="100%"
                    height="100%"
                    url={this.props.videoUrl}
                    // onReady={this.playerOnReady}
                    /> 
                    </Tab>
                    <Tab eventKey="change_video" title="Customize">
                  <div>
                    <Form onSubmit={this.handleSubmit}>
                      <Form.Group controlId="formYoutubeUrl">
                        <Form.Label>Video url</Form.Label>
                        <Form.Control type="text" placeholder="Enter url" />
                        <Form.Text className="text-muted">
                          Enter the url for any video that you want to use with the app</Form.Text>

                        <Button variant="primary" type="submit">
                          Use this video
                        </Button>
                        <Button variant="outline-danger" onClick={this.resetVideoUrl}>Reset to Notio Tutorial</Button>
                      </Form.Group>
                    </Form>
                  </div>
                </Tab>
                    </Tabs>
            </div>
          
                    </Overlay>}
        
      </React.Fragment>
    );
  }
}
