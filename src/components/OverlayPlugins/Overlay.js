import React, { Component, Fragment } from "react";
import { Button } from "react-bootstrap";
import ReactDOM from "react-dom";
import Draggable from "react-draggable";
import UnderscoreSVG from "../../assets/img/Underscore";
import CrossSVG from "../../assets/img/Cross";

export default class Overlay extends Component {
  constructor(props) {
    super(props);
    this.state = {
      minimized: false,
      hidden: false,
    };
    this.overlayRef = React.createRef();
  }

  content = (<Fragment>{this.props.children}</Fragment>);

  componentDidMount() {
    // Add Escape key listener when overlay mounts
    document.addEventListener('keydown', this.handleKeyDown);

    // Focus the overlay so Escape key works immediately
    if (this.overlayRef.current) {
      this.overlayRef.current.focus();
    }
  }

  componentWillUnmount() {
    // Remove Escape key listener when overlay unmounts
    document.removeEventListener('keydown', this.handleKeyDown);
  }

  handleKeyDown = (event) => {
    // Close overlay on Escape key
    if (event.key === 'Escape') {
      event.preventDefault();
      event.stopPropagation();
      this.props.close();
    }
  };

  grabBar() {
    return <div className="overlay__grabbar drag "></div>;
  }

  navBarButtons() {
    return (
      <div className="overlay__header__buttonContainer">
        <Button
          className="overlay__header__buttonContainer__button--minimize"
          onClick={(e) => {
            // this.handleMakeSmaller();
            this.handleMinimize();
          }}>
          <UnderscoreSVG />
        </Button>

        <Button
          className="overlay__header__buttonContainer__button--close"
          onClick={(e) => {
            this.props.close();
          }}>
          <CrossSVG />
        </Button>
      </div>
    );
  }

  handleMinimize = () => {
    this.setState((prevState) => ({
      hidden: !prevState.hidden,
      minimized: !prevState.hidden,
    }));
  };

  handleMakeSmaller = () => {
    this.setState((prevState) => ({
      minimized: !prevState.minimized || prevState.hidden,
      hidden: false,
    }));
  };

  render() {
    return ReactDOM.createPortal(
      <Draggable handle={".drag"}>
        <div
          ref={this.overlayRef}
          className={`overlay${this.state.minimized ? " minimized" : ""}${
            this.state.hidden ? " hide" : ""
          }`}
          tabIndex={-1}
          role="dialog"
          aria-modal="true">
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
