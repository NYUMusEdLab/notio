/* eslint-disable no-fallthrough */

import React, { Component } from "react";
import ArrowDown from "../arrows/Down";

import TrebleClef from "../../assets/img/TrebleClef";
import BassClef from "../../assets/img/BassClef";
import TenorClef from "../../assets/img/TenorClef";
import AltoClef from "../../assets/img/AltoClef";


// import _ from "lodash";

// const Clefs = {
//   Treble: TrebleClef,
// };
let ClefComponent = TrebleClef;

// let clefPath = '';
class SubMenu extends Component {
  constructor(props) {
    super(props);
    this.toggleClass = this.toggleClass.bind(this);
    const initactive = props.active ? true : false
    this.state = {
      active: initactive,
    };
  }

  toggleClass() {
    const currentState = this.state.active;
    this.setState({ active: !currentState });
  }

  componentDidMount() {
    if (this.props.displayClef) {
      this.selectPictoClef();
    }
  }

  // componentDidUpdate(prevProps) {
  //   if (this.props.selected !== prevProps.selected) {
  //     if (this.props.displayClef) {
  //       this.selectPictoClef();
  //     }
  //   }
  // }


  selectPictoClef() {
    // Better solution to load dyncamically components
    // but not working on github pages
    //ClefComponent = loadable(props => import(`../../assets/img/${imgClass}Clef`));
    // in render : <ClefComponent clef={this.props.selected} />
    // console.log("selectPictoClef this.props.selected", this.props.selected);
    // dirty solution :
    switch (this.props.selected) {
      case "treble":
        ClefComponent = TrebleClef;
        break;
      case "bass":
        ClefComponent = BassClef;
        break;
      case "tenor":
        ClefComponent = TenorClef;
        break;
      case "alto":
        ClefComponent = AltoClef;
        break;
      default:
        ClefComponent = TrebleClef;
    }
  }



  render() {
    let isActive = this.state.active ? "selected" : null;
    this.selectPictoClef();
    return (
      <div className="sub-menu">
        <div className={`button ${isActive}`} onClick={this.toggleClass}>
          {this.props.selectedImg}

          {this.props.displayClef ? <ClefComponent /> : ""}
          {this.props.displayClef ? (
            <span className="sub-menu__item__selected">
              {this.props.selected}
            </span>
          ) : (
            <span class="sub-menu--title--selected">{this.props.selected}</span>
          )}
          <ArrowDown />
        </div>
        <div className="title--wrapper">
          <span className={`title ${isActive}`}>{this.props.title}</span>
        </div>
        {/* <hr className={isActive} /> */}

        <div className={`content ${isActive}`}>{this.props.content}</div>
      </div>
    );
  }
}

export default SubMenu;
