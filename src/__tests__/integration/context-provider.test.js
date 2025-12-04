/**
 * Integration Tests: ModalPositionContext Provider
 *
 * Tests the ModalPositionContext provider and consumer behavior.
 * Verifies that position state is correctly shared across component tree.
 *
 * Coverage Target: ModalPositionContext provider functionality
 * Performance Target: < 3 seconds per test
 *
 * Related Tasks: T057-T060
 * Related Contract: specs/005-url-storage-completion/contracts/context-api.md
 */

import React, { useContext } from 'react';
import { render, screen, act } from '@testing-library/react';
import { ModalPositionContext, ModalPositionProvider } from '../../contexts/ModalPositionContext';

describe('ModalPositionContext Provider Integration', () => {
  // Helper component that consumes context
  const TestConsumer = ({ onContextReceived }) => {
    const context = useContext(ModalPositionContext);

    // Call callback with context value for assertions
    React.useEffect(() => {
      if (onContextReceived) {
        onContextReceived(context);
      }
    }, [context, onContextReceived]);

    return (
      <div data-testid="consumer">
        <div data-testid="video-x">{context.positions.video.x ?? 'null'}</div>
        <div data-testid="video-y">{context.positions.video.y ?? 'null'}</div>
        <div data-testid="help-x">{context.positions.help.x ?? 'null'}</div>
        <div data-testid="help-y">{context.positions.help.y ?? 'null'}</div>
        <div data-testid="share-x">{context.positions.share.x ?? 'null'}</div>
        <div data-testid="share-y">{context.positions.share.y ?? 'null'}</div>
        <button
          data-testid="update-button"
          onClick={() => context.updatePosition('video', { x: 100, y: 150 })}>
          Update Video Position
        </button>
      </div>
    );
  };

  describe('Provider rendering and default values (T058)', () => {
    test('provider renders without errors', () => {
      const mockValue = {
        positions: {
          video: { x: null, y: null },
          help: { x: null, y: null },
          share: { x: null, y: null }
        },
        updatePosition: jest.fn()
      };

      const { container } = render(
        <ModalPositionProvider value={mockValue}>
          <div data-testid="child">Test Child</div>
        </ModalPositionProvider>
      );

      expect(screen.getByTestId('child')).toBeInTheDocument();
      expect(container).toBeTruthy();
    });

    test('provider provides correct default values to consumers', () => {
      const mockValue = {
        positions: {
          video: { x: null, y: null },
          help: { x: null, y: null },
          share: { x: null, y: null }
        },
        updatePosition: jest.fn()
      };

      render(
        <ModalPositionProvider value={mockValue}>
          <TestConsumer />
        </ModalPositionProvider>
      );

      expect(screen.getByTestId('video-x')).toHaveTextContent('null');
      expect(screen.getByTestId('video-y')).toHaveTextContent('null');
      expect(screen.getByTestId('help-x')).toHaveTextContent('null');
      expect(screen.getByTestId('help-y')).toHaveTextContent('null');
      expect(screen.getByTestId('share-x')).toHaveTextContent('null');
      expect(screen.getByTestId('share-y')).toHaveTextContent('null');
    });

    test('provider provides custom position values to consumers', () => {
      const mockValue = {
        positions: {
          video: { x: 123, y: 456 },
          help: { x: 789, y: 101 },
          share: { x: 112, y: 314 }
        },
        updatePosition: jest.fn()
      };

      render(
        <ModalPositionProvider value={mockValue}>
          <TestConsumer />
        </ModalPositionProvider>
      );

      expect(screen.getByTestId('video-x')).toHaveTextContent('123');
      expect(screen.getByTestId('video-y')).toHaveTextContent('456');
      expect(screen.getByTestId('help-x')).toHaveTextContent('789');
      expect(screen.getByTestId('help-y')).toHaveTextContent('101');
      expect(screen.getByTestId('share-x')).toHaveTextContent('112');
      expect(screen.getByTestId('share-y')).toHaveTextContent('314');
    });
  });

  describe('Consumer reading positions (T059)', () => {
    test('consumer can read positions from context', () => {
      let capturedContext = null;

      const mockValue = {
        positions: {
          video: { x: 100, y: 150 },
          help: { x: 200, y: 250 },
          share: { x: 300, y: 350 }
        },
        updatePosition: jest.fn()
      };

      render(
        <ModalPositionProvider value={mockValue}>
          <TestConsumer onContextReceived={(ctx) => { capturedContext = ctx; }} />
        </ModalPositionProvider>
      );

      expect(capturedContext).not.toBeNull();
      expect(capturedContext.positions.video).toEqual({ x: 100, y: 150 });
      expect(capturedContext.positions.help).toEqual({ x: 200, y: 250 });
      expect(capturedContext.positions.share).toEqual({ x: 300, y: 350 });
    });

    test('multiple consumers receive same context value', () => {
      const mockValue = {
        positions: {
          video: { x: 555, y: 666 },
          help: { x: null, y: null },
          share: { x: null, y: null }
        },
        updatePosition: jest.fn()
      };

      const Consumer1 = () => {
        const { positions } = useContext(ModalPositionContext);
        return <div data-testid="consumer1-x">{positions.video.x}</div>;
      };

      const Consumer2 = () => {
        const { positions } = useContext(ModalPositionContext);
        return <div data-testid="consumer2-x">{positions.video.x}</div>;
      };

      render(
        <ModalPositionProvider value={mockValue}>
          <Consumer1 />
          <Consumer2 />
        </ModalPositionProvider>
      );

      expect(screen.getByTestId('consumer1-x')).toHaveTextContent('555');
      expect(screen.getByTestId('consumer2-x')).toHaveTextContent('555');
    });
  });

  describe('Consumer calling updatePosition (T060)', () => {
    test('consumer can call updatePosition', () => {
      const mockUpdatePosition = jest.fn();
      const mockValue = {
        positions: {
          video: { x: 0, y: 0 },
          help: { x: 0, y: 0 },
          share: { x: 0, y: 0 }
        },
        updatePosition: mockUpdatePosition
      };

      render(
        <ModalPositionProvider value={mockValue}>
          <TestConsumer />
        </ModalPositionProvider>
      );

      const updateButton = screen.getByTestId('update-button');

      act(() => {
        updateButton.click();
      });

      expect(mockUpdatePosition).toHaveBeenCalledTimes(1);
      expect(mockUpdatePosition).toHaveBeenCalledWith('video', { x: 100, y: 150 });
    });

    test('updatePosition is called with correct modal name and position', () => {
      const mockUpdatePosition = jest.fn();
      const mockValue = {
        positions: {
          video: { x: 0, y: 0 },
          help: { x: 0, y: 0 },
          share: { x: 0, y: 0 }
        },
        updatePosition: mockUpdatePosition
      };

      const ConsumerWithMultipleUpdates = () => {
        const { updatePosition } = useContext(ModalPositionContext);
        return (
          <>
            <button
              data-testid="update-video"
              onClick={() => updatePosition('video', { x: 10, y: 20 })}>
              Update Video
            </button>
            <button
              data-testid="update-help"
              onClick={() => updatePosition('help', { x: 30, y: 40 })}>
              Update Help
            </button>
            <button
              data-testid="update-share"
              onClick={() => updatePosition('share', { x: 50, y: 60 })}>
              Update Share
            </button>
          </>
        );
      };

      render(
        <ModalPositionProvider value={mockValue}>
          <ConsumerWithMultipleUpdates />
        </ModalPositionProvider>
      );

      act(() => {
        screen.getByTestId('update-video').click();
      });
      expect(mockUpdatePosition).toHaveBeenCalledWith('video', { x: 10, y: 20 });

      act(() => {
        screen.getByTestId('update-help').click();
      });
      expect(mockUpdatePosition).toHaveBeenCalledWith('help', { x: 30, y: 40 });

      act(() => {
        screen.getByTestId('update-share').click();
      });
      expect(mockUpdatePosition).toHaveBeenCalledWith('share', { x: 50, y: 60 });

      expect(mockUpdatePosition).toHaveBeenCalledTimes(3);
    });

    test('state updates correctly when updatePosition is called', () => {
      // Simulate a stateful provider
      const StatefulProvider = ({ children }) => {
        const [positions, setPositions] = React.useState({
          video: { x: 0, y: 0 },
          help: { x: 0, y: 0 },
          share: { x: 0, y: 0 }
        });

        const updatePosition = (modalName, position) => {
          setPositions(prev => ({
            ...prev,
            [modalName]: position
          }));
        };

        const value = { positions, updatePosition };

        return <ModalPositionProvider value={value}>{children}</ModalPositionProvider>;
      };

      render(
        <StatefulProvider>
          <TestConsumer />
        </StatefulProvider>
      );

      // Initial state
      expect(screen.getByTestId('video-x')).toHaveTextContent('0');
      expect(screen.getByTestId('video-y')).toHaveTextContent('0');

      // Click update button
      act(() => {
        screen.getByTestId('update-button').click();
      });

      // State should update
      expect(screen.getByTestId('video-x')).toHaveTextContent('100');
      expect(screen.getByTestId('video-y')).toHaveTextContent('150');

      // Other modals should remain unchanged
      expect(screen.getByTestId('help-x')).toHaveTextContent('0');
      expect(screen.getByTestId('help-y')).toHaveTextContent('0');
      expect(screen.getByTestId('share-x')).toHaveTextContent('0');
      expect(screen.getByTestId('share-y')).toHaveTextContent('0');
    });
  });

  describe('Edge cases and error handling', () => {
    test('provider handles undefined positions gracefully', () => {
      const mockValue = {
        positions: {
          video: { x: undefined, y: undefined },
          help: { x: undefined, y: undefined },
          share: { x: undefined, y: undefined }
        },
        updatePosition: jest.fn()
      };

      render(
        <ModalPositionProvider value={mockValue}>
          <TestConsumer />
        </ModalPositionProvider>
      );

      // Should render without crashing
      expect(screen.getByTestId('consumer')).toBeInTheDocument();
    });

    test('provider handles updatePosition being called multiple times rapidly', () => {
      const mockUpdatePosition = jest.fn();
      const mockValue = {
        positions: {
          video: { x: 0, y: 0 },
          help: { x: 0, y: 0 },
          share: { x: 0, y: 0 }
        },
        updatePosition: mockUpdatePosition
      };

      render(
        <ModalPositionProvider value={mockValue}>
          <TestConsumer />
        </ModalPositionProvider>
      );

      const updateButton = screen.getByTestId('update-button');

      // Click rapidly multiple times
      act(() => {
        updateButton.click();
        updateButton.click();
        updateButton.click();
      });

      expect(mockUpdatePosition).toHaveBeenCalledTimes(3);
    });
  });
});
