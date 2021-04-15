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

  disableAllAccidentals() {
    for (const [index, root] of Object.entries(this.inputRefs)) {
      // root[rootLabel].nextElementSibling.style = "";
      root[accidentalLabel].forEach((v1, v2, set) => {
        v1.disabled = true; // disable radio
        v1.checked = false; // uncheck radio
        // v1.nextElementSibling.style = "";
      });
    }
  }

  enableCurrentAccidentals(currNote) {
    // this.inputRefs[currNote].style = "background-color: red;";
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
      if (ref.name === rootLabel) {
        this.inputRefs[index][rootLabel] = ref;
      }

      if (ref.name === accidentalLabel) {
        this.inputRefs[index][accidentalLabel].add(ref);
      }
    }
  };

  handleChange = (e) => {
    // initState();

    if (e.target.name == rootLabel) {
      console.table("inputRefs", this.inputRefs);
      this.setState({
        root: e.target.value,
        accidental: "",
        // bgColor: e.target.parentNode.dataset.color
        // accidentalChecked: "",
        // accidentalDisabled: true
      });
      this.disableAllAccidentals();
      this.enableCurrentAccidentals(e.target.value);
      // set background color to selected parent radio button (=label)
      console.log("e.target", e.target.nextElementSibling);
      // e.target.nextElementSibling.style.backgroundColor = e.target.nextElementSibling.dataset.color;
    }

    if (e.target.name == accidentalLabel) {
      console.log("checked", e.target.checked);

      // e.target.nextElementSibling.style.backgroundColor = e.target.nextElementSibling.dataset.color;

      this.setState({
        accidental: e.target.value,
        // accidentalChecked: true
      })
    }
  }

  handleClick = (e) => {
    console.log("handleClick", e.target.previousElementSibling.checked);
    if (e.target.previousElementSibling.checked) {
      e.target.previousElementSibling.checked = false;
    }

  }



  componentDidUpdate(prevProps, prevState, snapshot) {
    console.log("root componentDidUpdate");

    if (this.state !== prevState) {
      console.log("this.state.root", this.state.root + this.state.accidental);

      this.props.handleChangeRoot(this.state.root + this.state.accidental);
      console.log("root update");
    }

  }


  styleButton() {
    return {

    }
  }

  render() {
    console.log("root render", this.state.bgColor);


    return (
      <div>
        <Form>
          {rootMenu.map((root, index) => (


            <div>
              {/* dynamic styles with dynamic colors */}
              <style>{`
          .${rootLabel}-label-${root.note}:hover {
            background-color: ${root.color};
          }

          .${rootLabel}-input-${root.note}:checked ~ .form-check-label {
            background-color: ${root.color};
          }
          
          .${accidentalLabel}-input-${root.note}:not([disabled]) ~ .form-check-label:hover {
            background-color: ${root.color};

          }

          .${accidentalLabel}-input-${root.note}:checked ~ .form-check-label {
            background-color: ${root.color};
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
                    />
                    <Form.Check.Label
                      data-color={root.color}
                      className={`${rootLabel}-label-${root.note}`}
                      for={`${rootLabel}-` + root.note}

                    // onMouseOver={this.handleMouseOver}
                    // onMouseOut={this.handleMouseOut}
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
                        disabled={this.state.accidentalDisabled}
                        label={root.accidentals[0]}
                        id={`${accidentalLabel}-` + root.note + `-` + root.accidentals[0]}
                        name={accidentalLabel}
                        onChange={this.handleChange}
                        onClick={this.handleClick}
                        value={root.accidentals[0]}
                        ref={(ref) => this.setRef(root.note, ref)}
                      />
                      <Form.Check.Label
                        className={`${accidentalLabel}-label-${root.note}`}
                        data-color={root.color}
                        onClick={this.handleClick}
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
                        disabled={this.state.accidentalDisabled}
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
                        onClick={this.handleClick}
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
