/* eslint-disable no-fallthrough */

import React, { Component } from "react";
import ArrowDown from "../../assets/img/ArrowDown";

class Down extends Component {

  constructor(props) {
    super(props)
  }
  render() {
    return <div className="arrow-down">
      <ArrowDown />
    </div>
  };
}

export default Down;
