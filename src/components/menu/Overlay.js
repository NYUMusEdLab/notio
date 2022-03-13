import React, { Component } from "react";
import { Button } from "react-bootstrap";
import ReactDOM from "react-dom";
import Draggable from "react-draggable";
import UnderscoreSVG from "../../assets/img/Underscore";
import CrossSVG from "../../assets/img/Cross";

export default class Overlay extends Component {
  state = {
    classname: "overlay nodrag",
    draggable: false,
    minimized: false,
  };

  content = (
    <aside className="overlay">
      {
        <div className="content">
          {/* {this.topBar()} */}
          {this.props.children}
        </div>
      }
    </aside>
  );

  topBar() {
    return (
      <div>
        {/* <div className="overlay navbar clearfix drag "> */}
        {/* <Button
          className="navbar-item__close"
          onClick={(e) => {
            // this.props.onClickCloseHandler();
            this.handleShow();
          }}>
          <CrossSVG />
        </Button> */}

        <Button
          className="overlay navbar--button__minimize"
          onClick={(e) => {
            // this.props.onClickCloseHandler();
            this.handleMinimize();
          }}>
          <UnderscoreSVG />
        </Button>
        {/* </div> */}
      </div>
    );
  }

  handleShow = () => {
    this.setState({ minimized: !this.state.minimized });
    console.log("Minimize Not Implemented");
  };

  handleMinimize = () => {
    this.setState({ minimized: !this.state.minimized });
    console.log("Minimize Not Implemented");
  };

  render() {
    return ReactDOM.createPortal(
      <Draggable handle={".drag"}>
        <div
          // onClick={this.handleClick}
          className={this.state.classname}
          title={this.state.classname}>
          {/* {this.topBar()} */}
          <aside className={`overlay${this.state.minimized ? "__minimized" : ""}`}>
            {this.topBar()}
            <div className={`content${this.state.minimized ? "__minimized" : ""}`}>
              {this.props.children}
            </div>
          </aside>
          {/* {this.topBar()}
          {this.content} */}
        </div>
      </Draggable>,
      document.getElementById("plugin_root")
    );
  }
}
