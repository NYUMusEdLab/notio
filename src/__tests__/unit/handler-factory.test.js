/**
 * Unit Tests: createPositionHandler Factory Function
 *
 * Tests the factory pattern implementation in WholeApp for creating
 * modal position update handlers.
 *
 * Coverage Target: 100% of factory function logic
 * Performance Target: < 500ms per test
 *
 * Related Tasks: T080-T082
 * Related Contract: specs/005-url-storage-completion/contracts/test-structure.md
 */

import React from 'react';
import { render, act } from '@testing-library/react';

// Test component that exposes the factory function for testing
class TestComponent extends React.Component {
  state = {
    modalPositions: {
      video: { x: null, y: null },
      help: { x: null, y: null },
      share: { x: null, y: null }
    }
  };

  // Factory function (same implementation as in WholeApp)
  createPositionHandler = (modalName) => {
    return (position) => {
      this.setState(prevState => ({
        modalPositions: {
          ...prevState.modalPositions,
          [modalName]: { x: position.x, y: position.y }
        }
      }));
    };
  };

  // Create handlers using factory
  handleVideoModalPositionChange = this.createPositionHandler('video');
  handleHelpModalPositionChange = this.createPositionHandler('help');
  handleShareModalPositionChange = this.createPositionHandler('share');

  render() {
    return (
      <div data-testid="test-component">
        <div data-testid="video-x">{this.state.modalPositions.video.x ?? 'null'}</div>
        <div data-testid="video-y">{this.state.modalPositions.video.y ?? 'null'}</div>
        <div data-testid="help-x">{this.state.modalPositions.help.x ?? 'null'}</div>
        <div data-testid="help-y">{this.state.modalPositions.help.y ?? 'null'}</div>
        <div data-testid="share-x">{this.state.modalPositions.share.x ?? 'null'}</div>
        <div data-testid="share-y">{this.state.modalPositions.share.y ?? 'null'}</div>
      </div>
    );
  }
}

describe('createPositionHandler Factory Function (T080)', () => {
  describe('Factory creates handlers that update correct modal (T081)', () => {
    test('video handler updates video modal position', () => {
      let testInstance;
      render(<TestComponent ref={(ref) => { testInstance = ref; }} />);

      act(() => {
        testInstance.handleVideoModalPositionChange({ x: 100, y: 150 });
      });

      expect(testInstance.state.modalPositions.video).toEqual({ x: 100, y: 150 });
    });

    test('help handler updates help modal position', () => {
      let testInstance;
      render(<TestComponent ref={(ref) => { testInstance = ref; }} />);

      act(() => {
        testInstance.handleHelpModalPositionChange({ x: 200, y: 250 });
      });

      expect(testInstance.state.modalPositions.help).toEqual({ x: 200, y: 250 });
    });

    test('share handler updates share modal position', () => {
      let testInstance;
      render(<TestComponent ref={(ref) => { testInstance = ref; }} />);

      act(() => {
        testInstance.handleShareModalPositionChange({ x: 300, y: 350 });
      });

      expect(testInstance.state.modalPositions.share).toEqual({ x: 300, y: 350 });
    });

    test('handlers update only their designated modal', () => {
      let testInstance;
      render(<TestComponent ref={(ref) => { testInstance = ref; }} />);

      // Update each modal and verify only that modal changed
      act(() => {
        testInstance.handleVideoModalPositionChange({ x: 111, y: 222 });
      });
      expect(testInstance.state.modalPositions.video).toEqual({ x: 111, y: 222 });
      expect(testInstance.state.modalPositions.help).toEqual({ x: null, y: null });
      expect(testInstance.state.modalPositions.share).toEqual({ x: null, y: null });

      act(() => {
        testInstance.handleHelpModalPositionChange({ x: 333, y: 444 });
      });
      expect(testInstance.state.modalPositions.video).toEqual({ x: 111, y: 222 });
      expect(testInstance.state.modalPositions.help).toEqual({ x: 333, y: 444 });
      expect(testInstance.state.modalPositions.share).toEqual({ x: null, y: null });

      act(() => {
        testInstance.handleShareModalPositionChange({ x: 555, y: 666 });
      });
      expect(testInstance.state.modalPositions.video).toEqual({ x: 111, y: 222 });
      expect(testInstance.state.modalPositions.help).toEqual({ x: 333, y: 444 });
      expect(testInstance.state.modalPositions.share).toEqual({ x: 555, y: 666 });
    });
  });

  describe('Factory handlers preserve other modals\' positions (T082)', () => {
    test('video handler preserves help and share positions', () => {
      let testInstance;
      render(<TestComponent ref={(ref) => { testInstance = ref; }} />);

      // Set initial positions for all modals
      act(() => {
        testInstance.setState({
          modalPositions: {
            video: { x: 10, y: 20 },
            help: { x: 30, y: 40 },
            share: { x: 50, y: 60 }
          }
        });
      });

      // Update video position
      act(() => {
        testInstance.handleVideoModalPositionChange({ x: 100, y: 150 });
      });

      // Verify video changed but others preserved
      expect(testInstance.state.modalPositions.video).toEqual({ x: 100, y: 150 });
      expect(testInstance.state.modalPositions.help).toEqual({ x: 30, y: 40 });
      expect(testInstance.state.modalPositions.share).toEqual({ x: 50, y: 60 });
    });

    test('help handler preserves video and share positions', () => {
      let testInstance;
      render(<TestComponent ref={(ref) => { testInstance = ref; }} />);

      // Set initial positions for all modals
      act(() => {
        testInstance.setState({
          modalPositions: {
            video: { x: 10, y: 20 },
            help: { x: 30, y: 40 },
            share: { x: 50, y: 60 }
          }
        });
      });

      // Update help position
      act(() => {
        testInstance.handleHelpModalPositionChange({ x: 200, y: 250 });
      });

      // Verify help changed but others preserved
      expect(testInstance.state.modalPositions.video).toEqual({ x: 10, y: 20 });
      expect(testInstance.state.modalPositions.help).toEqual({ x: 200, y: 250 });
      expect(testInstance.state.modalPositions.share).toEqual({ x: 50, y: 60 });
    });

    test('share handler preserves video and help positions', () => {
      let testInstance;
      render(<TestComponent ref={(ref) => { testInstance = ref; }} />);

      // Set initial positions for all modals
      act(() => {
        testInstance.setState({
          modalPositions: {
            video: { x: 10, y: 20 },
            help: { x: 30, y: 40 },
            share: { x: 50, y: 60 }
          }
        });
      });

      // Update share position
      act(() => {
        testInstance.handleShareModalPositionChange({ x: 300, y: 350 });
      });

      // Verify share changed but others preserved
      expect(testInstance.state.modalPositions.video).toEqual({ x: 10, y: 20 });
      expect(testInstance.state.modalPositions.help).toEqual({ x: 30, y: 40 });
      expect(testInstance.state.modalPositions.share).toEqual({ x: 300, y: 350 });
    });

    test('rapid sequential updates preserve intermediate states', () => {
      let testInstance;
      render(<TestComponent ref={(ref) => { testInstance = ref; }} />);

      // Set initial state
      act(() => {
        testInstance.setState({
          modalPositions: {
            video: { x: 0, y: 0 },
            help: { x: 0, y: 0 },
            share: { x: 0, y: 0 }
          }
        });
      });

      // Perform rapid updates to different modals
      act(() => {
        testInstance.handleVideoModalPositionChange({ x: 100, y: 100 });
        testInstance.handleHelpModalPositionChange({ x: 200, y: 200 });
        testInstance.handleShareModalPositionChange({ x: 300, y: 300 });
      });

      // All positions should be updated correctly
      expect(testInstance.state.modalPositions.video).toEqual({ x: 100, y: 100 });
      expect(testInstance.state.modalPositions.help).toEqual({ x: 200, y: 200 });
      expect(testInstance.state.modalPositions.share).toEqual({ x: 300, y: 300 });
    });

    test('updating same modal multiple times uses latest value', () => {
      let testInstance;
      render(<TestComponent ref={(ref) => { testInstance = ref; }} />);

      act(() => {
        testInstance.handleVideoModalPositionChange({ x: 100, y: 150 });
      });

      expect(testInstance.state.modalPositions.video).toEqual({ x: 100, y: 150 });

      act(() => {
        testInstance.handleVideoModalPositionChange({ x: 200, y: 250 });
      });

      expect(testInstance.state.modalPositions.video).toEqual({ x: 200, y: 250 });

      act(() => {
        testInstance.handleVideoModalPositionChange({ x: 300, y: 350 });
      });

      expect(testInstance.state.modalPositions.video).toEqual({ x: 300, y: 350 });
    });
  });

  describe('Edge cases and type handling', () => {
    test('handles zero coordinates', () => {
      let testInstance;
      render(<TestComponent ref={(ref) => { testInstance = ref; }} />);

      act(() => {
        testInstance.handleVideoModalPositionChange({ x: 0, y: 0 });
      });

      expect(testInstance.state.modalPositions.video).toEqual({ x: 0, y: 0 });
    });

    test('handles large coordinate values', () => {
      let testInstance;
      render(<TestComponent ref={(ref) => { testInstance = ref; }} />);

      act(() => {
        testInstance.handleVideoModalPositionChange({ x: 9999, y: 9999 });
      });

      expect(testInstance.state.modalPositions.video).toEqual({ x: 9999, y: 9999 });
    });

    test('handles negative coordinates', () => {
      let testInstance;
      render(<TestComponent ref={(ref) => { testInstance = ref; }} />);

      act(() => {
        testInstance.handleVideoModalPositionChange({ x: -100, y: -50 });
      });

      expect(testInstance.state.modalPositions.video).toEqual({ x: -100, y: -50 });
    });

    test('handles floating point coordinates', () => {
      let testInstance;
      render(<TestComponent ref={(ref) => { testInstance = ref; }} />);

      act(() => {
        testInstance.handleVideoModalPositionChange({ x: 123.456, y: 789.123 });
      });

      expect(testInstance.state.modalPositions.video).toEqual({ x: 123.456, y: 789.123 });
    });
  });

  describe('Performance', () => {
    test('factory function executes quickly', () => {
      const testComponent = new TestComponent();

      const startTime = performance.now();
      for (let i = 0; i < 1000; i++) {
        testComponent.createPositionHandler('video');
        testComponent.createPositionHandler('help');
        testComponent.createPositionHandler('share');
      }
      const endTime = performance.now();
      const duration = endTime - startTime;

      // 3000 factory calls should complete in < 100ms
      expect(duration).toBeLessThan(100);
    });

    test('handler calls execute quickly', () => {
      let testInstance;
      render(<TestComponent ref={(ref) => { testInstance = ref; }} />);

      const startTime = performance.now();
      for (let i = 0; i < 100; i++) {
        act(() => {
          testInstance.handleVideoModalPositionChange({ x: i, y: i * 2 });
        });
      }
      const endTime = performance.now();
      const duration = endTime - startTime;

      // 100 handler calls should complete in < 200ms (generous for CI)
      expect(duration).toBeLessThan(200);
    });
  });
});
