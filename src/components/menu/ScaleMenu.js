// import React, { Component } from "react";
// import ListCheckbox from "../form/ListCheckbox";

// const ScaleMenu = () => {
// return(<div
//             className="navbar__item menu-scale"
//             data-tip="custom"
//             data-for="scaleTooltip"
//             data-event="null"
//             ref={(ref) => this.props.setRef(ref, "scale")}>
//             <SubMenu
//               title="Scale"
//               selected={this.state.titleNotation}
//               content={
//                 <div className="items-list">
//                   <ListRadio
//                     nameField="scale"
//                     data={this.props.state.scaleList}
//                     handleChange={this.props.handleChangeScale}
//                     setTitle={this.setScaleTitle}
//                     initOption={this.props.state.scale}
//                   />
//                   <DropdownCustomScaleMenu
//                     menuTextClassName="form-radio"
//                     state={this.props.state}
//                     scaleObject={this.props.state.scaleObject} //TODO: fix to customscale creation
//                     handleChangeCustomScale={this.props.handleChangeCustomScale}
//                     onClickCloseHandler={this.handleShow} //TODO: fix this function, it should modifi the customScale in WholeApp
//                   />
//                 </div>
//               }
//             />
//           </div>);
// };
// export default ScaleMenu;
