import React, { Component, createRef } from "react";
import ReactPlayer from "react-player/lazy";
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
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    // const { match } = this.props;
    // const { params } = match;
    // const { sessionId } = params;
    // if (sessionId) {
    //   this.openSavedSession(sessionId);
    // } else {
    //   this.setState({
    //     loading: false,
    //   });
    // }
  }

  render() {
    const { url, playing } = this.state;
    return (
      <div>
        <Popup
          class="popup-menu"
          draggable={false}
          picto=<ShareSVG />
          onClickMenuHandler={this.props.saveSessionToDB}
          hasBG={true}
          content=<ShareLink sessionID={this.props.sessionID} />
        />
      </div>
    );
  }
}

export default Share;
