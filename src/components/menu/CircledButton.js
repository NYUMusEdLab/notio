import React, { Component, createRef } from "react";
import $ from "jquery";
import gsap from "gsap";
import Draggable from "gsap/Draggable";

import ReactPlayer from "react-player";

import VideoSVG from "../../assets/img/Video";

const components = {
  video: <VideoSVG />,
};
class CircledButton extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    gsap.registerPlugin(Draggable);

    $(".circledButton").click(function () {
      $(".notio-popup").toggleClass("show");
    });

    Draggable.create(".notio-popup", {
      type: "x,y",
      edgeResistance: 0.65,
      bounds: ".Piano",
      inertia: true,
    });
  }

  render() {
    return (
      <div>
        <div class="circledButton">{components[this.props.label]}</div>
        <div class="notio-popup">
          <ReactPlayer url="https://youtube.com/playlist?list=PL7imp2jxKd0Bcx4cjR3gEMirkAzd84G_C" />
        </div>
      </div>
    );
  }
}

export default CircledButton;
