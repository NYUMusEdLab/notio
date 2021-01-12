/* eslint-disable no-fallthrough */

import React, { Component } from "react";
import ArrowDown from "../arrows/Down";

class SubMenu extends Component {

  constructor(props) {
    super(props);
    this.toggleClass = this.toggleClass.bind(this);

    this.state = {
      active: false,
    };
  }

  toggleClass() {
    const currentState = this.state.active;
    this.setState({ active: !currentState });
  };

  render() {

    var btnClass = this.state.active ? 'selected' : null;
    return <div className="sub-menu">
      <div
        className={`button ${btnClass}`}
        onClick={this.toggleClass}
      >
        {this.props.selected}
        <ArrowDown />
      </div>
      <div>
        <span className={`title ${btnClass}`}>{this.props.title}</span>
      </div>
      <hr />

      <div className={`content ${btnClass}`}>
        {this.props.content}
      </div>
    </div>;
  };
}

export default SubMenu;
