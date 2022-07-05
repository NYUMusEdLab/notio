/* eslint-disable no-fallthrough */

import React, { Component } from "react";
import ListCheckbox from "../form/ListCheckbox";

export const notations = [
  "Chord extensions",
  "Scale Steps",
  "Relative",
  "Romance",
  "German",
  "English",
];

class Notation extends Component {
  render() {
    return (
      <div className="items-list">
        <ListCheckbox
          options={notations}
          handleCheckboxChange={this.props.handleChange}
          initOptions={this.props.initOptions}
        />
      </div>
    );
  }
}

export default Notation;
