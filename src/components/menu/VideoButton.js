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
        }
      </React.Fragment>
    );
  }
}
