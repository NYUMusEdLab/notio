import React, { Component, createRef } from "react";
import $ from "jquery";
import gsap from "gsap";
import Draggable from "gsap/Draggable";

import ReactPlayer from "react-player/lazy";

import VideoSVG from "../../assets/img/Video";
import UnderscoreSVG from "../../assets/img/Underscore";
import CrossSVG from "../../assets/img/Cross";

const components = {
  video: <VideoSVG />,
};
class Popup extends Component {
  state = {
    minimized: false,
    show: false,
  };
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    if (this.props.draggable) {
      gsap.registerPlugin(Draggable);

      Draggable.create(".notio-popup", {
        type: "x,y",
        edgeResistance: 0.65,
        bounds: ".Piano",
        inertia: true,
      });
    }

    // $('.notio-popup').each(function() {
    //   gsap.set('.resize-handle', { top: drag.width(), left: drag.height() });
    // }
    // gsap.set(".resize-handle", { top: $('.notio-popup').width(), left: $('.notio-popup').height() });

    // Draggable.create(".resize-handle", {
    //   type:"bottom,right",
    //   onPress: function(e) {
    //     e.stopPropagation(); // cancel drag
    //   },
    //   onDrag: function(e) {
    //     gsap.set(this.target.parentNode, { width: this.x, height: this.y });
    //   }
    // });
  }

  handleShow = () => {
    this.setState({ show: !this.state.show });
  };

  handleMinimize = () => {
    this.setState({ minimized: !this.state.minimized });
  };

  render() {
    const { minimized, show } = this.state;
    return (
      <div>
        <div
          class="circledButton"
          onClick={(e) => {
            this.props.handlePlayPause();
            this.handleShow();
          }}
        >
          {this.props.picto}
        </div>
        <div
          class={
            this.props.class +
            ` notio-popup ${minimized ? "minimized" : ""} ${show ? "show" : ""}`
          }
        >
          <div class="notio-popup--header clearfix">
            <div
              class="close notio-popup--button"
              onClick={(e) => {
                this.handlePlayPause();
                this.handleShow();
              }}
            >
              <CrossSVG />
            </div>
            <div
              class="minimize notio-popup--button"
              onClick={this.handleMinimize}
            >
              <UnderscoreSVG />
            </div>
          </div>
          {this.props.content}
          {/* <div class='resize-handle'></div> */}
        </div>
      </div>
    );
  }
}

export default Popup;
