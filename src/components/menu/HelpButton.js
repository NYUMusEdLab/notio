/* eslint-disable no-fallthrough */

import React, { Component } from "react";
import InfoOverlay from "../OverlayPlugins/InfoOverlay";

class HelpButton extends Component {
  static defaultProps = {
    onClickMenuHandler: () => {},
    onClickCloseHandler: () => {},
    hasBG: false,
    hasMinize: false,
    draggable: false,
    startOpen: true, // Default to open for first-time users
  };
  state = {
    minimized: false,
    show: this.props.startOpen !== undefined ? this.props.startOpen : true,
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
  };

  handleKeyDown = (event) => {
    // Keyboard accessibility: Activate on Enter or Space key
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault(); // Prevent Space from scrolling page
      this.handleShow();
    }
  };

  render() {
    return (
      <React.Fragment>
        <div className="sub-menu">
          <div
            ref={this.triggerRef}
            className={`button ${this.props.active}`}
            onClick={this.handleShow}
            onKeyDown={this.handleKeyDown}
            tabIndex={0}
            role="button"
            aria-label="Help">
            <div className="button-title">Press for help</div>
          </div>
        </div>
        <div className="title-wrapper">
          <span className="title" title={this.props.title}>
            {this.props.title}
          </span>
        </div>
        {this.state.show && (
          // import InfoOverlay from "../OverlayPlugins/InfoOverlay";

          // class HelpButton extends Component {
          //   static defaultProps = {
          //     onClickMenuHandler: () => {},
          //     onClickCloseHandler: () => {},
          //     hasBG: false,
          //     hasMinize: false,
          //     draggable: false,
          //   };
          //   state = {
          //     minimized: false,
          //     show: this.props.active ? false : true,
          //   };

          //   handleShow = () => {
          //     this.setState({ show: !this.state.show });
          //   };

          //   render() {
          //     return (
          //       <React.Fragment>
          //         <div className="sub-menu">
          //           <div className={`button ${this.props.active}`} onClick={this.handleShow}>
          //             <div className="button-title">Press for help</div>
          //           </div>
          //         </div>
          //         <div className="title-wrapper">
          //           <span className="title" title={this.props.title}>
          //             {this.props.title}
          //           </span>
          //         </div>
          //         {this.state.show && (
          <InfoOverlay
            vissible={this.props.active}
            videoUrl={this.props.videoUrl}
            handleChangeVideoVisibility={this.props.handleChangeVideoVisibility}
            handleChangeVideoUrl={this.props.handleChangeVideoUrl}
            resetVideoUrl={this.props.resetVideoUrl}
            handleResetVideoUrl={this.props.handleResetVideoUrl}
            onClickCloseHandler={this.handleShow}></InfoOverlay>
        )}
      </React.Fragment>
    );
  }
}

export default HelpButton;
