/* eslint-disable no-fallthrough */

import React, { Component } from "react";
import ListCheckbox from "../form/ListCheckbox";

export const notations = [
  "English",
  "German",
  "Romance",
  "Relative",
  "Scale_Steps",
  "Chord_extensions",
];

class Notation extends Component {
  render() {
    return (
      <ListCheckbox
        options={notations}
        handleCheckboxChange={this.props.handleChange}
        initOptions={this.props.initOptions}
      />
    );
  }
}

export default Notation;
