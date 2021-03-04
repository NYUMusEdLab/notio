import React, { Component, createRef } from "react";
import $ from "jquery";
import gsap from "gsap";
import Draggable from "gsap/Draggable";

import ReactPlayer from "react-player/lazy";

import VideoSVG from "../../assets/img/Video";
import UnderscoreSVG from "../../assets/img/Underscore";
import CrossSVG from "../../assets/img/Cross";
import Popup from "./Popup";

const components = {
  video: <VideoSVG />,
};
class VideoTutorial extends Component {
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

  handlePlayPause = () => {
    this.setState({ playing: !this.state.playing });
  };

  render() {
    const { url, playing } = this.state;
    return (
      <div>
        <Popup
          class="popup-video"
          draggable={true}
          picto={components[this.props.label]}
          onClickMenuHandler={this.handlePlayPause}
          onClickCloseHandler={this.props.handlePlayPause}
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

export default VideoTutorial;
