import React, { Component } from "react";
import { Col } from 'react-bootstrap';
import Form from 'react-bootstrap/Form';
import rootMenu from "../../data/rootMenu";


const rootLabel = "root";
const romanceLabel = "romance"
const accidentalLabel = "accidental";

class Root extends Component {


  // root is managed by classical behavior of radio button
  // accidentals can't be manage with classical of radio button
  // because we need them to be unselect, so we use additionnal states

  constructor(props) {
    super(props);
    this.state = {
      root: this.props.baseNote.charAt(0), // English Notation : C, D, E...
      rootDisplayed: this.props.baseNote.charAt(0), // English or Romance (used for display in menu)
      accidental: this.props.baseNote.charAt(1) ? this.props.baseNote.charAt(1) : "",
      accidentalChecked: false,
      accidentalDisabled: true,
      bgColor: "transparent",
      rootState: this.setRootState(this.props.baseNote)
    }
    this.inputRefs = {};

  }

  setRootState(baseNote, value = true) {
    let rootState = {};
    rootMenu.map((root, index) => {

      if (!rootState[root.note]) {
        rootState[root.note] = {}
      }

      // Set root - checked to false
      rootState[root.note]['checked'] = false;

      // init RomanceNotation
      if (!rootState[root.note][romanceLabel]) {
        rootState[root.note][romanceLabel] = {}
      }
      // Set romance - checked to false
      rootState[root.note][romanceLabel]['checked'] = false;

      // add accidentals
      root.accidentals.forEach(function (acc) {

        // Init accidentals objects
        if (!rootState[root.note][accidentalLabel]) {
          rootState[root.note][accidentalLabel] = {};
        }
        // Init sub accidentals objects
        if (!rootState[root.note][accidentalLabel][acc]) {
          rootState[root.note][accidentalLabel][acc] = {};
        }

        // Set accidentals - checked to false
        rootState[root.note][accidentalLabel][acc]['checked'] = false;

        // If current root
        if (baseNote.charAt(0) === root.note) {

          // Set current root - checked to true
          rootState[root.note]['checked'] = value;

          if (baseNote.charAt(1)) {
            if (baseNote.charAt(1) === acc) {
              // Set current root - checked to true
              rootState[root.note][accidentalLabel][acc]['checked'] = value;
            }
          }
        }
      });

      return null;
    });
    return rootState;
  }

  disableAllAccidentals() {
    for (const [rootIndex, rootObj] of Object.entries(this.inputRefs)) {
      for (const [accindentalIndex] of Object.entries(rootObj[accidentalLabel])) {
        this.inputRefs[rootIndex][accidentalLabel][accindentalIndex].disabled = true;
      }
    }

    // uncheck them
    this.setState({
      accidental: "",
      rootState: this.setRootState(this.state.root, false)
    });
  }

  // setRef = (ref, root, accidental = null) => {
  //   if (ref !== null) {
  //     if (!this.inputRefs[root]) {
  //       this.inputRefs[root] = {};
  //       if (!this.inputRefs[root][accidentalLabel]) {
  //         this.inputRefs[root][accidentalLabel] = {};
  //       }
  //     }

  //     // add note
  //     if (ref.name === rootLabel) {
  //       this.inputRefs[root][rootLabel] = ref;
  //     }

  //     // add accidentals
  //     if (ref.name === accidentalLabel) {
  //       this.inputRefs[root][accidentalLabel][ref.value] = ref;
  //     }
  //   }
  // };

  // Set states of current root and accidental
  handleChange = (e) => {

    if (e.target.name === rootLabel) {

      // reinit accidentals if root not the same from previous
      if (e.target.value !== this.state.root) {
        this.disableAllAccidentals();
        this.setState({
          accidental: "",
        });
      }

      this.setState({
        root: e.target.value,
        rootDisplayed: e.target.dataset.rootdisplayed,
      });
    }

    if (e.target.name === accidentalLabel) {
      this.setState({
        accidental: e.target.value,
      })
    }
  }

  handleClickRoot = (e)=>{
    let root = e.target.value;
 
     if (this.state.root !== root) {
       this.setState({
         accidental: "",
         rootState: this.setRootState(root, true)
       });
     } else {
       this.setState({
         accidental: "",
         rootState: this.setRootState(root, false)
       });
     }
 
  }
  // Handle (un)select of accidentals radio buttons
  handleClick = (e) => {
    let root = e.target.dataset.root;
    let accidentalValue = e.target.value;

    if (this.state.accidental !== accidentalValue) {
      this.setState({
        accidental: e.target.value,
        rootState: this.setRootState(root + accidentalValue, true)
      });
    } else {
      this.setState({
        accidental: "",
        rootState: this.setRootState(root, false)
      });
    }
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.state !== prevState) {
      this.props.handleChangeRoot(this.state.root + this.state.accidental);
      this.props.handleChangeTitle(this.state.rootDisplayed + this.state.accidental);
    }
  }

  render() {
    const { rootState } = this.state;

    return (
      <div>
        <Form>
          {rootMenu.map((root, index) => (

            < div >
              {/* dynamic styles with dynamic colors */}
              <style> {`
          .${rootLabel}-label-${root.note}:hover,
          .${rootLabel}-label-${root.note_romance}:hover {
            background-color: ${rootMenu[0].color};
            // we should use "root.color" to get color by root
            // but it isn't asked for the Notio tool
          }

          .${rootLabel}-input-${root.note}:checked ~ .form-check-label,
          .${rootLabel}-input-${root.note_romance}:checked ~ .form-check-label {
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
                <Col lg={3}>
                  <Form.Check
                  >
                    <Form.Check.Input
                      type="radio"
                      id={`${rootLabel}-` + root.note}
                      className={`${rootLabel}-input-${root.note}`}
                      //label={root.note}
                      name={rootLabel}
                      onChange={this.handleChange}
                      onClick={this.handleClickRoot}
                      value={root.note}
                      data-rootdisplayed={root.note}

                      //ref={(ref) => this.setRef(ref, root.note)}
                      checked={this.state.rootDisplayed === root.note ? true : false}
                      //checked={this.state.rootState[root.note]['checked']}

                    />
                    <Form.Check.Label
                      data-color={root.color}
                      className={`${rootLabel}-label-${root.note}`}
                      htmlFor={`${rootLabel}-` + root.note}
                    >
                      {root.note}
                    </Form.Check.Label>
                  </Form.Check>
                </Col>
                {root.note_romance ?
                  <Col lg={3}>
                    <Form.Check
                    >
                      <Form.Check.Input
                        type="radio"
                        id={`${rootLabel}-` + root.note_romance}
                        className={`${rootLabel}-input-${root.note_romance}`}
                        //label={root.note_romance}
                        name={rootLabel}
                        onChange={this.handleChange}
                        value={root.note}
                        data-rootdisplayed={root.note_romance}
                        //ref={(ref) => this.setRef(ref, root.note_romance)}
                        checked={this.state.rootDisplayed === root.note_romance ? true : false}
                        //checked={rootState[root.note][romanceLabel]['checked']}

                      />
                      <Form.Check.Label
                        data-color={root.color}
                        className={`${rootLabel}-label-${root.note_romance}`}
                        htmlFor={`${rootLabel}-` + root.note_romance}
                      >
                        {root.note_romance}
                      </Form.Check.Label>
                    </Form.Check>
                  </Col>
                  : ""}
                <Col lg={3}>
                  {root.accidentals[0] ?
                    <Form.Check>
                      <Form.Check.Input
                        type="radio"
                        className={`${accidentalLabel}-input-${root.note}`}
                        disabled={this.state.root.charAt(0) === root.note ? false : this.state.accidentalDisabled}
                        //label={root.accidentals[0]}
                        id={`${accidentalLabel}-` + root.note + `-` + root.accidentals[0]}
                        name={accidentalLabel}
                        onChange={this.handleChange}
                        onClick={this.handleClick}
                        value={root.accidentals[0]}
                        //ref={(ref) => this.setRef(ref, root.note, root.accidentals[0],)}
                        data-root={root.note}
                        checked={rootState[root.note][accidentalLabel][root.accidentals[0]]['checked']}
                      />
                      <Form.Check.Label
                        data-root={root.note}
                        className={`${accidentalLabel}-label-${root.note}`}
                        data-color={root.color}
                        htmlFor={`${accidentalLabel}-` + root.note + `-` + root.accidentals[0]}
                      >
                        {root.accidentals[0]}
                      </Form.Check.Label>
                    </Form.Check>
                    : ''}
                </Col>
                <Col lg={3}>
                  {root.accidentals[1] ?
                    <Form.Check>
                      <Form.Check.Input
                        type="radio"
                        className={`${accidentalLabel}-input-${root.note}`}
                        disabled={this.state.root.charAt(0) === root.note ? false : this.state.accidentalDisabled}
                        //label={root.accidentals[1]}
                        id={`${accidentalLabel}-` + root.note + `-` + root.accidentals[1]}
                        name={accidentalLabel}
                        onChange={this.handleChange}
                        onClick={this.handleClick}
                        value={root.accidentals[1]}
                        //ref={(ref) => this.setRef(ref, root.note, root.accidentals[1])}
                        data-root={root.note}
                        checked={rootState[root.note][accidentalLabel][root.accidentals[1]]['checked']}
                      />
                      <Form.Check.Label
                        className={`${accidentalLabel}-label-${root.note}`}
                        data-color={root.color}
                        htmlFor={`${accidentalLabel}-` + root.note + `-` + root.accidentals[1]}
                      >
                        {root.accidentals[1]}
                      </Form.Check.Label>
                    </Form.Check>
                    : ''}
                </Col>
              </Form.Row>
            </div>
          ))
          }
        </Form>
      </div >
    );
  }
}

export default Root;
