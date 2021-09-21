/* eslint-disable no-fallthrough */

import React, { Component } from "react";
import Popup from "reactjs-popup";

// import ListCheckbox from "../form/ListCheckbox";
// import CustomScaleSelector, { customScaleSteps } from "./CustomScaleSelector";

import CustomScaleSelector from "./CustomScaleSelector";
import SubMenu from "./SubMenu";
import CustomScaleImg from "../../assets/img/CustomScale";

// import Checkbox from "../form/Checkbox";

export class DropdownCustomScaleMenu extends Component {
  
  render() {
    return(
    <div 
    className={this.props.menuTextClassName}>
      <Popup
        trigger={<div className="label-wrapper">Customise</div>}
        position="left top"
        on="hover"
        repositionOnResize = {true}
        offsetY={-300}
        closeOnEscape ={true}
        closeOnDocumentClick
        mouseLeaveDelay={300}
        mouseEnterDelay={0}
        contentStyle={{ padding: '2px', border: 'none' }}
        arrow={false}
        
      >
        <div className="sub-menu">
            <div className="navbar-item menu-custom-scale" >
              <SubMenu
                className = {this.props.menuTextClassName}
                active={true}
                title=""
                selected={"CustomScale"}
                selectedImg= <CustomScaleImg />
                content={
                  <CustomScaleSelector //TODO: add initoptions for custom scale, matching current scale, add function handleCustomScale
                    initOptions={this.props.state.scaleObject} //TODO: fix to customscale creation
                    handleChange={this.props.handleChangeCustomScale} //TODO: fix this function, it should modifi the customScale in WholeApp
                  />
                }
              />
              
            </div>
          </div>
      </Popup>
    </div>
  );
  }
}
