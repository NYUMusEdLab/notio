import React, { Component } from "react";
import { render } from "react-dom";
import { BrowserRouter, Route } from "react-router-dom";
import WholeApp from "./WholeApp";

class App extends Component {
  render() {
    return (
      <BrowserRouter basename={window.location.pathname || ""}>
        <Route exact path="/" component={WholeApp} />
        <Route path="/shared/:sessionId" component={WholeApp} />
      </BrowserRouter>
    );
  }
}

render(<App />, document.getElementById("root"));
