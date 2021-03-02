import React, { Component, createRef } from "react";
import $ from "jquery";
import gsap from "gsap";
import Draggable from "gsap/Draggable";

import ReactPlayer from 'react-player/lazy'

import VideoSVG from "../../assets/img/Video";
import UnderscoreSVG from "../../assets/img/Underscore";
import CrossSVG from "../../assets/img/Cross";


const components = {
  video: <VideoSVG />,
};
class CircledButton extends Component {

  state = {
    url: null,
    playing: false,
    played: 0,
    loaded: 0,
    duration: 0,
    minimized: false,
    show: false
  }
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    gsap.registerPlugin(Draggable);

    Draggable.create(".notio-popup", {
      type: "x,y",
      edgeResistance: 0.65,
      bounds: ".Piano",
      inertia: true,
    });
  }

  handleShow = () => {
    this.setState({ show: !this.state.show })
  }
  
  handlePlayPause = () => {
    this.setState({ playing: !this.state.playing })
  }

  handleMinimize = () => {
    this.setState({ minimized: !this.state.minimized })
  }



  render() {

    const { url, playing, played, loaded, duration, minimized, show} = this.state
    return (
      <div>
        <div
          class="circledButton"
          onClick={(e) => { this.handlePlayPause(); this.handleShow(); }}>
            {components[this.props.label]}
        </div>
        <div
          class={`notio-popup ${minimized ? "minimized" : ""} ${show ? "show" : ""}` }
        >
        <div class="notio-popup--header clearfix">
          <div class="close notio-popup--button"
            onClick={(e) => { this.handlePlayPause(); this.handleShow(); }}
          ><CrossSVG /></div>
          <div
            class="minimize notio-popup--button"
            onClick={this.handleMinimize}
          ><UnderscoreSVG /></div>
        </div>
          <ReactPlayer 
          ref={this.ref}
          className='react-player'
          url={url}
          playing={playing}
          width='100%'
          height='100%'
          url="https://youtube.com/playlist?list=PL7imp2jxKd0Bcx4cjR3gEMirkAzd84G_C" />
        </div>
      </div>
    );
  }
}

export default CircledButton;
