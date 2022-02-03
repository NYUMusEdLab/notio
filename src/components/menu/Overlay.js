import React, { Component } from 'react';
import ReactDOM from 'react-dom';

 const Overlay = props => {
    const content = <aside className="overlay">{props.children}</aside>;
    return ReactDOM.createPortal(content, document.getElementById('overlay-root'))

}

export default Overlay;
