import React, { Component } from 'react';
import ReactDOM from 'react-dom';

 const Overlay = (props) => {
    const content = <aside className="overlay">{<div className="content">{props.children}</div>}</aside>;
    return ReactDOM.createPortal(content, document.getElementById('overlay_root'))

}

export default Overlay;
