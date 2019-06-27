import React from "react";

const Select = props => {
  //console.log('selectEls', props.selectEls);

  const dropDownEls = props.selectEls.map(function(value, index) {
    if (props.valueToExtract) {
      value = value[props.valueToExtract];
    }

    return (
      <option key={index} value={value}>
        {value}
      </option>
    );
    //console.log( 'selectName', props.selectName, 'value', value['name'] );
  });

  return (
    <div className={`${props.selectName}-select`}>
      <div>{props.selectName}</div>
      <div>
        {props.multiple ? (
          <select
            value={props.value ? props.value : null}
            multiple={true}
            id={props.selectName}
            onChange={e => {
              const options = e.target.options;
              let arrOptions = [];
              for (let i = 0; i < options.length; i++) {
                if (options[i].selected) {
                  arrOptions.push(options[i].value);
                }
              }
              props.handleSelect(arrOptions);
            }}
          >
            {dropDownEls}
          </select>
        ) : (
          <select
            value={props.value ? props.value : ""}
            id={props.selectName}
            onChange={e => props.handleSelect(e.target.value)}
          >
            {dropDownEls}
          </select>
        )}
      </div>
    </div>
  );
};

export default Select;
