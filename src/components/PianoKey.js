import React, { Component } from "react";
import PropTypes from "prop-types";

class PianoKey extends Component {
    constructor(props) {
        super(props);
        this.keyRef = React.createRef();

        this.state = {
            clicked: false
        };
    }
    touchDown = e => {
        if (e.cancelable) {
            e.preventDefault();
        }
        this.setState({ clicked: true });
        if (this.props.isOn) {
            this.playNote(this.props.note);
        }
    };
    touchUp = e => {
        if (e.cancelable) {
            e.preventDefault(); // prevent default calling of mouse event after touch event
        }
        this.setState({ clicked: false });
        if (this.props.isOn) {
            this.releaseNote(this.props.note);
        }
    };

    clickedMouse = e => {
        //console.log('mouse clicked', e);
        this.setState({ clicked: true });
        if (this.props.isOn) {
            this.playNote(this.props.note);
        }
    };
    unClickedMouse = e => {
        this.setState({ clicked: false });
        if (this.props.isOn) {
            this.releaseNote(this.props.note);
        }
    };

    mouseEnter = e => {
        if (this.props.isOn && this.props.isMouseDown === true) {
            this.setState({ clicked: true });
            this.playNote(this.props.note);
        }
    };

    mouseLeave = e => {
        if (this.props.isOn && this.props.isMouseDown === true) {
            this.setState({ clicked: false });
            this.releaseNote(this.props.note);
        }
    };

    playNote = note => {
        this.props.synth.triggerAttack(note);
    };

    releaseNote = note => {
        this.props.synth.triggerRelease(note);
    };

    updateDimensions = () => {
        const myWidth = this.keyRef.current.clientWidth;
        this.setState({ myWidth: myWidth });
    };

    componentDidUpdate(prevProps) {
        if (
            this.props.showOffNotes !== prevProps.showOffNotes ||
            this.props.noteName !== prevProps.noteName
        ) {
            this.updateDimensions();
        }
    }

    componentDidMount() {
        this.keyRef.current.addEventListener("mouseenter", this.mouseEnter);
        this.keyRef.current.addEventListener("mouseleave", this.mouseLeave);
        //run it the first time
        this.updateDimensions();
        // and then run it on resize
        window.addEventListener("resize", this.updateDimensions);
    }

    componentWillUnmount() {
        // Make sure to remove the DOM listener when the component is unmounted.
        this.keyRef.current.removeEventListener("mouseenter", this.mouseEnter);
        this.keyRef.current.removeEventListener("mouseleave", this.mouseLeave);
        window.removeEventListener("resize", this.updateDimensions);
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        return {
            isMouseDown: nextProps.isMouseDown
        };
    }

    render() {
        const {
            keyColor,
            index,
            root
        } = this.props;
        
        let daNote;
        let match = /[0-9]/.exec(this.props.note);
        if (match) {
          daNote =
            this.props.note.substr(0, match.index).toLowerCase().replace('#','s'); // replace # with s to use in div class
        }
        return (
            <div
                ref={this.keyRef}
                className={`piano-key ${keyColor} ${daNote}`}
                onMouseUp={this.unClickedMouse}
                onMouseDown={this.clickedMouse}
                onTouchStart={this.touchDown}
                onTouchEnd={this.touchUp}
                onMouseEnter={this.mouseEnter}
                onMouseLeave={this.mouseLeave}
            >
                {keyColor === 'black' ? (
                    <div className="whiteContainer"><div className="whiteBottomA"></div>
                    <div className="whiteBottomB"></div></div>
                    ) : null
                }
               {index === 0 ? root : null}
            </div>
        )
    }
}


PianoKey.propTypes = {
    note: PropTypes.string,
    isOn: PropTypes.bool,
    keyColor: PropTypes.string,
    index: PropTypes.number,
    root: PropTypes.string
};

export default PianoKey;