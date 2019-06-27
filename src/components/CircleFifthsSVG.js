import React, { Component } from "react";
import CircleFifthsImg from "../assets/img/CircleFifthsImg";
import rootNote from "../data/rootNote";

class CircleFifthsSVG extends Component {
  removeActiveClasses = e => {
    const selectRootEls = Array.from(
      document.querySelectorAll(".circleFifths .note")
    );
    //var elems = selectRootEls.querySelectorAll(".active");
    [].forEach.call(selectRootEls, function(el) {
      el.classList.remove("active");
    });
  };
  manageRootSelect = () => {
    /**manage selection of Root from CircleFifthsSVG */
    const selectRoot = Array.from(
      document.querySelectorAll(".circleFifths .note")
    );

    const that = this;
    selectRoot.map(function(rootNode, index) {
      let noteName = rootNode.textContent;
      if (noteName.includes("♭")) {
        noteName = noteName.substr(0, 1) + "b";
      }
      //either 1. handleClick
      rootNode.addEventListener("click", e => {
        that.removeActiveClasses(e);

        e.path[1].classList.add("active");
        that.props.handleChange(noteName);
      });
      //or 2. add current selected one on first load
      if (noteName === that.props.rootNote) {
        rootNode.classList.add("active");
      }
    });
  };

  componentDidMount() {
    this.manageRootSelect();
  }

  render() {
    return <CircleFifthsImg />;
  }
}

export default CircleFifthsSVG;
