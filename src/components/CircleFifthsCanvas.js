import React, { Component } from 'react';
import rootNote from '../data/rootNote';

class CircleFifthsCanvas extends Component {
	constructor(props) {
		super(props);
	}

  drawNotes = (ctx, radius) => {
  let ang;
  let num =0;
  ctx.font = radius*0.15 + "px arial";
  ctx.textBaseline="middle";
  ctx.textAlign="center";
  rootNote.map( function( note , index){
    if(note.note !== 'Gb'){
      ang = num * Math.PI / 6;
      ctx.rotate(ang);
      ctx.translate(0, -radius*0.85);
      ctx.rotate(-ang);
      ctx.fillText(note.note, 0, 0);
      ctx.rotate(ang);
      ctx.translate(0, radius*0.85);
      ctx.rotate(-ang);
      num++;
    } else if(note.note === 'Gb'){
      //ctx.fillText(note.note, 0, 0);
    }
  });
}

   componentDidMount() {
    const canvas = this.refs.canvas;
    const ctx = canvas.getContext("2d");
    var radius = canvas.height / 2;
    ctx.translate(radius, radius);
    radius = radius * 0.90;
    ctx.fillText('Root Note', 0, 0);
    this.drawNotes(ctx, radius);
  }

  render(){
    return (
     <div>
        <canvas ref="canvas" width={350} height={350} />
      </div>
    );

  }
}

export default CircleFifthsCanvas;