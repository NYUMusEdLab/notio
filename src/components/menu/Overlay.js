import React, { Component, Fragment } from "react";
import { Button } from "react-bootstrap";
import ReactDOM from "react-dom";
import Draggable from "react-draggable";
import UnderscoreSVG from "../../assets/img/Underscore";
import CrossSVG from "../../assets/img/Cross";

export default class Overlay extends Component {
  state = {
    minimized: false,
    hidden: false,
  };

  content = (<Fragment>{this.props.children}</Fragment>);

  grabBar() {
    return <div className="overlay__grabbar drag "></div>;
  }

  navBarButtons() {
    return (
      <div className="overlay__header__buttonContainer">
        <Button
          className="overlay__header__buttonContainer__button--minimize"
          onClick={(e) => {
            this.handleMinimize();
          }}>
          <UnderscoreSVG />
        </Button>

        <Button
          className="overlay__header__buttonContainer__button--close"
          onClick={(e) => {
            this.handleShow();
            // this.props.onClickCloseHandler(e);
          }}>
          <CrossSVG />
        </Button>
      </div>
    );
  }

  handleShow = () => {
    this.setState({ hidden: !this.state.hidden });
    console.log("hide Not Implemented");
  };

  handleMinimize = () => {
    this.setState({ minimized: !this.state.minimized });
  };

  render() {
    return ReactDOM.createPortal(
      <Draggable handle={".drag"}>
        <div
          className={`overlay${this.state.minimized ? " minimized" : ""}${
            this.state.hidden ? " hide" : ""
          }`}>
          <header className="overlay__header">
            {this.grabBar()}
            {this.navBarButtons()}
          </header>
          <div className="content">{this.content}</div>
        </div>
      </Draggable>,
      document.getElementById("plugin_root")
    );
  }
}
