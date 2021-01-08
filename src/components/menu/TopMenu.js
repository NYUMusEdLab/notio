/* eslint-disable no-fallthrough */

import React, { Component } from "react";
import Toggle from "./Toggle";
import SubMenu from "./SubMenu";
import Notation from "./Notation";

class TopMenu extends Component {

  constructor(props) {
    super(props);
    //notationState = props.notationState;
    console.log("notation", this.props.notationState);
  }


  render() {

    return <div className="navbar">

      {/* Toggle Piano */}
      <div className="navbar-item">
        <Toggle onChange={this.props.togglePiano} />
      </div>

      {/* Toggle Extended */}
      <div className="navbar-item">
        <Toggle onChange={this.props.toggleExtendedKeyboard} />
      </div>

      {/* Notation */}
      <div className="navbar-item">
        <SubMenu content={
          <Notation
            notationState={this.props.notationState}
            handleChange={this.props.handleChangeNotation}
          />
        } />
      </div>



    </div>;
  };
}

export default TopMenu;
