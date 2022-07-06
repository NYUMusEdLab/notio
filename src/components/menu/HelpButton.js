/* eslint-disable no-fallthrough */

import React, { Component } from "react";
import InfoOverlay from "./InfoOverlay";

class HelpButton extends Component {
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
      };

  render() {
    return (
        <React.Fragment>
         <div className="sub-menu">
          <div className={`button ${this.props.active}`} onClick={this.handleShow}>
            <div className="button-title">
              Press for help
            </div>
          </div>
        </div>
          <div className="title-wrapper">
            <span className="title" title={this.props.title}>
              {this.props.title}
            </span>
          </div>
          {this.state.show && (
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
