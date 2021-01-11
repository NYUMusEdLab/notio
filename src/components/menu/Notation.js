/* eslint-disable no-fallthrough */

import React, { Component } from "react";
import ListCheckbox from "../form/ListCheckbox";

const notations = [
  "Colors",
  "English",
  "German",
  "Romance",
  "Relative",
  "Scale Steps",
  "Chord extensions"
];

class Notation extends Component {

  constructor(props) {
    super(props);
  }


  render() {
    return (
      <ListCheckbox
        options={notations}
        handleCheckboxChange={this.props.handleChange}
        optionState={this.props.notationState}
      />
    );
  };
}

export default Notation;
