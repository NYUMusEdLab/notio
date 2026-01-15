import React, { Component } from "react";
import VideoSVG from "../../assets/img/Video";
import CustomVideoPlayer from "./CustomVideoPlayer";

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

  constructor(props) {
    super(props);
    this.triggerRef = React.createRef();
  }

  handleShow = () => {
    this.setState(prevState => {
      // If closing, restore focus to trigger
      if (prevState.show) {
        setTimeout(() => {
          this.triggerRef.current?.focus();
        }, 0);
      }
      return { show: !prevState.show };
    });
    this.props.handleChangeVideoVisibility();
  };

  handleKeyDown = (event) => {
    // Keyboard accessibility: Activate on Enter or Space key
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault(); // Prevent Space from scrolling page
      this.props.onClickMenuHandler();
      this.handleShow();
      this.props.handleChangeVideoVisibility();
    }
  };

  render() {
    return (
      <React.Fragment>
        <div
          ref={this.triggerRef}
          className="circledButton"
          onClick={(e) => {
            this.props.onClickMenuHandler();
            this.handleShow();
            this.props.handleChangeVideoVisibility();
          }}
          onKeyDown={this.handleKeyDown}
          tabIndex={0}
          role="button"
          aria-label="Watch tutorial video">
          {components[this.props.label]}
        </div>
        <div className="title-wrapper">
          <span className="title" title={this.props.title}>
            {this.props.title}
          </span>
        </div>
        {this.state.show && (
          <CustomVideoPlayer
            defaultVideoUrl={this.props.resetVideoUrl}
            currentVideoUrl={this.props.videoUrl}
            onClose={this.handleShow}
            onUrlChange={this.props.handleChangeVideoUrl}
            initialTab={this.props.activeVideoTab}
          />
        )}
      </React.Fragment>
    );
  }
}
