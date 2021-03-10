import React, { Component } from "react";
import { render } from "react-dom";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import WholeApp from "./WholeApp";

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <Switch>
          <Route path="/shared/:sessionId" component={WholeApp} />
          <Route exact path="/" component={WholeApp} />
        </Switch>
      </BrowserRouter>
    );
  }
}

render(<App />, document.getElementById("root"));
