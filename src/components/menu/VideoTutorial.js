import React, { Component } from "react";
import ReactPlayer from "react-player/lazy";

import VideoSVG from "../../assets/img/Video";
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

  handlePlayPause = () => {
    this.setState({ playing: !this.state.playing });
  };

  render() {
    const { playing } = this.state;
    return (
      <div>
        <Popup
          class="popup-video"
          title={this.props.title}
          draggable={true}
          picto={components[this.props.label]}
          onClickMenuHandler={this.handlePlayPause}
          onClickCloseHandler={this.handlePlayPause}
          hasMinize={true}
          content={
            <ReactPlayer
              ref={this.ref}
              className="react-player"
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
