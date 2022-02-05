import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Draggable from 'react-draggable'
export default class Overlay extends Component {
  
    constructor(props) {
      super(props)
      const pos = { x : 0, y : 0 }

    //   document.addEventListener('ondrag', e => { this.handleMousePosition(e.clientX, e.clientY); })
    }
   content = <aside className="overlay"  >{<div className="content">{this.props.children}</div>}</aside>;

   handleMousePosition(event){
       const temp_pos = {x:event.clientX, y:event.clientY}
    //    this.saveCursorPosition(temp_pos.x,temp_pos.y)
    if(temp_pos != this.pos){
       document.documentElement.style.setProperty('--x', temp_pos.x + 'px');
       document.documentElement.style.setProperty('--y', temp_pos.y + 'px');
       this.pos = temp_pos}
       
    //    console.log(window.innerWidth)
    
   }
    

    saveCursorPosition = function(x, y) {
       this.pos.x = (x / window.innerWidth).toFixed(2);
       this.pos.y = (y / window.innerHeight).toFixed(2);
    //    document.documentElement.style.setProperty('--x', this.pos.x);
    //    document.documentElement.style.setProperty('--y', this.pos.y);
   }
   
   

  render() {
    return ReactDOM.createPortal(this.content, document.getElementById('overlay_root'))
  }
}



//  const Overlay = (props) => {
//     const content = <aside className="overlay">{<div className="content">{props.children}</div>}</aside>;
//     return ReactDOM.createPortal(content, document.getElementById('overlay_root'))

// }

// export default Overlay;
