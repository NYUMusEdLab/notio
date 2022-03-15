import React, { Component } from "react";
import ShareSVG from "../../assets/img/Share";
import ShareLink from "./ShareLink";
import Popup from "./Popup";
import Overlay from "./Overlay";
import { Tabs, Tab, Button } from "react-bootstrap";

class Share2 extends Component {
  state = {
    url: null,
    playing: false,
    played: 0,
    loaded: 0,
    duration: 0,
    minimized: false,
    show: false,
  };

  handleSelect = (key) => {
    // A bit dummy but need to control tabs after submit (cf handleSumbit())
    if (key === "share") this.setState({ activeTab: "share" });
  };

  render() {
    // const { url, playing } = this.state;
    return (
      <React.Fragment>
        <Overlay>
          <div className="tabs-wrapper">
            <Tabs
              defaultActiveKey="share"
              activeTab={this.state.activeTab}
              id="controlled-tab-example">
              <Tab eventKey="share" title="Share">
                <Popup
                  title={this.props.title}
                  className="popup-menu popup-share"
                  draggable={false}
                  picto={<ShareSVG />}
                  onClickMenuHandler={this.props.saveSessionToDB}
                  hasBG={true}
                />
                <ShareLink sessionID={this.props.sessionID} />
                <Button onClick={this.props.saveSessionToDB}></Button>

                {/* <Share
                    saveSessionToDB={this.props.saveSessionToDB}
                    sessionID={this.props.sessionID}
                  /> */}
              </Tab>
            </Tabs>
          </div>
        </Overlay>
        {/*         
  <Popup
    title={this.props.title}
    className="popup-menu popup-share"
    draggable={false}
    picto={<ShareSVG />}
    onClickMenuHandler={this.props.saveSessionToDB}
    hasBG={true}>
      
  <ShareLink sessionID={this.props.sessionID} />
    </Popup> */}
      </React.Fragment>
    );
  }
}

export default Share2;
