import React from 'react';

const ReactPlayer = React.forwardRef(({ url, controls, playing, onReady, onError, className, width, height, ...props }, ref) => {
  // Call onReady after mount to simulate video ready
  React.useEffect(() => {
    if (onReady) {
      const timer = setTimeout(() => onReady(), 100);
      return () => clearTimeout(timer);
    }
  }, [onReady]);

  return (
    <div
      ref={ref}
      data-testid="react-player"
      data-url={url}
      data-playing={playing ? 'true' : 'false'}
      data-controls={controls ? 'true' : 'false'}
      className={className}
      style={{ width, height }}
      role="application"
      aria-label="Video player"
    >
      <span data-testid="video-url">{url}</span>
      {controls && (
        <div data-testid="video-controls">
          <button data-testid="play-button">Play</button>
          <button data-testid="pause-button">Pause</button>
        </div>
      )}
    </div>
  );
});

ReactPlayer.displayName = 'ReactPlayer';

export default ReactPlayer;