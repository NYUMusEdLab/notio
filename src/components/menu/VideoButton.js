import React, { Component } from 'react';
import ReactPlayer from 'react-player';
import VideoSVG from "../../assets/img/Video";
import Overlay from './Overlay';
import VideoTutorial from './VideoTutorial';
const components = {
    video: <VideoSVG />,
  };


export default class VideoButton extends Component {
    static defaultProps = {
        onClickMenuHandler: () => { },
        onClickCloseHandler: () => { },
        hasBG: false,
        hasMinize: false,
        draggable: false,
      };
      state = {
        minimized: false,
        show: this.props.active ? true : false,
      };

    handleShow = () => {
        this.setState({ show: !this.state.show });
      };

  render() {
    return (
      <React.Fragment>
        <div className="button">
          <div
            className="circledButton"
            onClick={(e) => {
              this.props.onClickMenuHandler();
              this.handleShow();
            }}>
            {components[this.props.label]}
          </div>
          <div className="title--wrapper">
            <span className="title" title={this.props.title}>
              {this.props.title}
            </span>
          </div>
        </div>
        {this.state.show && <Overlay>
          <ReactPlayer
                    ref={this.ref}
                    className="react-player"
                    playing={true}
                    width="100%"
                    height="100%"
                    url={this.props.videoUrl}
                    // onReady={this.playerOnReady}
                    /> 
                    </Overlay>}
        
      </React.Fragment>
    );
  }
}
