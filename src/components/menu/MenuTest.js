/* eslint-disable no-fallthrough */

import React, { Component } from "react";
import Popup from "reactjs-popup";

import ListCheckbox from "../form/ListCheckbox";
import CustomScaleSelector, { customScaleSteps } from "./CustomScaleSelector";
import SubMenu from "./SubMenu";
import CustomScaleImg from "../../assets/img/CustomScale";

// import Checkbox from "../form/Checkbox";

export const Menu = (props ) => (
  <div className="menu">
    <Popup
      trigger={<div className="menu-item"> Customize scale </div>}
      position="right top"
      on="hover"
      closeOnDocumentClick
      mouseLeaveDelay={300}
      mouseEnterDelay={0}
      contentStyle={{ padding: '0px', border: '1' }}
      arrow={false}
      
    >
      <div className="sub-menu">
      <div className="navbar-item menu-custom-scale">
            <SubMenu
              title="CustomScale"
              selected={"CustomScale"}
              selectedImg=< CustomScaleImg />
              content={
                <CustomScaleSelector //TODO: add initoptions for custom scale, matching current scale, add function handleCustomScale
                  initOptions={props.state.scaleObject} //TODO: fix to customscale creation
                  handleChange={props.handleChangeCustomScale} //TODO: fix this function, it should modifi the customScale in WholeApp
                />
              }
            />
            
          </div>
      {/* <ListCheckbox
          options={customScaleSteps}
          handleCheckboxChange={props.handleCheckboxChange}
          initOptions={props.scaleObject.numbers}
        /> */}
      </div>
    </Popup>
  </div>
);
