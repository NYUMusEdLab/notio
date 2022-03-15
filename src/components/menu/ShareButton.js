import React, { Component } from "react";
import ShareSVG from "../../assets/img/Share";
// import Overlay from "./Overlay";
// import Share from "./Share";
// import VideoTutorial from "./VideoTutorial";
// import { Tabs, Tab, Form, Button } from "react-bootstrap";
// import { Tabs, Tab } from "react-bootstrap";
import Share2 from "./Share2";

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
  };

  handleShow = () => {
    this.setState({ show: !this.state.show });
  };

  handleSubmit = (event) => {
    event.preventDefault();
    // set video url
    this.props.handleChangeVideoUrl(event.target.elements[0].value);

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
        {this.state.show && (
          <Share2 sessionID={this.props.sessionID}></Share2>

          // <Overlay>
          //   <div className="tabs-wrapper">
          //     <Tabs
          //       defaultActiveKey="share"
          //       activeKey={this.state.activeTab}
          //       onSelect={this.handleSelect}
          //       id="uncontrolled-tab-example">
          //       <Tab eventKey="share" title="Share">
          //         <Share
          //           saveSessionToDB={this.props.saveSessionToDB}
          //           sessionID={this.props.sessionID}
          //         />
          //       </Tab>
          //     </Tabs>
          //   </div>
          // </Overlay>
        )}
      </React.Fragment>
    );
  }
}
