import React, { Component } from "react";
import { Col } from 'react-bootstrap';
import Form from 'react-bootstrap/Form';
import rootMenu from "../../data/rootMenu";


const rootLabel = "root";
const accidentalLabel = "accidental";

class Root extends Component {


  constructor(props) {
    super(props);
    console.log("this.props.baseNote", this.props.baseNote);
    this.state = {
      root: this.props.baseNote.charAt(0),
      accidental: this.props.baseNote.charAt(1) ? this.props.baseNote.charAt(1) : "",
      accidentalChecked: false,
      accidentalDisabled: true,
      bgColor: "transparent",
      rootState: this.setRootState(this.props.baseNote)

    }
    this.inputRefs = {};

  }

  static getDerivedStateFromProps(props, state) {
    // À chaque fois que l’utilisateur actuel change, on réinitialise
    // tous les aspects de l’état qui sont liés à cet utilisateur.
    // Dans cet exemple simple, il ne s’agit que de l’e-mail.
    console.log("getDerivedStateFromProps", state)

  }


  setRootState(baseNote, value = true) {
    let rootState = {};
    console.log("setRootState baseNote", baseNote);
    rootMenu.map((root, index) => {

      if (!rootState[root.note]) {
        rootState[root.note] = {}
      }

      // Set root - checked to false
      rootState[root.note]['checked'] = false;

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
            if (baseNote.charAt(1) == acc) {
              // Set current root - checked to true
              rootState[root.note][accidentalLabel][acc]['checked'] = value;

              // if (typeof this.state !== 'undefined') {
              //   console.log("this.state['rootState'][root.note][accidentalLabel][acc]['checked']", this.state['rootState'][root.note][accidentalLabel][acc]['checked']);
              // }
            }
          }
        }
      });

    });
    return rootState;
  }

  disableAllAccidentals() {
    for (const [rootIndex, rootObj] of Object.entries(this.inputRefs)) {


      for (const [accindentalIndex, accidentalObj] of Object.entries(rootObj[accidentalLabel])) {
        // accidentalObj.disabled = true;
        // accidentalObj.checked = false;
        console.log("rootIndex", rootIndex, accidentalLabel, accindentalIndex);
        this.inputRefs[rootIndex][accidentalLabel][accindentalIndex].disabled = true;
        // this.inputRefs[rootIndex][accidentalLabel][accindentalIndex].checked = false;
        this.setState({
          accidental: "",
          rootState: this.setRootState(this.state.root, false)
        });
        // rootObj[accidentalLabel].forEach((v1, v2, set) => {
        //   v1.disabled = true; // disable radio
        //   v1.checked = false; // uncheck radio
        // });
      }
    }
  }

  enableCurrentAccidentals(currNote) {
    for (const [accindentalIndex, accidentalObj] of Object.entries(this.inputRefs[currNote][accidentalLabel])) {
      // accidentalObj.disabled = false; // enable radio
      this.inputRefs[currNote][accidentalLabel][accindentalIndex].disabled = false;
      console.log("accidentalObj", this.inputRefs[currNote][accidentalLabel]);
    }

    // this.inputRefs[currNote][accidentalLabel].forEach((v1, v2, set) => {
    //   v1.disabled = false; // enable radio

    // });
  }

  setRef = (ref, root, accidental = null) => {
    if (ref !== null) {
      if (!this.inputRefs[root]) {
        this.inputRefs[root] = {};
        if (!this.inputRefs[root][accidentalLabel]) {
          // this.inputRefs[root][accidentalLabel] = new Set([]);
          this.inputRefs[root][accidentalLabel] = {};
        }
      }

      // add note
      if (ref.name === rootLabel) {
        this.inputRefs[root][rootLabel] = ref;
      }
      console.log("refvalue", ref.value, ref.name);

      // add accidentals
      if (ref.name === accidentalLabel) {
        this.inputRefs[root][accidentalLabel][ref.value] = ref;
      }
      console.log("setRef", this.inputRefs);
    }
  };

  handleChange = (e) => {
    console.log("handle handleChange");

    // initState();
    if (e.target.name === rootLabel) {
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
      let root = e.target.dataset.root;
      let accidentalValue = e.target.value;
      console.table("emilie handleChange", this.inputRefs);
      console.log("emilie handleChange checked", this.inputRefs[root][accidentalLabel][accidentalValue].checked);
      // console.log("emilie handleChange checked", "root", root, "accidentalValue", accidentalValue, e.target.dataset.root);
      // if (this.inputRefs[root][accidentalLabel][accidentalValue].checked) {
      //   this.inputRefs[root][accidentalLabel][accidentalValue].checked = false;
      // }
      this.setState({
        accidental: e.target.value,
        // rootState: this.setRootState(root + accidentalValue)

        // accidentalChecked: true // e.target.checked
      })
    }
  }

  handleClick = (e) => {
    // console.log("checked", this.state.accidentalChecked);
    //   console.log("this.state.accidentalChecked", this.state.accidentalChecked);
    //   // this.setState({
    //   //   accidental: "",
    //   //   // rootState: this.setRootState(e.target.root + accidentalValue)
    //   // })
    console.log("handle handleClick");
    let root = e.target.dataset.root;
    let accidentalValue = e.target.value;

    console.log("handleClick accidentalValue", accidentalValue);
    console.log("handleClick checked", this.inputRefs[root][accidentalLabel][accidentalValue].checked);
    // this.inputRefs[root][accidentalLabel][accidentalValue].checked = !this.inputRefs[root][accidentalLabel][accidentalValue].checked;
    console.log("handleClick state accidental", this.state.accidental);

    console.log("handleClick state check", this.state.rootState[root][accidentalLabel][accidentalValue]);

    if (this.state.accidental !== accidentalValue) {

      // this.inputRefs[root][accidentalLabel][accidentalValue].checked = false;
      this.setState({
        // root: e.target.dataset.root,
        accidental: e.target.value,
        rootState: this.setRootState(root + accidentalValue, true) // + accidentalValue
      });
    } else {

      // this.inputRefs[root][accidentalLabel][accidentalValue].checked = true;
      this.setState({
        // root: e.target.dataset.root,
        accidental: "",
        rootState: this.setRootState(root, false)
      });
    }

    // this.setState({
    //   // accidental: "",
    //   rootState: this.setRootState(root, !this.state.rootState[root][accidentalLabel][accidentalValue])
    // });

    // console.log("handleClick state", this.state.rootState[root][accidentalLabel][accidentalValue]);


  }


  unselectRadio = (e) => {
    let root = e.target.previousElementSibling.dataset.root;
    let accidentalValue = e.target.previousElementSibling.value;
    // console.table("emilie unselectRadio", root + accidentalValue);
    console.log("unselectRadio root", this.state.root);
    console.log("unselectRadio accidental", this.state.accidental);

    // if (this.inputRefs[root][accidentalLabel][accidentalValue].checked) {

    //   this.inputRefs[root][accidentalLabel][accidentalValue].checked = false;
    //   console.log("emilie unselectRadio check", this.inputRefs[root][accidentalLabel][accidentalValue].checked);

    // }

    // this.setState({
    //   // accidental: "",
    //   rootState: this.setRootState(root + accidentalValue, false)
    // })

  }


  componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.state !== prevState) {
      this.props.handleChangeRoot(this.state.root + this.state.accidental); 
    }
  }


  render() {
    const { rootState } = this.state;
    console.log("rootState", rootState);
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
            // background-color: ${rootMenu[0].color};
          }

          .${accidentalLabel}-input-${root.note}:checked ~ .form-check-label {
            // background-color: ${rootMenu[0].color};
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
                      ref={(ref) => this.setRef(ref, root.note)}
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
                        disabled={this.state.root.charAt(0) === root.note ? false : this.state.accidentalDisabled}
                        label={root.accidentals[0]}
                        id={`${accidentalLabel}-` + root.note + `-` + root.accidentals[0]}
                        name={accidentalLabel}
                        onChange={this.handleChange}
                        onClick={this.handleClick}
                        value={root.accidentals[0]}
                        ref={(ref) => this.setRef(ref, root.note, root.accidentals[0],)}
                        data-root={root.note}

                        checked={rootState[root.note][accidentalLabel][root.accidentals[0]]['checked']}
                      />
                      <Form.Check.Label
                        data-root={root.note}
                        className={`${accidentalLabel}-label-${root.note}`}
                        data-color={root.color}
                        // onClick={this.unselectRadio}

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
                        disabled={this.state.root.charAt(0) === root.note ? false : this.state.accidentalDisabled}
                        label={root.accidentals[1]}
                        id={`${accidentalLabel}-` + root.note + `-` + root.accidentals[1]}
                        name={accidentalLabel}
                        onChange={this.handleChange}
                        onClick={this.handleClick}

                        value={root.accidentals[1]}
                        ref={(ref) => this.setRef(ref, root.note, root.accidentals[1])}
                        data-root={root.note}

                        checked={rootState[root.note][accidentalLabel][root.accidentals[1]]['checked']}
                      />
                      <Form.Check.Label
                        className={`${accidentalLabel}-label-${root.note}`}
                        data-color={root.color}
                        // onClick={this.unselectRadio}
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
