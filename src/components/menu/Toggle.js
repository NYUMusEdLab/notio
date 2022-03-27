/* eslint-disable no-fallthrough */

import React, { Component } from "react";
class Toggle extends Component {
  render() {
    return (
      <div>
        <div className="widget-wrapper">
          <label className="switch">
            <input type="checkbox" onChange={this.props.onChange} checked={this.props.checked} />
            <span className="slider round"></span>
          </label>
        </div>
        <div className="title--wrapper">
          <span className="title">{this.props.title}</span>
        </div>
      </div>
    );
  }
}

export default Toggle;
