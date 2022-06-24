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
//TODO: block b5 if #4 is selected , do this for all similar tones
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
    let sortedNumbers = this.state.numbers;
    sortedNumbers.sort(this.scaleNumberSort);
    const scaleSteps = sortedNumbers.map(this.scalenumberToStep);
    // alert("A new custom scale was submitted: " + this.state.name + sortedNumbers);
    this.props.handleChange(this.state.name, scaleSteps, sortedNumbers);
    event.preventDefault();
  }

  scalenumberToStep = (n) => {
    const indexes = {
      1: 0,
      b2: 1,
      2: 2,
      "#2": 3,
      b3: 3,
      3: 4,
      4: 5,
      "#4": 6,
      b5: 6,
      5: 7,
      "#5": 8,
      b6: 8,
      6: 9,
      7: 10,
      "△7": 11,
    };
    return indexes[n];
  };
  scaleNumberSort = (a, b) => {
    const indexes = {
      1: 0,
      b2: 1,
      2: 2,
      "#2": 3,
      b3: 3,
      3: 4,
      4: 5,
      "#4": 6,
      b5: 6,
      5: 7,
      "#5": 8,
      b6: 8,
      6: 9,
      7: 10,
      "△7": 11,
    };

    if (indexes[a] < indexes[b]) {
      return -1;
    } else if (indexes[a] >= indexes[b]) {
      return 1;
    }
  };

  //Consider this, it may be a bad idea, then just delete it, that will then display the currently selected scale name
  componentDidMount() {
    this.setState({ name: "Custom" });
  }

  render() {
    return (
      <React.Fragment>
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
      </React.Fragment>
    );
  }
}

export default CustomScaleSelector;
