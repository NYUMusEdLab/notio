import React, { Component } from "react";

class LoadingScreen extends Component {
  randomColor = () => {
    return (
      "rgb(" +
      Math.random() * 255 +
      "," +
      Math.random() * 255 +
      "," +
      Math.random() * 255 +
      ")"
    );
  };
  componentDidMount() {
    const loadingScreen = document.getElementById("loading-screen");
    const animEls = loadingScreen.getElementsByTagName("li");
    for (var i = 0; i < animEls.length; i++) {
      animEls[i].style.webkitAnimation =
        "music .5s " + i + "00ms  ease-in-out both infinite";
    }

    loadingScreen.style.backgroundColor = this.randomColor();
  }

  render() {
    return (
      <div id="loading-screen">
        <ul className="animation">
          <li>&#9833;</li>
          <li>&#9834;</li>
          <li>&#9835;</li>
          <li>&#9836;</li>
          <li>&#9833;</li>
          <li>&#9834;</li>
          <li>&#9835;</li>
          <li>&#9836;</li>
        </ul>
        <span>Loading</span>
      </div>
    );
  }
}

export default LoadingScreen;
