import React, { Component } from "react";
import { Col } from 'react-bootstrap';
import Form from 'react-bootstrap/Form';
import rootMenu from "../../data/rootMenu";


const rootLabel = "root";
const accidentalLabel = "accidental";

class Root extends Component {


  constructor(props) {
    super(props);
    this.state = {
      root: this.props.baseNote,
      accidental: "",
      accidentalChecked: false,
      accidentalDisabled: true,
      bgColor: "transparent"
    }
    this.inputRefs = {};
  }

  disableAllAccidentals() {
    for (const [index, root] of Object.entries(this.inputRefs)) {
      console.log(index);
      root[accidentalLabel].forEach((v1, v2, set) => {
        v1.disabled = true; // disable radio
        v1.checked = false; // uncheck radio
      });
    }
  }

  enableCurrentAccidentals(currNote) {
    this.inputRefs[currNote][accidentalLabel].forEach((v1, v2, set) => {
      v1.disabled = false; // enable radio

    });
  }

  setRef = (index, ref) => {
    if (ref !== null) {
      if (!this.inputRefs[index]) {
        this.inputRefs[index] = {};
        if (!this.inputRefs[index][accidentalLabel]) {
          this.inputRefs[index][accidentalLabel] = new Set([]);
        }
      }

      // add note
      if (ref.name === rootLabel) {
        this.inputRefs[index][rootLabel] = ref;
      }

      // add accidentals
      if (ref.name === accidentalLabel) {
        this.inputRefs[index][accidentalLabel].add(ref);
      }
    }
  };

  handleChange = (e) => {
    // initState();

    if (e.target.name === rootLabel) {
      console.table("inputRefs", this.inputRefs);
      this.setState({
        root: e.target.value,
        accidental: "",
        // accidentalChecked: "",
        // accidentalDisabled: true
      });
      this.disableAllAccidentals();
      this.enableCurrentAccidentals(e.target.value);
    }

    if (e.target.name === accidentalLabel) {
      this.setState({
        accidental: e.target.value,
        // accidentalChecked: true
      })
    }
  }

  handleClick = (e) => {
    if (e.target.previousElementSibling.checked) {
      e.target.previousElementSibling.checked = false;
    }
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.state !== prevState) {
      this.props.handleChangeRoot(this.state.root + this.state.accidental);
    }
  }


  render() {
    return (
      <div>
        <Form>
          {rootMenu.map((root, index) => (


            <div>
              {/* dynamic styles with dynamic colors */}
              <style>{`
          .${rootLabel}-label-${root.note}:hover {
            background-color: ${rootMenu[0].color};
            // we should use "root.color" to get color by root
            // but it isn't asked for the Notio tool
          }

          .${rootLabel}-input-${root.note}:checked ~ .form-check-label {
            background-color: ${rootMenu[0].color};
          }

          .${accidentalLabel}-input-${root.note}:not([disabled]) ~ .form-check-label:hover {
            background-color: ${rootMenu[0].color};
          }

          .${accidentalLabel}-input-${root.note}:checked ~ .form-check-label {
            background-color: ${rootMenu[0].color};
          }
          `}</style>
              <Form.Row>
                <Col lg={4}>
                  <Form.Check
                  >
                    <Form.Check.Input
                      type="radio"
                      id={`${rootLabel}-` + root.note}
                      className={`${rootLabel}-input-${root.note}`}
                      label={root.note}
                      name={rootLabel}
                      onChange={this.handleChange}
                      value={root.note}
                      ref={(ref) => this.setRef(root.note, ref)}
                      checked={this.state.root.charAt(0) === root.note ? true : false}
                    />
                    <Form.Check.Label
                      data-color={root.color}
                      className={`${rootLabel}-label-${root.note}`}
                      for={`${rootLabel}-` + root.note}
                    >
                      {root.note}
                    </Form.Check.Label>
                  </Form.Check>
                </Col>
                <Col lg={4}>
                  {root.accidentals[0] ?
                    <Form.Check>
                      <Form.Check.Input
                        type="radio"
                        className={`${accidentalLabel}-input-${root.note}`}
                        // checked={this.state.accidentalChecked}
                        disabled={this.state.root.charAt(0) === root.note ? false : this.state.accidentalDisabled}
                        label={root.accidentals[0]}
                        id={`${accidentalLabel}-` + root.note + `-` + root.accidentals[0]}
                        name={accidentalLabel}
                        onChange={this.handleChange}
                        // onClick={this.handleClick}
                        value={root.accidentals[0]}
                        ref={(ref) => this.setRef(root.note, ref)}
                      />
                      <Form.Check.Label
                        className={`${accidentalLabel}-label-${root.note}`}
                        data-color={root.color}
                        // onClick={this.handleClick}
                        for={`${accidentalLabel}-` + root.note + `-` + root.accidentals[0]}
                      >
                        {root.accidentals[0]}

                      </Form.Check.Label>


                    </Form.Check>
                    : ''}
                </Col>
                <Col lg={4}>
                  {root.accidentals[1] ?
                    <Form.Check>
                      <Form.Check.Input
                        type="radio"
                        className={`${accidentalLabel}-input-${root.note}`}
                        // checked={this.state.accidentalChecked}
                        disabled={this.state.root.charAt(0) === root.note ? false : this.state.accidentalDisabled}
                        label={root.accidentals[1]}
                        id={`${accidentalLabel}-` + root.note + `-` + root.accidentals[1]}
                        name={accidentalLabel}
                        onChange={this.handleChange}

                        value={root.accidentals[1]}
                        ref={(ref) => this.setRef(root.note, ref)}
                      />
                      <Form.Check.Label
                        className={`${accidentalLabel}-label-${root.note}`}
                        data-color={root.color}
                        // onClick={this.handleClick}
                        for={`${accidentalLabel}-` + root.note + `-` + root.accidentals[1]}
                      >
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
