import React from "react";
import { Col } from 'react-bootstrap';
import Form from 'react-bootstrap/Form';

export const Octaves = props => {
  // Keyboard handler for octave labels
  const handleKeyDown = (event, action) => {
    // Allow arrow keys to bubble up for menu navigation
    if (['ArrowDown', 'ArrowUp', 'Home', 'End', 'Escape'].includes(event.key)) {
      return;
    }

    // Activate on Enter or Space
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      props.handleClick(action);
    }
  };

  return (
    <div className="octave">
        <h6>Octave: {props.octave}</h6>
        <Form>
            <div className="row no-gutter">
                <Col xs={3}>
                    <Form.Check>
                        <Form.Check.Input
                            type="radio"
                            id={`octaves-minus`}
                            className={`octaves-input-minus`}
                            name="-"
                            //onChange={this.handleChange}
                            onClick={() => props.handleClick("minus")}
                            value={"-"}
                            data-rootdisplayed="-"
                            tabIndex={-1}
                            aria-hidden="true"
                        />
                        <Form.Check.Label
                            className={`$octaves-label-minus`}
                            role="menuitem"
                            aria-label="Decrease octave"
                            tabIndex={-1}
                            onClick={() => props.handleClick("minus")}
                            onKeyDown={(e) => handleKeyDown(e, "minus")}
                        >
                            -
                        </Form.Check.Label>
                    </Form.Check>
                </Col>
                <Col xs={3}>
                    <Form.Check>
                        <Form.Check.Input
                            type="radio"
                            id={`octaves-plus`}
                            className={`octaves-input-plus`}
                            name="-"
                            //onChange={this.handleChange}
                            onClick={() => props.handleClick("plus")}
                            value={"+"}
                            data-rootdisplayed="+"
                            tabIndex={-1}
                            aria-hidden="true"
                        />
                        <Form.Check.Label
                            className={`$octaves-label-plus`}
                            role="menuitem"
                            aria-label="Increase octave"
                            tabIndex={-1}
                            onClick={() => props.handleClick("plus")}
                            onKeyDown={(e) => handleKeyDown(e, "plus")}
                        >
                            +
                        </Form.Check.Label>
                    </Form.Check>
                </Col>
            </div>
        </Form>
    </div>
  );
};

export default Octaves;