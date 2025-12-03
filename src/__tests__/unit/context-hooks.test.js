/**
 * Unit Tests: useModalPosition Hook
 *
 * Tests edge cases and error handling for the useModalPosition hook.
 * Verifies that hook throws appropriate errors when used incorrectly.
 *
 * Coverage Target: useModalPosition hook error paths
 * Performance Target: < 1 second per test
 *
 * Related Tasks: T061-T062
 * Related Contract: specs/005-url-storage-completion/contracts/context-api.md
 */

import React from 'react';
import { renderHook } from '@testing-library/react';
import { useModalPosition } from '../../hooks/useModalPosition';
import { ModalPositionProvider } from '../../contexts/ModalPositionContext';

describe('useModalPosition Hook Unit Tests', () => {
  describe('Error handling when used outside provider (T062)', () => {
    test('throws error when used outside ModalPositionProvider', () => {
      // Suppress console.error for this test since we expect an error
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

      // Rendering hook outside provider should throw
      expect(() => {
        renderHook(() => useModalPosition());
      }).toThrow('useModalPosition must be used within a ModalPositionProvider');

      consoleSpy.mockRestore();
    });

    test('error message includes helpful instructions', () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

      try {
        renderHook(() => useModalPosition());
      } catch (error) {
        expect(error.message).toContain('ModalPositionProvider');
        expect(error.message).toContain('Wrap your component tree');
        expect(error.message).toContain('WholeApp.js');
      }

      consoleSpy.mockRestore();
    });

    test('throws error when context value is undefined', () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

      // Mock context that returns undefined
      jest.spyOn(React, 'useContext').mockReturnValue(undefined);

      expect(() => {
        renderHook(() => useModalPosition());
      }).toThrow();

      React.useContext.mockRestore();
      consoleSpy.mockRestore();
    });
  });

  describe('Validation of context value structure', () => {
    test('throws error when context is missing positions property', () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

      const invalidValue = {
        // Missing positions property
        updatePosition: jest.fn()
      };

      const wrapper = ({ children }) => (
        <ModalPositionProvider value={invalidValue}>
          {children}
        </ModalPositionProvider>
      );

      expect(() => {
        renderHook(() => useModalPosition(), { wrapper });
      }).toThrow('Invalid context value');

      consoleSpy.mockRestore();
    });

    test('throws error when context is missing updatePosition function', () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

      const invalidValue = {
        positions: {
          video: { x: null, y: null },
          help: { x: null, y: null },
          share: { x: null, y: null }
        }
        // Missing updatePosition function
      };

      const wrapper = ({ children }) => (
        <ModalPositionProvider value={invalidValue}>
          {children}
        </ModalPositionProvider>
      );

      expect(() => {
        renderHook(() => useModalPosition(), { wrapper });
      }).toThrow('Invalid context value');

      consoleSpy.mockRestore();
    });

    test('throws error when updatePosition is not a function', () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

      const invalidValue = {
        positions: {
          video: { x: null, y: null },
          help: { x: null, y: null },
          share: { x: null, y: null }
        },
        updatePosition: 'not-a-function' // Wrong type
      };

      const wrapper = ({ children }) => (
        <ModalPositionProvider value={invalidValue}>
          {children}
        </ModalPositionProvider>
      );

      expect(() => {
        renderHook(() => useModalPosition(), { wrapper });
      }).toThrow('Invalid context value');

      consoleSpy.mockRestore();
    });

    test('error message includes received value for debugging', () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

      const invalidValue = {
        positions: null, // Invalid
        updatePosition: jest.fn()
      };

      const wrapper = ({ children }) => (
        <ModalPositionProvider value={invalidValue}>
          {children}
        </ModalPositionProvider>
      );

      try {
        renderHook(() => useModalPosition(), { wrapper });
      } catch (error) {
        expect(error.message).toContain('Invalid context value');
        expect(error.message).toContain('Expected');
        expect(error.message).toContain('but received');
      }

      consoleSpy.mockRestore();
    });
  });

  describe('Successful usage with valid provider', () => {
    test('returns context value when used within provider', () => {
      const validValue = {
        positions: {
          video: { x: 100, y: 150 },
          help: { x: 200, y: 250 },
          share: { x: 300, y: 350 }
        },
        updatePosition: jest.fn()
      };

      const wrapper = ({ children }) => (
        <ModalPositionProvider value={validValue}>
          {children}
        </ModalPositionProvider>
      );

      const { result } = renderHook(() => useModalPosition(), { wrapper });

      expect(result.current).toEqual(validValue);
      expect(result.current.positions.video).toEqual({ x: 100, y: 150 });
      expect(result.current.positions.help).toEqual({ x: 200, y: 250 });
      expect(result.current.positions.share).toEqual({ x: 300, y: 350 });
      expect(typeof result.current.updatePosition).toBe('function');
    });

    test('hook works with default null positions', () => {
      const validValue = {
        positions: {
          video: { x: null, y: null },
          help: { x: null, y: null },
          share: { x: null, y: null }
        },
        updatePosition: jest.fn()
      };

      const wrapper = ({ children }) => (
        <ModalPositionProvider value={validValue}>
          {children}
        </ModalPositionProvider>
      );

      const { result } = renderHook(() => useModalPosition(), { wrapper });

      expect(result.current).toEqual(validValue);
      expect(result.current.positions.video.x).toBeNull();
      expect(result.current.positions.video.y).toBeNull();
    });

    test('hook returns updatePosition function that can be called', () => {
      const mockUpdatePosition = jest.fn();
      const validValue = {
        positions: {
          video: { x: 0, y: 0 },
          help: { x: 0, y: 0 },
          share: { x: 0, y: 0 }
        },
        updatePosition: mockUpdatePosition
      };

      const wrapper = ({ children }) => (
        <ModalPositionProvider value={validValue}>
          {children}
        </ModalPositionProvider>
      );

      const { result } = renderHook(() => useModalPosition(), { wrapper });

      // Call updatePosition
      result.current.updatePosition('video', { x: 123, y: 456 });

      expect(mockUpdatePosition).toHaveBeenCalledTimes(1);
      expect(mockUpdatePosition).toHaveBeenCalledWith('video', { x: 123, y: 456 });
    });
  });

  describe('Performance and edge cases', () => {
    test('hook works with zero coordinates', () => {
      const validValue = {
        positions: {
          video: { x: 0, y: 0 },
          help: { x: 0, y: 0 },
          share: { x: 0, y: 0 }
        },
        updatePosition: jest.fn()
      };

      const wrapper = ({ children }) => (
        <ModalPositionProvider value={validValue}>
          {children}
        </ModalPositionProvider>
      );

      const { result } = renderHook(() => useModalPosition(), { wrapper });

      expect(result.current.positions.video).toEqual({ x: 0, y: 0 });
    });

    test('hook works with large coordinate values', () => {
      const validValue = {
        positions: {
          video: { x: 10000, y: 10000 },
          help: { x: 9999, y: 9999 },
          share: { x: 8888, y: 8888 }
        },
        updatePosition: jest.fn()
      };

      const wrapper = ({ children }) => (
        <ModalPositionProvider value={validValue}>
          {children}
        </ModalPositionProvider>
      );

      const { result } = renderHook(() => useModalPosition(), { wrapper });

      expect(result.current.positions.video).toEqual({ x: 10000, y: 10000 });
    });

    test('hook executes quickly', () => {
      const validValue = {
        positions: {
          video: { x: 100, y: 150 },
          help: { x: 200, y: 250 },
          share: { x: 300, y: 350 }
        },
        updatePosition: jest.fn()
      };

      const wrapper = ({ children }) => (
        <ModalPositionProvider value={validValue}>
          {children}
        </ModalPositionProvider>
      );

      const startTime = performance.now();
      for (let i = 0; i < 1000; i++) {
        renderHook(() => useModalPosition(), { wrapper });
      }
      const endTime = performance.now();
      const duration = endTime - startTime;

      // 1000 hook calls should complete in < 500ms (generous buffer for CI)
      expect(duration).toBeLessThan(500);
    });
  });
});
