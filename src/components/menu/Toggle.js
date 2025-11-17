/* eslint-disable no-fallthrough */

import React, { Component } from "react";
class Toggle extends Component {
  handleKeyDown = (event) => {
    // Activate on Enter or Space key
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault(); // Prevent Space from scrolling page
      this.props.onChange();
    }
  };

  render() {
    return (
      <React.Fragment>
        {" "}
        <div className="widget-wrapper">
          <div
            className="switch"
            onClick={this.props.onChange}
            onKeyDown={this.handleKeyDown}
            tabIndex={0}
            role="switch"
            aria-checked={this.props.checked}
            aria-label={this.props.title}>
            <input
              type="checkbox"
              onChange={this.props.onChange}
              checked={this.props.checked}
              tabIndex={-1}
              aria-hidden="true"
              style={{ position: 'absolute', opacity: 0, pointerEvents: 'none' }} />
            <span className="slider round"></span>
          </div>
        </div>
        <div className="title-wrapper">
          <span className="title">{this.props.title}</span>
        </div>
      </React.Fragment>
    );
  }
}

export default Toggle;
