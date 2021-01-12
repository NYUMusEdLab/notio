/* eslint-disable no-fallthrough */

import React, { Component } from "react";
import Radio from "./Radio";
import _ from "lodash";
class ListRadio extends Component {

  state = {
    radios: this.props.options.reduce(
      (options, option) => ({
        ...options,
        [option.name]: option.default ? true : false
      }),
      {}
    )
  };

  constructor(props) {
    super(props)
  }

  componentDidMount() {
    console.log("componentDidMount", this.state);
    for (const [key, value] of Object.entries(this.state.radios)) {
      if (value === true)
        this.props.setTitle(key);

    }
  }

  onChange = changeEvent => {
    const { value } = changeEvent.target;
    this.setState(prevState => ({
      radios: {
        [value]: !prevState.radios[value]
      }
    }), () => {
      let option = null;
      for (const [key, value] of Object.entries(this.state.radios)) {
        if (value === true)
          option = key;
      }
      this.props.handleChange(option);
      this.props.setTitle(option);

    });
  };

  createRadio = option => (
    <Radio
      nameField={this.props.nameField}
      label={option.name}
      isSelected={this.state.radios[option.name]}
      onRadioChange={this.onChange}
      key={option.name}
    />
  );

  createRadios = () => this.props.options.map(this.createRadio);

  render() {
    return (
      this.createRadios()
    );
  };
}

export default ListRadio;
