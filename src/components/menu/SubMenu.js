/* eslint-disable no-fallthrough */

import React, { Component } from "react";
import ArrowDown from "../arrows/Down";
import TrebleClef from "../../assets/img/TrebleClef";
import BassClef from "../../assets/img/BassClef";
import TenorClef from "../../assets/img/TenorClef";
import AltoClef from "../../assets/img/AltoClef";
import NoNoteClef from "../../assets/img/NoNoteClef";

let ClefComponent = TrebleClef;

class SubMenu extends Component {
  constructor(props) {
    super(props);
    this.toggleClass = this.toggleClass.bind(this);
    const initactive = props.active ? true : false;
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
      case "hide notes":
        ClefComponent = NoNoteClef;
        break;
      default:
        ClefComponent = TrebleClef;
    }
  }

  render() {
    let isActive = this.state.active ? "--selected" : null;
    this.selectPictoClef();
    return (
      <React.Fragment>
        <div className="sub-menu">
          <div className={`sub-menu__content${isActive?isActive:" null"}`}>{this.props.content}</div>
          <div className={`sub-menu__button${isActive?isActive:" null"}`} onClick={this.toggleClass}>
            <div className="sub-menu__button-title">
              {this.props.selectedImg}

              {this.props.displayClef ? <ClefComponent /> : ""}
              {this.props.displayClef ? (
                <span className="sub-menu__item--selected">{this.props.selected}</span>
              ) : (
                <span className="sub-menu__title--selected">{this.props.selected}</span>
              )}
            </div>
            <ArrowDown />
            {/* <div className={`content ${isActive?isActive:" null"}`}>{this.props.content}</div> */}
          </div>
        </div>
        <div className="title-wrapper">
          <span className={`title${isActive?isActive:" null"}`} title={this.props.title}>
            {this.props.title}
          </span>
        </div>
        {/* <hr className={isActive} /> */}
      </React.Fragment>
    );
  }
}

export default SubMenu;
