import React, { Component } from "react";
import gsap from "gsap";
import Draggable from "gsap/Draggable";
import UnderscoreSVG from "../../assets/img/Underscore";
import CrossSVG from "../../assets/img/Cross";

class Popup extends Component {
  static defaultProps = {
    onClickMenuHandler: () => {},
    onClickCloseHandler: () => {},
    hasBG: false,
  };
  state = {
    minimized: false,
    show: false,
  };

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
            this.props.onClickMenuHandler();
            this.handleShow();
          }}
        >
          {this.props.picto}
        </div>
        {this.props.hasBG ? (
          <div class={`notio-popup--bg ${show ? "show" : ""}`}></div>
        ) : (
          ""
        )}
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
                this.props.onClickCloseHandler();
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