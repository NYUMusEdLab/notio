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

    let isActive = this.state.active ? 'selected' : null;
    return <div className="sub-menu">
      <div
        className={`button ${isActive}`}
        onClick={this.toggleClass}
      >
        {this.props.selected}
        <ArrowDown />
      </div>
      <div>
        <span className={`title ${isActive}`}>{this.props.title}</span>
      </div>
      <hr className={isActive} />

      <div className={`content ${isActive}`}>
        {this.props.content}
      </div>
    </div>;
  };
}

export default SubMenu;
