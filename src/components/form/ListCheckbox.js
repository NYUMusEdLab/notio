/* eslint-disable no-fallthrough */

import React, { Component } from "react";
import Checkbox from "./Checkbox";
import _ from "lodash";
class ListCheckbox extends Component {
  state = {
    checkboxes: this.props.checked.reduce(
      (options, option) => ({
        ...options,
        [option]: true,
      }),
      {}
    ),
  };

  onChange = (changeEvent) => {
    const { name } = changeEvent.target;
    this.setState(
      (prevState) => ({
        checkboxes: {
          ...prevState.checkboxes,
          [name]: !prevState.checkboxes[name],
        },
      }),
      () => {
        let arrOptions = _.pickBy(this.state.checkboxes, function (value, key) {
          return value;
        });
        this.props.handleCheckboxChange(Object.keys(arrOptions));
      }
    );
  };

  createCheckbox = (option) => (
    <Checkbox
      label={option}
      isSelected={this.state.checkboxes[option]}
      onCheckboxChange={this.onChange}
      key={option}
    />
  );

  createCheckboxes = () => this.props.options.map(this.createCheckbox);

  render() {
    console.log("********** this.props.checked", this.props.checked);
    return this.createCheckboxes();
  }
}

export default ListCheckbox;
