
import React, { Component } from "react";
import Popup from 'reactjs-popup';
// import 'reactjs-popup/dist/index.css';

import VideoSVG from '../../assets/img/Video';


const components = {
  'video': <VideoSVG />,

};
class CircledButton extends Component {

  render() {
    return <div>
      <Popup trigger={<div class="circledButton">
        {components[this.props.label]}
      </div>} position="bottom center">
        <div><iframe id="ytplayer" type="text/html" width="300" height="168.75"
          src="https://www.youtube.com/embed/?listType=playlist&list=PL7imp2jxKd0Bcx4cjR3gEMirkAzd84G_C&enablejsapi=1&loop=1&modestbranding=1&color=white"
          frameborder="0" allowfullscreen></iframe></div>
      </Popup>
    </div>
  };
}

export default CircledButton;
