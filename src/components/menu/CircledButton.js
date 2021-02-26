import React, { Component, createRef } from "react";
import $ from "jquery";
import gsap from "gsap";
import Draggable from "gsap/Draggable";

// import 'reactjs-popup/dist/index.css';

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
          <iframe
            id="ytplayer"
            type="text/html"
            width="300"
            height="168.75"
            src="https://www.youtube.com/embed/?listType=playlist&list=PL7imp2jxKd0Bcx4cjR3gEMirkAzd84G_C&enablejsapi=1&loop=1&modestbranding=1&color=white"
            frameborder="0"
            allowfullscreen
          ></iframe>
        </div>
      </div>
    );
  }
}

export default CircledButton;
