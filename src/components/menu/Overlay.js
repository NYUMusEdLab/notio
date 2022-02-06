import React, { Component } from 'react';
import { Button } from 'react-bootstrap';
import ReactDOM from 'react-dom';
import Draggable from "react-draggable"

export default class Overlay extends Component {
  
  state = {
    classname : 'overlay nodrag',
    draggable : false
  }
  
    handleClick = (event) => {
      const draggable = !this.state.draggable
      const className = draggable ? 'overlay drag' : 'overlay nodrag'
  
      this.setState({draggable : draggable})
      this.setState({ classname: className})
    }
  
    
    content = <aside className='overlay'  >{<div className="content">{this.props.children}</div>}</aside>;
  
  
    render() {
      // const { classname } = this.state;
      // return ReactDOM.createPortal(<Draggable handle={'.drag'}><Button onClick={this.handleClick} className={this.state.classname} title={this.state.classname}>{this.state.classname+this.state.draggable}</Button></Draggable>, document.getElementById('overlay_root'))

      return ReactDOM.createPortal(<Draggable handle={'.drag'} >
        <Button onClick={this.handleClick} className={this.state.classname} title={this.state.classname}>{this.content}</Button>
        </Draggable>, document.getElementById('overlay_root'))

    }
  }   
  //  handleMousePosition(event){
  //      const temp_pos = {x:event.clientX, y:event.clientY}
  //   //    this.saveCursorPosition(temp_pos.x,temp_pos.y)
  //      document.documentElement.style.setProperty('--x', temp_pos.x + 'px');
  //      document.documentElement.style.setProperty('--y', temp_pos.y + 'px');
       
  //   //    console.log(window.innerWidth)
    
  //  }

  //  handleDragStopped(event){
  //   this.setState({pos : {x:event.clientX, y:event.clientY}})
  //  }
    

  //   saveCursorPosition = function(x, y) {
  //      this.pos.x = (x / window.innerWidth).toFixed(2);
  //      this.pos.y = (y / window.innerHeight).toFixed(2);
  //   //    document.documentElement.style.setProperty('--x', this.pos.x);
  //   //    document.documentElement.style.setProperty('--y', this.pos.y);
  //  }
   

//  const Overlay = (props) => {
//     const content = <aside className="overlay">{<div className="content">{props.children}</div>}</aside>;
//     return ReactDOM.createPortal(content, document.getElementById('overlay_root'))

// }

// export default Overlay;
