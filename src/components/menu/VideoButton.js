import React, { Component } from "react";
// import ReactPlayer from 'react-player';
import VideoSVG from "../../assets/img/Video";
// import Overlay from './Overlay';
// import VideoTutorial from './VideoTutorial';
// import { Tabs, Tab, Form, Button } from 'react-bootstrap';
import VideoTutorial from "./VideoTutorial";

const components = {
  video: <VideoSVG />,
};

export default class VideoButton extends Component {
  static defaultProps = {
    onClickMenuHandler: () => {},
    onClickCloseHandler: () => {},
    hasBG: false,
    hasMinize: false,
    draggable: false,
  };
  state = {
    minimized: false,
    show: this.props.active ? true : false,
  };

  handleShow = () => {
    this.setState({ show: !this.state.show });
    this.props.handleChangeVideoVisibility();

  };

  render() {
    return (
      <React.Fragment>
        <div
          className="circledButton"
          onClick={(e) => {
            this.props.onClickMenuHandler();
            this.handleShow();
            this.props.handleChangeVideoVisibility();
          }}>
          {components[this.props.label]}
        </div>
        <div className="title-wrapper">
          <span className="title" title={this.props.title}>
            {this.props.title}
          </span>
        </div>
        {
          this.state.show && (
            <VideoTutorial
              vissible={this.props.active}
              activeVideoTab={this.props.activeVideoTab}
              videoUrl={this.props.videoUrl}
              handleChangeVideoVisibility={this.props.handleChangeVideoVisibility}
              handleChangeActiveVideoTab={this.props.handleChangeActiveVideoTab}
              handleChangeVideoUrl={this.props.handleChangeVideoUrl}
              resetVideoUrl={this.props.resetVideoUrl}
              handleResetVideoUrl={this.props.handleResetVideoUrl}
              onClickCloseHandler={this.handleShow}></VideoTutorial>
          )
          // <Overlay>

          //     <div className="tabs-wrapper">
          //     <Tabs defaultActiveKey="playlist" activeKey={this.state.activeTab} onSelect={this.handleSelect}  id="controlled-tab-example">

          //     <Tab eventKey="playlist" title="Playlist">
          //     <ReactPlayer
          //             ref={this.ref}
          //             className="react-player"
          //             playing={true}
          //             width="100%"
          //             height="100%"
          //             url={this.props.videoUrl}
          //             controls ={true}
          //             // onReady={this.playerOnReady}
          //             />
          //             </Tab>
          //             <Tab eventKey="change_video" title="Customize">
          //           <div>
          //             <Form onSubmit={this.handleSubmit}>
          //               <Form.Group controlId="formYoutubeUrl">
          //                 <Form.Label>Video url</Form.Label>
          //                 <Form.Control type="text" placeholder="Enter url" />
          //                 <Form.Text className="text-muted">
          //                   Enter the url for any video that you want to use with the app</Form.Text>

          //                 <Button variant="primary" type="submit">
          //                   Use this video
          //                 </Button>
          //                 <Button variant="outline-danger" onClick={this.resetVideoUrl}>Reset to Notio Tutorial</Button>
          //               </Form.Group>
          //             </Form>
          //           </div>
          //         </Tab>
          //             </Tabs>
          //     </div>

          //             </Overlay>
        }
      </React.Fragment>
    );
  }
}
