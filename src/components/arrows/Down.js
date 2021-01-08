/* eslint-disable no-fallthrough */

import React, { Component } from "react";
import ArrowDown from "../../assets/img/ArrowDown";

class Down extends Component {

  constructor(props) {
    super(props)
  }
  render() {
    return <span className="arrow-down">
      <ArrowDown />
    </span>
  };
}

export default Down;
