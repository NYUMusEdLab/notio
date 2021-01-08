/* eslint-disable no-fallthrough */

import React, { Component } from "react";
import Checkbox from "./Checkbox";
import _ from "lodash";
class ListCheckbox extends Component {

  state = {
    checkboxes: this.props.options.reduce(
      (options, option) => ({
        ...options,
        [option]: false
      }),
      {}
    )
  };

  constructor(props) {
    super(props)
  }

  onChange = changeEvent => {
    const { name } = changeEvent.target;
    console.log('name', name);
    this.setState(prevState => ({
      checkboxes: {
        ...prevState.checkboxes,
        [name]: !prevState.checkboxes[name]
      }
    }), () => {
      let arrOptions = _.pickBy(this.state.checkboxes, function (value, key) { return value });
      this.props.handleCheckboxChange(Object.keys(arrOptions));
    });
  };

  createCheckbox = option => (
    <Checkbox
      label={option}
      isSelected={this.state.checkboxes[option]}
      onCheckboxChange={this.onChange}
      key={option}
    />
  );

  createCheckboxes = () => this.props.options.map(this.createCheckbox);

  render() {
    return (
      this.createCheckboxes()
    );
  };
}

export default ListCheckbox;
