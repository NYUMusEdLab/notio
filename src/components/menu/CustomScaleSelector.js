/* eslint-disable no-fallthrough */

import React, { Component } from "react";
import ListCheckbox from "../form/ListCheckbox";

export const customScaleSteps = [
  "1",
  "b2",
  "2",
  "#2",
  "b3",
  "3",
  "4",
  "#4",
  "b5",
  "5",
  "#5",
  "b6",
  "6",
  "7",
  "major7"
];

class CustomScaleSelector extends Component {

  constructor(props) {
    super(props);
    this.state = {value: ''};
    this.state = {scaleSteps: ''}
    this.handleAddScaleSteps = this.handleAddScaleSteps.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleAddScaleSteps(event){
    this.setState({})
  }
  handleChange(event) {
    this.setState({value: event.target.value});
  }

  handleSubmit(event) {
    alert('A new custom scale was submitted: ' + this.state.value);

    event.preventDefault();
  }

  render() {
    return (
      <div>
      <ListCheckbox
        options={customScaleSteps}
        handleCheckboxChange={this.props.handleChange}
        initOptions={this.props.initOptions}
      />
      <form onSubmit={this.handleSubmit}>
        <label>
          Name:
          <input type="text" value={this.state.value} onChange={this.handleChange} />
        </label>
        <input type="submit" value="Submit" />
      </form>
      </div>
    );
  }
}

export default CustomScaleSelector;
