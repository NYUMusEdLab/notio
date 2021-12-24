import React, { Component } from "react";
import gsap from "gsap";
import Draggable from "gsap/Draggable";
import UnderscoreSVG from "../../assets/img/Underscore";
import CrossSVG from "../../assets/img/Cross";

class Popup extends Component {
  static defaultProps = {
    onClickMenuHandler: () => { },
    onClickCloseHandler: () => { },
    hasBG: false,
    hasMinize: false,
    draggable: false,
  };
  state = {
    minimized: false,
    show: this.props.active ? true : false,
  };

  componentDidMount() {
    if (this.props.draggable) {
      gsap.registerPlugin(Draggable);

      Draggable.create(".notio-popup", {
        type: "x,y",
        edgeResistance: 0.65,
        //bounds: ".Piano", // Sets the bounds of the Popup to only be inside the KeyBoard Component
        inertia: true,
        trigger: ".nav-tabs"
      });
    }
  }

  handleShow = () => {
    this.setState({ show: !this.state.show });
  };

  handleMinimize = () => {
    this.setState({ minimized: !this.state.minimized });
  };

  render() {
    // console.log("this.props.hasMinize", this.props.hasMinize);
    return (
      <div>
        <div className="button">
          <div
            className="circledButton"
            onClick={(e) => {
              this.props.onClickMenuHandler();
              this.handleShow();
            }}
          >
            {this.props.picto}
          </div>
          <div className="title--wrapper">
            <span className="title" title={this.props.title}>{this.props.title}</span>
          </div>

        </div>

        {this.props.hasBG ? (
          <div className={`notio-popup--bg ${this.state.show ? "show" : ""}`}></div>
        ) : (
          ""
        )}
        <div
          className={
            this.props.className +
            ` notio-popup ${this.state.minimized ? "minimized" : ""} ${this.state.show ? "show" : ""}`
          }
        >
          <div className="notio-popup--header clearfix">
            <div
              className="close notio-popup--button"
              onClick={(e) => {
                this.props.onClickCloseHandler();
                this.handleShow();
              }}
            >
              <CrossSVG />
            </div>
            {this.props.hasMinize ? (
            <div
              className="minimize notio-popup--button"
              onClick={this.handleMinimize}
            >
              <UnderscoreSVG />
            </div>
            ) : (
              ""
            )}
          </div>
          {this.props.content}
        </div>
      </div>
    );
  }
}

export default Popup;
