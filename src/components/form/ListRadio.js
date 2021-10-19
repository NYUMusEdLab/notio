/* eslint-disable no-fallthrough */

import React, { Component } from "react";
import Radio from "./Radio";

class ListRadio extends Component {
  static defaultProps = {
    setImage: "",
  };

  state = {
    radios: {
      [this.props.initOption]: true,
    },
  };

  constructor(props) {
    super(props);
    props = { ...ListRadio.defaultProps, ...props };
  }

  componentDidMount() {
    // console.log("initOption", this.props.initOption);
    if (this.props.initOption) {
      this.props.setTitle(this.props.initOption);
      if (this.props.displayPicto) this.props.setImage(this.props.initOption);
    }
   
  }

  onChange = (changeEvent) => {

    const { value } = changeEvent.target;
    this.setState(
      (prevState) => ({
        radios: {
          [value]: !prevState.radios[value],
        },
      }),
      () => {
        let option = null;
        for (const [key, value] of Object.entries(this.state.radios)) {
          if (value === true) option = key;
        }
        this.props.handleChange(option);
        this.props.setTitle(option);
        // console.log("this.props.displayPicto", this.props.displayPicto);
        if (this.props.displayPicto) {
          // console.log("ListRadio setImage");

          this.props.setImage(option);
        }
      }
    );
  };

  render() {
    return (
        <div>
            {this.props.data.map((option) => {
                return <Radio
                    nameField={this.props.nameField}
                    label={option.name}
                    isSelected={this.state.radios[option.name]}
                    onRadioChange={this.onChange}
                    key={option.name}
                />
            })}
        </div>
    )
  }
}

export default ListRadio;
