import React, { Component } from "react";
import ShareSVG from "../../assets/img/Share";
// import Overlay from "./Overlay";
// import Share from "./Share";
// import VideoTutorial from "./VideoTutorial";
// import { Tabs, Tab, Form, Button } from "react-bootstrap";
// import { Tabs, Tab } from "react-bootstrap";
import Share from "./Share";

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
    activeTab: "share",
    sessionID: this.props.sessionID,
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
      this.props.onClickMenuHandler();
      this.handleShow();
    }
  };

  handleSubmit = (event) => {
    event.preventDefault();
    // set video url
    this.props.saveSessionToDB();

    this.setState({
      activeTab: "share",
    });
  };

  // handleSelect = (key) => {
  //   // A bit dummy but need to control tabs after submit (cf handleSumbit())
  //   if (key === 'share')
  //     this.setState({ activeTab: "share" })
  //   if (key === 'change_video')
  //     this.setState({ activeTab: "change_video" })
  // }
  render() {
    // console.log("shareButton");
    // console.log(this.props.sessionID);

    return (
      <React.Fragment>
        <div
          ref={this.triggerRef}
          className="circledButton"
          onClick={(e) => {
            this.props.onClickMenuHandler();
            this.handleShow();
          }}
          onKeyDown={this.handleKeyDown}
          tabIndex={0}
          role="button"
          aria-label="Share">
          {components[this.props.label]}
        </div>
        <div className="title-wrapper">
          <span className="title" title={this.props.title}>
            {this.props.title}
          </span>
        </div>
        {this.state.show && (
          <Share
            settings={this.props.state}
            saveSessionToDB={this.props.saveSessionToDB}
            sessionID={this.props.sessionID}
            onClickCloseHandler={this.handleShow}></Share>
        )}
      </React.Fragment>
    );
  }
}
