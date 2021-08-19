/* eslint-disable no-fallthrough */

import React, { Component } from "react";
import ListCheckbox from "../form/ListCheckbox";
// import Checkbox from "../form/Checkbox";

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
  "△7",
];

class CustomScaleSelector extends Component {
  constructor(props) {
    super(props);
    this.state = { scaleSteps: "" };
    this.state = {
      name: props.initOptions.name,
      steps: props.initOptions.steps,
      numbers: props.initOptions.numbers,
    };
    this.handleAddScaleSteps = this.handleAddScaleSteps.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleAddScaleSteps(event) {
    this.setState({ numbers: event });
    //alert("!!!!!!!!added number: " + this.state.steps);
  }
  handleChange(event) {
    this.setState({ name: event.target.value });
  }

  handleSubmit(event) {
    alert("A new custom scale was submitted: " + this.state.name + this.state.numbers);
    this.props.handleChange(this.state.name, this.state.steps, this.state.numbers);
    event.preventDefault();
  }

  componentDidMount() {}

  render() {
    return (
      <div>
        {/* <Checkbox label={1} isSelected={true} onCheckboxChange={null} key={1} /> */}
        <ListCheckbox
          options={customScaleSteps}
          handleCheckboxChange={this.handleAddScaleSteps}
          initOptions={this.props.initOptions.numbers}
        />
        <form onSubmit={this.handleSubmit}>
          <label>
            Name:
            <input type="text" value={this.state.name} onChange={this.handleChange} />
          </label>
          <input type="submit" value="Submit" />
        </form>
      </div>
    );
  }
}

export default CustomScaleSelector;
