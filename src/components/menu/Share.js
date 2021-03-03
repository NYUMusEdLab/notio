import React, { Component, createRef } from "react";
import ReactPlayer from "react-player/lazy";
import ShareSVG from "../../assets/img/Share";

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
  constructor(props) {
    super(props);
  }

  render() {
    const { url, playing } = this.state;
    return (
      <div>
        <Popup
          picto=<ShareSVG />
          content={
            <ReactPlayer
              ref={this.ref}
              className="react-player"
              url={url}
              playing={playing}
              width="100%"
              height="100%"
              url="https://youtube.com/playlist?list=PL7imp2jxKd0Bcx4cjR3gEMirkAzd84G_C"
            />
          }
        />
      </div>
    );
  }
}

export default Share;
