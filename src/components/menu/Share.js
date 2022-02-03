import React, { Component } from "react";
import ShareSVG from "../../assets/img/Share";
import ShareLink from "./ShareLink";
import Popup from "./Popup";

class Share extends Component {
  state = {
    url: null,
    playing: false,
    played: 0,
    loaded: 0,
    duration: 0,
    minimized: false,
    show: false,
  };

  render() {
    // const { url, playing } = this.state;
    return (
      <div>
        <Popup
          className="popup-menu popup-share"
          draggable={false}
          onClickMenuHandler={this.props.saveSessionToDB}
          hasBG={true}
          content={<ShareLink sessionID={this.props.sessionID} />}
        />
      </div>
    );
  }
}

export default Share;
