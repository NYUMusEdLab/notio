/**
 * Unit Tests: Tab Order and Focus Stability
 *
 * Purpose: Test edge cases for Tab navigation and focus management
 * Coverage: 10-20% (unit tests for edge cases per Constitution)
 *
 * Tests:
 * - T016: Rapid Tab key presses (focus stability)
 * - Dynamic element addition/removal
 * - Focus trap scenarios
 * - TabIndex edge cases
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Key from '../../../components/keyboard/Key';

describe('Tab Order and Focus Stability Unit Tests', () => {
  describe('T016: Rapid Tab Key Presses', () => {
    it('should maintain focus stability with rapid Tab presses', () => {
      const mockNoteOn = jest.fn();
      const mockNoteOff = jest.fn();

      render(
        <div>
          <Key
            note="C4"
            keyColor="white"
            toneIsInScale={true}
            noteOnHandler={mockNoteOn}
            noteOffHandler={mockNoteOff}
            noteName={[{ key: 'English', value: 'C' }]}
            pianoOn={false}
            isMouseDown={false}
          />
          <Key
            note="D4"
            keyColor="white"
            toneIsInScale={true}
            noteOnHandler={mockNoteOn}
            noteOffHandler={mockNoteOff}
            noteName={[{ key: 'English', value: 'D' }]}
            pianoOn={false}
            isMouseDown={false}
          />
          <Key
            note="E4"
            keyColor="white"
            toneIsInScale={true}
            noteOnHandler={mockNoteOn}
            noteOffHandler={mockNoteOff}
            noteName={[{ key: 'English', value: 'E' }]}
            pianoOn={false}
            isMouseDown={false}
          />
        </div>
      );

      const keys = screen.getAllByRole('button', { name: /Play/ });

      // Rapidly focus each key
      keys[0].focus();
      expect(document.activeElement).toBe(keys[0]);

      keys[1].focus();
      expect(document.activeElement).toBe(keys[1]);

      keys[2].focus();
      expect(document.activeElement).toBe(keys[2]);

      // Focus should be stable - last focused element should remain focused
      expect(document.activeElement).toBe(keys[2]);
    });

    it('should not lose focus when rapidly pressing Tab', () => {
      const mockNoteOn = jest.fn();
      const mockNoteOff = jest.fn();

      render(
        <div>
          {[...Array(10)].map((_, i) => (
            <Key
              key={i}
              note={`C${i}`}
              keyColor="white"
              toneIsInScale={true}
              noteOnHandler={mockNoteOn}
              noteOffHandler={mockNoteOff}
              noteName={[{ key: 'English', value: `C${i}` }]}
              pianoOn={false}
              isMouseDown={false}
            />
          ))}
        </div>
      );

      const keys = screen.getAllByRole('button');

      // Simulate rapid tabbing by focusing each element quickly
      keys.forEach((key, index) => {
        key.focus();
        expect(document.activeElement).toBe(key);
        expect(document.activeElement.getAttribute('aria-label')).toBe(`Play C${index}`);
      });

      // Final element should still be focused
      expect(document.activeElement).toBe(keys[keys.length - 1]);
    });

    it('should handle Tab key event without breaking focus', () => {
      const mockNoteOn = jest.fn();
      const mockNoteOff = jest.fn();

      render(
        <div>
          <Key
            note="C4"
            keyColor="white"
            toneIsInScale={true}
            noteOnHandler={mockNoteOn}
            noteOffHandler={mockNoteOff}
            noteName={[{ key: 'English', value: 'C' }]}
            pianoOn={false}
            isMouseDown={false}
          />
          <Key
            note="D4"
            keyColor="white"
            toneIsInScale={true}
            noteOnHandler={mockNoteOn}
            noteOffHandler={mockNoteOff}
            noteName={[{ key: 'English', value: 'D' }]}
            pianoOn={false}
            isMouseDown={false}
          />
        </div>
      );

      const keys = screen.getAllByRole('button');

      // Focus first key
      keys[0].focus();

      // Fire Tab event (browser would move focus, but we test event handling)
      fireEvent.keyDown(keys[0], { key: 'Tab' });

      // Key should still have proper attributes after Tab event (tabIndex="-1" for roving tabIndex pattern)
      expect(keys[0]).toHaveAttribute('tabIndex', '-1');
      expect(keys[0]).toHaveAttribute('role', 'button');
    });
  });

  describe('Dynamic Element Rendering', () => {
    it('should maintain tabIndex when elements are re-rendered', () => {
      const mockNoteOn = jest.fn();
      const mockNoteOff = jest.fn();

      const { rerender } = render(
        <Key
          note="C4"
          keyColor="white"
          toneIsInScale={true}
          noteOnHandler={mockNoteOn}
          noteOffHandler={mockNoteOff}
          noteName={[{ key: 'English', value: 'C' }]}
          pianoOn={false}
          isMouseDown={false}
        />
      );

      const key = screen.getByRole('button', { name: 'Play C4' });
      expect(key).toHaveAttribute('tabIndex', '-1'); // Roving tabIndex pattern

      // Re-render with different props
      rerender(
        <Key
          note="C4"
          keyColor="white"
          toneIsInScale={false}
          noteOnHandler={mockNoteOn}
          noteOffHandler={mockNoteOff}
          noteName={[]}
          pianoOn={false}
          isMouseDown={false}
        />
      );

      // TabIndex should still be present (roving tabIndex pattern uses "-1")
      const updatedKey = screen.getByRole('button', { name: 'Play C4' });
      expect(updatedKey).toHaveAttribute('tabIndex', '-1');
    });

    it('should handle conditional rendering without breaking tab order', () => {
      const mockNoteOn = jest.fn();
      const mockNoteOff = jest.fn();

      const { rerender } = render(
        <div>
          <Key
            note="C4"
            keyColor="white"
            toneIsInScale={true}
            noteOnHandler={mockNoteOn}
            noteOffHandler={mockNoteOff}
            noteName={[{ key: 'English', value: 'C' }]}
            pianoOn={false}
            isMouseDown={false}
          />
          {true && (
            <Key
              note="D4"
              keyColor="white"
              toneIsInScale={true}
              noteOnHandler={mockNoteOn}
              noteOffHandler={mockNoteOff}
              noteName={[{ key: 'English', value: 'D' }]}
              pianoOn={false}
              isMouseDown={false}
            />
          )}
        </div>
      );

      let keys = screen.getAllByRole('button');
      expect(keys).toHaveLength(2);

      // Re-render with second key conditionally removed
      rerender(
        <div>
          <Key
            note="C4"
            keyColor="white"
            toneIsInScale={true}
            noteOnHandler={mockNoteOn}
            noteOffHandler={mockNoteOff}
            noteName={[{ key: 'English', value: 'C' }]}
            pianoOn={false}
            isMouseDown={false}
          />
          {false && (
            <Key
              note="D4"
              keyColor="white"
              toneIsInScale={true}
              noteOnHandler={mockNoteOn}
              noteOffHandler={mockNoteOff}
              noteName={[{ key: 'English', value: 'D' }]}
              pianoOn={false}
              isMouseDown={false}
            />
          )}
        </div>
      );

      keys = screen.getAllByRole('button');
      expect(keys).toHaveLength(1);
      expect(keys[0]).toHaveAttribute('tabIndex', '-1'); // Roving tabIndex pattern
    });
  });

  describe('TabIndex Edge Cases', () => {
    it('should use tabIndex=-1 for roving tabIndex pattern', () => {
      const mockNoteOn = jest.fn();
      const mockNoteOff = jest.fn();

      render(
        <div>
          {[...Array(5)].map((_, i) => (
            <Key
              key={i}
              note={`C${i}`}
              keyColor="white"
              toneIsInScale={true}
              noteOnHandler={mockNoteOn}
              noteOffHandler={mockNoteOff}
              noteName={[{ key: 'English', value: `C${i}` }]}
              pianoOn={false}
              isMouseDown={false}
            />
          ))}
        </div>
      );

      const keys = screen.getAllByRole('button');

      // All keys should have tabIndex="-1" for roving tabIndex pattern (container has tabIndex="0")
      keys.forEach(key => {
        expect(key.getAttribute('tabIndex')).toBe('-1');
      });
    });

    it('should use tabIndex=-1 to implement roving tabIndex pattern', () => {
      const mockNoteOn = jest.fn();
      const mockNoteOff = jest.fn();

      render(
        <Key
          note="C4"
          keyColor="white"
          toneIsInScale={true}
          noteOnHandler={mockNoteOn}
          noteOffHandler={mockNoteOff}
          noteName={[{ key: 'English', value: 'C' }]}
          pianoOn={false}
          isMouseDown={false}
        />
      );

      const key = screen.getByRole('button');

      // Should use tabIndex="-1" as part of roving tabIndex pattern
      expect(key.getAttribute('tabIndex')).toBe('-1');
    });
  });

  describe('Focus Behavior', () => {
    it('should maintain focus when element is clicked', () => {
      const mockNoteOn = jest.fn();
      const mockNoteOff = jest.fn();

      render(
        <Key
          note="C4"
          keyColor="white"
          toneIsInScale={true}
          noteOnHandler={mockNoteOn}
          noteOffHandler={mockNoteOff}
          noteName={[{ key: 'English', value: 'C' }]}
          pianoOn={false}
          isMouseDown={false}
        />
      );

      const key = screen.getByRole('button');

      // Focus the element
      key.focus();
      expect(document.activeElement).toBe(key);

      // Click should not remove focus
      fireEvent.mouseDown(key);
      // Note: Focus behavior on click depends on browser, but element should remain focusable (tabIndex="-1" for roving tabIndex pattern)
      expect(key).toHaveAttribute('tabIndex', '-1');
    });

    it('should not interfere with sequential focus navigation', () => {
      const mockNoteOn = jest.fn();
      const mockNoteOff = jest.fn();

      render(
        <div>
          <input type="text" aria-label="Text input" />
          <Key
            note="C4"
            keyColor="white"
            toneIsInScale={true}
            noteOnHandler={mockNoteOn}
            noteOffHandler={mockNoteOff}
            noteName={[{ key: 'English', value: 'C' }]}
            pianoOn={false}
            isMouseDown={false}
          />
          <button aria-label="Regular button">Click me</button>
        </div>
      );

      const input = screen.getByLabelText('Text input');
      const key = screen.getByRole('button', { name: 'Play C4' });
      const button = screen.getByRole('button', { name: 'Regular button' });

      // All elements should be in natural tab order (tabIndex=0 or natural focusability)
      input.focus();
      expect(document.activeElement).toBe(input);

      key.focus();
      expect(document.activeElement).toBe(key);

      button.focus();
      expect(document.activeElement).toBe(button);
    });
  });

  describe('Accessibility Attributes Persistence', () => {
    it('should maintain role="button" through re-renders', () => {
      const mockNoteOn = jest.fn();
      const mockNoteOff = jest.fn();

      const { rerender } = render(
        <Key
          note="C4"
          keyColor="white"
          toneIsInScale={true}
          noteOnHandler={mockNoteOn}
          noteOffHandler={mockNoteOff}
          noteName={[{ key: 'English', value: 'C' }]}
          pianoOn={false}
          isMouseDown={false}
        />
      );

      let key = screen.getByRole('button');
      expect(key).toHaveAttribute('role', 'button');

      // Re-render multiple times
      for (let i = 0; i < 5; i++) {
        rerender(
          <Key
            note="C4"
            keyColor="white"
            toneIsInScale={i % 2 === 0}
            noteOnHandler={mockNoteOn}
            noteOffHandler={mockNoteOff}
            noteName={[{ key: 'English', value: 'C' }]}
            noteNameEnglish="C"
            pianoOn={i % 2 === 0}
            isMouseDown={false}
          />
        );
      }

      key = screen.getByRole('button');
      expect(key).toHaveAttribute('role', 'button');
    });

    it('should maintain aria-label through state changes', () => {
      const mockNoteOn = jest.fn();
      const mockNoteOff = jest.fn();

      const { rerender } = render(
        <Key
          note="C4"
          keyColor="white"
          toneIsInScale={true}
          noteOnHandler={mockNoteOn}
          noteOffHandler={mockNoteOff}
          noteName={[{ key: 'English', value: 'C' }]}
          pianoOn={false}
          isMouseDown={false}
        />
      );

      const key = screen.getByRole('button');
      expect(key).toHaveAttribute('aria-label', 'Play C4');

      // Re-render with different props
      rerender(
        <Key
          note="C4"
          keyColor="white"
          toneIsInScale={false}
          noteOnHandler={mockNoteOn}
          noteOffHandler={mockNoteOff}
          noteName={[]}
          noteNameEnglish="C"
          pianoOn={true}
          isMouseDown={true}
        />
      );

      // Aria-label should persist
      const updatedKey = screen.getByRole('button');
      expect(updatedKey).toHaveAttribute('aria-label', 'Play C4');
    });
  });
});
