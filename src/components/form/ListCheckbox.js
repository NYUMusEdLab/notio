/* eslint-disable no-fallthrough */

import React, { Component } from "react";
import PropTypes from "prop-types";
import Checkbox from "./Checkbox";
class ListCheckbox extends Component {
  normalizeArray = (arr) => (Array.isArray(arr) ? arr : []);

  arraysEqual = (a, b) => {
    if (a.length !== b.length) {
      return false;
    }
    return a.every((item, index) => item === b[index]);
  };

  getCanonicalOrder = (options = this.props.options, initOptions = this.props.initOptions) => {
    const normalizedOptions = this.normalizeArray(options);
    const normalizedInitOptions = this.normalizeArray(initOptions);
    const extraSelected = normalizedInitOptions.filter(
      (option) => !normalizedOptions.includes(option)
    );
    return [...extraSelected, ...normalizedOptions];
  };

  buildCheckboxState = (options = this.props.options, initOptions = this.props.initOptions) => {
    const normalizedInitOptions = this.normalizeArray(initOptions);
    const selected = new Set(normalizedInitOptions);
    return this.getCanonicalOrder(options, initOptions).reduce((acc, option) => {
      acc[option] = selected.has(option);
      return acc;
    }, {});
  };

  state = {
    checkboxes: this.buildCheckboxState(),
  };

  componentDidUpdate(prevProps) {
    const prevInit = this.normalizeArray(prevProps.initOptions);
    const nextInit = this.normalizeArray(this.props.initOptions);
    const prevOptions = this.normalizeArray(prevProps.options);
    const nextOptions = this.normalizeArray(this.props.options);

    if (!this.arraysEqual(prevInit, nextInit) || !this.arraysEqual(prevOptions, nextOptions)) {
      this.setState({ checkboxes: this.buildCheckboxState(this.props.options, this.props.initOptions) });
    }
  }

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
        const selectedOptions = this.getCanonicalOrder().filter(
          (option) => this.state.checkboxes[option]
        );
        this.props.handleCheckboxChange(selectedOptions);
      }
    );
  };

  createCheckbox = (option) => (
    <Checkbox
      className={`item--${option.replace("#", "sh")}`}
      label={option}
      isSelected={Boolean(this.state.checkboxes[option])}
      onCheckboxChange={this.onChange}
      key={option}
    />
  );

  createCheckboxes = () => this.props.options.map(this.createCheckbox);

  render() {
    return this.createCheckboxes();
  }
}

ListCheckbox.propTypes = {
  options: PropTypes.arrayOf(PropTypes.string).isRequired,
  initOptions: PropTypes.arrayOf(PropTypes.string),
  handleCheckboxChange: PropTypes.func.isRequired,
};

ListCheckbox.defaultProps = {
  initOptions: [],
};

export default ListCheckbox;
