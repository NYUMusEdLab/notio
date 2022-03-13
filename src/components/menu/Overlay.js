import React, { Component } from "react";
import { Button } from "react-bootstrap";
import ReactDOM from "react-dom";
import Draggable from "react-draggable";
import UnderscoreSVG from "../../assets/img/Underscore";
import CrossSVG from "../../assets/img/Cross";
import Toggle from "./Toggle";

export default class Overlay extends Component {
  state = {
    classname: "overlay nodrag",
    draggable: false,
  };

  // handleClick = (event) => {
  //   const draggable = !this.state.draggable;
  //   const className = draggable ? "overlay drag" : "overlay nodrag";

  //   this.setState({ draggable: draggable });
  //   this.setState({ classname: className });
  // };

  content = (
    <aside className="overlay">
      {
        <div className="content">
          {this.topBar()}
          {this.props.children}
        </div>
      }
    </aside>
  );

  topBar() {
    return (
      <div className="navbar clearfix drag">
        {/* <Toggle
          className="navbar-item__toggle"
          title="Show keyboard"
          // onChange={}
          // checked={}
        /> */}
        <div
          className="navbar-item__close"
          onClick={(e) => {
            this.props.onClickCloseHandler();
            // this.handleShow();
          }}>
          <CrossSVG />
        </div>

        <div
          className="navbar-item__minimize"
          // onClick={this.handleMinimize}
        >
          <UnderscoreSVG />
        </div>
        {/* </div> */}
      </div>
    );
  }

  render() {
    return ReactDOM.createPortal(
      <Draggable handle={".drag"}>
        <div
          // onClick={this.handleClick}
          className={this.state.classname}
          title={this.state.classname}>
          {this.content}
        </div>
      </Draggable>,
      document.getElementById("plugin_root")
    );
  }
}
