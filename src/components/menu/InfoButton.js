import React, { Component } from "react";
import { Button } from "react-bootstrap";
import InfoOverlay from "./InfoOverlay";

//TODO: Setup the button that triggers the info window, then design the InfoWindow overlay. see VideoTutorial class

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
  };

  render() {
    return (
      <React.Fragment>
        <div className="button">
          <Button
            className="overlay__header__buttonContainer__button--close"
            onClick={(e) => {
              this.handleShow();
            }}>
            <img src={require("../../img/info.png")} alt="about" />
          </Button>
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
