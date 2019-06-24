import React, { Component } from "react";
import { render } from "react-dom";
import { BrowserRouter as Router, Route } from "react-router-dom";
import WholeApp from "./WholeApp";

class App extends Component {
  render() {
    return (
      <Router>
        <Route exact path="/" component={WholeApp} />
        <Route path="/shared/:sessionId" component={WholeApp} />
      </Router>
    );
  }
}

render(<App />, document.getElementById("root"));
