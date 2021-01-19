/* eslint-disable no-fallthrough */

import React, { Component } from "react";
import Radio from "./Radio";
class ListRadio extends Component {
  defaultProps = {
    setImage: 'coucou',
  }


  state = {
    radios: this.props.data.reduce(
      (options, option) => ({
        ...options,
        [option.name]: option.default ? true : false
      }),
      {}
    )
  };

  constructor(props) {
    super(props)
    props = { ...this.defaultProps, ...props }

  }

  componentDidMount() {
    for (const [key, value] of Object.entries(this.props.data)) {
      if (value['default'] === true) {
        console.log(key);
        this.props.setTitle(value['name']);
        // for clef men
        if (value['svg'])
          this.props.setImage(value['svg']);
      }
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
      if (this.props.displayPicto)
        this.props.setImage(option);
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

  createRadios = () => this.props.data.map(this.createRadio);

  render() {
    return (
      this.createRadios()
    );
  };
}

export default ListRadio;
