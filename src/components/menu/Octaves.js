import React from "react";
import { Col } from 'react-bootstrap';
import Form from 'react-bootstrap/Form';

export const Octaves = props => {
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
                        />
                        <Form.Check.Label
                            className={`$octaves-label-minus`}
                            htmlFor={`octaves-minus`}
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
                        />
                        <Form.Check.Label
                            className={`$octaves-label-plus`}
                            htmlFor={`octaves-plus`}
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