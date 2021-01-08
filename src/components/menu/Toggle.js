/* eslint-disable no-fallthrough */

import React, { Component } from "react";
class Toggle extends Component {

  constructor(props) {
    super(props)
  }
  render() {
    return <div>
      <div>
        <label className="switch">
          <input type="checkbox" onChange={this.props.onChange} />
          <span className="slider round"></span>
        </label>
      </div>
      <div>
        <span className="label">coucou</span>
      </div>
    </div>;
  };
}

export default Toggle;
