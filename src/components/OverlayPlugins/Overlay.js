/**
 * Overlay Component
 *
 * Draggable modal overlay component that uses Context API for position management.
 * Converted from class component to functional component (T045).
 *
 * Props:
 * - modalName: string (required) - Identifies which modal this is (video, help, share)
 * - children: React.ReactNode - Content to display in overlay
 * - close: function - Callback to close the overlay
 *
 * Tasks: T045-T049
 */

import React, { useState, useEffect, useRef, Fragment } from "react";
import { Button } from "react-bootstrap";
import ReactDOM from "react-dom";
import Draggable from "react-draggable";
import UnderscoreSVG from "../../assets/img/Underscore";
import CrossSVG from "../../assets/img/Cross";
import { useModalPosition } from "../../hooks/useModalPosition";

function Overlay({ modalName, children, close }) {
  // Local UI state
  const [minimized, setMinimized] = useState(false);
  const [hidden, setHidden] = useState(false);

  // Get position from context (T046)
  const { positions, updatePosition } = useModalPosition();
  const position = positions[modalName] || { x: 0, y: 0 };

  // Refs
  const overlayRef = useRef(null);

  // Handle drag stop - update context (T048)
  const handleDragStop = (e, data) => {
    updatePosition(modalName, { x: data.x, y: data.y });
  };

  // Handle keyboard events (Escape key)
  const handleKeyDown = (event) => {
    if (event.key === 'Escape') {
      event.preventDefault();
      event.stopPropagation();
      close();
    }
  };

  // Lifecycle effects
  useEffect(() => {
    // Add Escape key listener when overlay mounts
    document.addEventListener('keydown', handleKeyDown);

    // Focus the overlay so Escape key works immediately
    if (overlayRef.current) {
      overlayRef.current.focus();
    }

    // Cleanup: Remove Escape key listener when overlay unmounts
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Handle minimize toggle
  const handleMinimize = () => {
    setHidden(prev => !prev);
    setMinimized(prev => !prev);
  };

  // Grab bar component
  const grabBar = () => {
    return <div className="overlay__grabbar drag "></div>;
  };

  // Navigation bar buttons
  const navBarButtons = () => {
    return (
      <div className="overlay__header__buttonContainer">
        <Button
          className="overlay__header__buttonContainer__button--minimize"
          onClick={handleMinimize}
          aria-label="Minimize window">
          <UnderscoreSVG />
        </Button>

        <Button
          className="overlay__header__buttonContainer__button--close"
          onClick={close}
          aria-label="Close window">
          <CrossSVG />
        </Button>
      </div>
    );
  };

  const content = <Fragment>{children}</Fragment>;

  return ReactDOM.createPortal(
    <Draggable
      handle={".drag"}
      position={position}
      onStop={handleDragStop}>
      <div
        ref={overlayRef}
        className={`overlay${minimized ? " minimized" : ""}${
          hidden ? " hide" : ""
        }`}
        tabIndex={-1}
        role="dialog"
        aria-modal="true">
        <header className="overlay__header">
          {grabBar()}
          {navBarButtons()}
        </header>
        <div className="content">{content}</div>
      </div>
    </Draggable>,
    document.getElementById("plugin_root")
  );
}

export default Overlay;
