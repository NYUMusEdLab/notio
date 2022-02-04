import React, { Component } from "react";
import ShareSVG from "../../assets/img/Share";
import Overlay from "./Overlay";
import Share from "./Share";
import VideoTutorial from "./VideoTutorial";
const components = {
  share: <ShareSVG />,
};

export default class ShareButton extends Component {
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
      <div>
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
        {this.state.show && (
          <Overlay>
            <Share saveSessionToDB={this.props.saveSessionToDB} sessionID={this.props.sessionID} />
          </Overlay>
        )}
      </div>
    );
  }
}
