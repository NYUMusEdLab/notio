import React, { Component } from "react";
import ReactPlayer from "react-player/lazy";
import Form from 'react-bootstrap/Form';
import rootMenu from "../../data/rootMenu";

import VideoSVG from "../../assets/img/Video";
const rootLabel = "root";
const accidentalLabel = "accidental";


class Root extends Component {


  constructor(props) {
    super(props);
    this.initState();
    this.inputRefs = {};

  }
  initState = () => {
    this.state = {
      root:"",
      accidental:"",
      accidentalChecked: false,
      accidentalDisabled: true
    }
  }

  logSetElements(value, key, map) {
    console.log(`SET m[${key}] = ${value}`);

  }

  // disableAllAccidentals() {
  //   // this.inputRefs.map(item => {

  //   //   console.log("item", item);
  //   // })
  //   // quand je clique sur la note en question
  //   // les accidentals courant s'activent uniquement
  //   for (const [note, accidentals] of Object.entries(this.inputRefs)) {
  //     // console.log(`${key}: ${value}`);
      
  //     // this.inputRefs[note].forEach((v1, v2, set) => {
  //     // });
  //     console.log("accidentals", accidentals);
  //     accidentals.forEach(key => console.log("YO", key))
  //     // for (const [index, accidental] of accidentals) {
  //     //   console.log("coucou", index);
 
  //     //   // accidentals.forEach(this.logSetElements);
  //     // }

  //   }

  //   // for (const [note, accidentals] of this.inputRefs) {
  //   //   accidentals.forEach(this.logSetElements);
  //   // }
  //   // console.log("this.inputRefs typeof", this.inputRefs);
  // } 

  disableAllAccidentals() {
    for (const [note, accidentals] of Object.entries(this.inputRefs)) {
      accidentals.forEach((v1, v2, set) => {
        v1.disabled = true;
        v1.checked = false;
      });
    }
  }


  enableCurrentAccidentals(currNote) {
      this.inputRefs[currNote].forEach((v1, v2, set) => {
        v1.disabled = false;

      });
  }


    // for (const [note, accidentals] of Object.entries(this.inputRefs)) {
    //   console.log(`note + acc ${note}: ${accidentals}`);
      
    //   // this.inputRefs[note].forEach((v1, v2, set) => {
    //   // });
    //   console.log("accidentals", accidentals);
    //   accidentals.forEach(key => console.log("YO", key))
    //   // for (const [index, accidental] of accidentals) {
    //   //   console.log("coucou", index);
 
    //   //   // accidentals.forEach(this.logSetElements);
    //   // }

    // }
    
  // }
  
  // for (const [index, accidental] of accidentals)
  // this.inputRefs[note][index]['disabled'] = "disabled";
  
  setRef = (index, ref) => {
    if (!this.inputRefs[index]) {
      this.inputRefs[index] = new Set([]);
    }
    console.log("isarray", Array.isArray(this.inputRefs[index]));
    if (ref !== null) {
      this.inputRefs[index].add(ref);
    }
  };

  handleChange = (e) => {
    // initState();

    if (e.target.name == rootLabel) {
      // console.table("inputRefs", this.inputRefs);
      this.setState({
        root: e.target.value,
        accidental: "",
        // accidentalChecked: "",
        // accidentalDisabled: true
      });
      this.disableAllAccidentals();
      this.enableCurrentAccidentals(e.target.value);
    }

    if (e.target.name == accidentalLabel) {
      
      this.setState({
        accidental: e.target.value,
        // accidentalChecked: true
       })
    }


  }

  shouldComponentUpdate(nextProps, nextState) {
    console.log("root shouldComponentUpdate");
    if (this.state !== nextState) {
      // this.props.handleChangeRoot(this.state.root+this.state.accidental);
      return true;
    }
    return false;
  }


  componentDidUpdate(prevProps, prevState, snapshot) {
    console.log("root componentDidUpdate");

    if (this.state !== prevState) {
      console.log("this.state.root",this.state.root+this.state.accidental);

      this.props.handleChangeRoot(this.state.root+this.state.accidental);
      console.log("root update");
    }

  }

  render() {
    console.log("root render");
    return (
      <div>
        <Form>
            {rootMenu.map((root, index) => (
              <div>
              <Form.Group
                controlId="{`rootMenu` + root.note}"

              >

                <Form.Check 
                type="radio"
                id={`default-radio`}
                label={root.note}
                name={rootLabel}
                onChange={this.handleChange}
                value={root.note}
                />
                {root.accidentals[0] ?
                <Form.Check
                  type="radio"
                  // checked={this.state.accidentalChecked}
                  disabled={this.state.accidentalDisabled}
                  label={root.accidentals[0]}
                  id={`radio-` + root.note + `-` + root.accidentals[0]}
                  name={accidentalLabel}
                  onChange={this.handleChange}
                  value={root.accidentals[0]}
                  ref={(ref) => this.setRef(root.note, ref)} 

                />
              :''}
                {root.accidentals[1] ?
                <Form.Check
                  type="radio"
                  // checked={this.state.accidentalChecked}
                  disabled={this.state.accidentalDisabled}
                  label={root.accidentals[1]}
                  id={`radio-` + root.note + `-` + root.accidentals[1]}
                  name={accidentalLabel}
                  onChange={this.handleChange}
                  value={root.accidentals[1]}
                  ref={(ref) => this.setRef(root.note, ref)} 

                />
                :''}
              </Form.Group>

              </div>
            ))}
        </Form>
      </div>
    );
  }
}

export default Root;
