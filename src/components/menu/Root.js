import React, { Component } from "react";
import ReactPlayer from "react-player/lazy";
import { Row, Col } from 'react-bootstrap';
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
      root: "",
      accidental: "",
      accidentalChecked: false,
      accidentalDisabled: true,
      bgColor: "transparent"
    }
  }

  logSetElements(value, key, map) {
    console.log(`SET m[${key}] = ${value}`);

  }

  disableAllAccidentals() {
    for (const [note, accidentals] of Object.entries(this.inputRefs)) {
      accidentals.forEach((v1, v2, set) => {
        v1.disabled = true;
        v1.checked = false;
      });
    }
  }


  enableCurrentAccidentals(currNote) {
    this.inputRefs[currNote].style = "background-color: red;";
    this.inputRefs[currNote].forEach((v1, v2, set) => {
      v1.disabled = false;

    });
  }

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
        bgColor: "red"
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

  // shouldComponentUpdate(nextProps, nextState) {
  //   console.log("root shouldComponentUpdate");
  //   if (this.state !== nextState) {
  //     // this.props.handleChangeRoot(this.state.root+this.state.accidental);
  //     return true;
  //   }
  //   return false;
  // }


  componentDidUpdate(prevProps, prevState, snapshot) {
    console.log("root componentDidUpdate");

    if (this.state !== prevState) {
      console.log("this.state.root", this.state.root + this.state.accidental);

      this.props.handleChangeRoot(this.state.root + this.state.accidental);
      console.log("root update");
    }

  }

  render() {
    console.log("root render", this.state.bgColor);
    return (
      <div>
        <Form>
          {rootMenu.map((root, index) => (
            <div>
              <Form.Row>
                <Col lg={4}>
                  <Form.Check
                  >
                    <Form.Check.Label
                      style={{ 'background-color': root.note == this.state.root ? 'red' : 'transparent' }}
                    >
                      <Form.Check.Input
                        type="radio"
                        class={rootLabel}
                        label={root.note}
                        name={rootLabel}
                        onChange={this.handleChange}
                        value={root.note}
                      />
                      {root.note}
                    </Form.Check.Label>
                  </Form.Check>
                </Col>
                <Col lg={4}>
                  {root.accidentals[0] ?
                    <Form.Check>
                      <Form.Check.Label>
                        <Form.Check.Input
                          type="radio"
                          class={accidentalLabel}
                          // checked={this.state.accidentalChecked}
                          disabled={this.state.accidentalDisabled}
                          label={root.accidentals[0]}
                          id={`radio-` + root.note + `-` + root.accidentals[0]}
                          name={accidentalLabel}
                          onChange={this.handleChange}
                          value={root.accidentals[0]}
                          ref={(ref) => this.setRef(root.note, ref)}
                        />
                        {root.accidentals[0]}
                      </Form.Check.Label>
                    </Form.Check>
                    : ''}
                </Col>
                <Col lg={4}>
                  {root.accidentals[1] ?
                    <Form.Check>
                      <Form.Check.Label>
                        <Form.Check.Input
                          type="radio"
                          class={accidentalLabel}
                          // checked={this.state.accidentalChecked}
                          disabled={this.state.accidentalDisabled}
                          label={root.accidentals[1]}
                          id={`radio-` + root.note + `-` + root.accidentals[1]}
                          name={accidentalLabel}
                          onChange={this.handleChange}
                          value={root.accidentals[1]}
                          ref={(ref) => this.setRef(root.note, ref)}
                        />
                        {root.accidentals[1]}
                      </Form.Check.Label>
                    </Form.Check>
                    : ''}
                </Col>
              </Form.Row>
            </div>
          ))}
        </Form>
      </div >
    );
  }
}

export default Root;
