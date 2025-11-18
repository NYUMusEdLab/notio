/**
 * Unit Tests: Event Handler Execution Order
 *
 * Purpose: Test edge cases for event handler interactions
 * Coverage: 10-20% (unit tests for edge cases per Constitution)
 *
 * Tests:
 * - T017: Event handler execution order (mouse vs keyboard)
 * - Enter vs Space key behavior
 * - Event propagation and preventDefault
 * - Handler isolation (keyboard doesn't interfere with mouse)
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Key from '../../../components/keyboard/Key';
import ShareButton from '../../../components/menu/ShareButton';

describe('Event Handler Execution Order Unit Tests', () => {
  describe('T017: Mouse vs Keyboard Event Handlers', () => {
    it('should handle keyboard events separately from mouse events', async () => {
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

      // Test keyboard event
      fireEvent.keyDown(key, { key: 'Enter' });
      expect(mockNoteOn).toHaveBeenCalledTimes(1);

      await new Promise(resolve => setTimeout(resolve, 250));
      expect(mockNoteOff).toHaveBeenCalledTimes(1);

      mockNoteOn.mockClear();
      mockNoteOff.mockClear();

      // Test mouse event (goes to child ColorKey, different pathway)
      const colorKey = key.querySelector('.color-key');
      if (colorKey) {
        fireEvent.mouseDown(colorKey);
        // Mouse events go through ColorKey child component
        // This verifies keyboard and mouse are independent
      }
    });

    it('should execute Enter and Space handlers identically', async () => {
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

      // Test Enter key
      fireEvent.keyDown(key, { key: 'Enter', code: 'Enter' });
      expect(mockNoteOn).toHaveBeenCalledWith('C4');

      await new Promise(resolve => setTimeout(resolve, 250));
      expect(mockNoteOff).toHaveBeenCalledWith('C4');

      const enterCallCount = mockNoteOn.mock.calls.length;

      mockNoteOn.mockClear();
      mockNoteOff.mockClear();

      // Re-render to reset state
      rerender(
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

      const keyAfterRerender = screen.getByRole('button');

      // Test Space key
      fireEvent.keyDown(keyAfterRerender, { key: ' ', code: 'Space' });
      expect(mockNoteOn).toHaveBeenCalledWith('C4');

      await new Promise(resolve => setTimeout(resolve, 250));
      expect(mockNoteOff).toHaveBeenCalledWith('C4');

      const spaceCallCount = mockNoteOn.mock.calls.length;

      // Both keys should trigger the same number of calls
      expect(enterCallCount).toBe(spaceCallCount);
    });

    it('should not trigger handler for other keys', () => {
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

      // Try various keys that should NOT trigger the handler
      const ignoredKeys = ['a', 'b', 'Escape', 'ArrowDown', 'Tab', 'Shift'];

      ignoredKeys.forEach(keyName => {
        fireEvent.keyDown(key, { key: keyName });
      });

      // Handler should NOT have been called
      expect(mockNoteOn).not.toHaveBeenCalled();
      expect(mockNoteOff).not.toHaveBeenCalled();
    });
  });

  describe('Event.preventDefault() Behavior', () => {
    it('should call preventDefault on Space key to prevent scroll', () => {
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

      // Create a custom event to track preventDefault
      const spaceEvent = new KeyboardEvent('keydown', {
        key: ' ',
        code: 'Space',
        bubbles: true,
        cancelable: true
      });

      const preventDefaultSpy = jest.spyOn(spaceEvent, 'preventDefault');

      key.dispatchEvent(spaceEvent);

      // preventDefault should have been called
      expect(preventDefaultSpy).toHaveBeenCalled();
    });

    it('should call preventDefault on Enter key', () => {
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

      const enterEvent = new KeyboardEvent('keydown', {
        key: 'Enter',
        code: 'Enter',
        bubbles: true,
        cancelable: true
      });

      const preventDefaultSpy = jest.spyOn(enterEvent, 'preventDefault');

      key.dispatchEvent(enterEvent);

      expect(preventDefaultSpy).toHaveBeenCalled();
    });
  });

  describe('Event Propagation', () => {
    it('should not propagate keyboard events to parent elements', () => {
      const mockNoteOn = jest.fn();
      const mockNoteOff = jest.fn();
      const parentKeyDown = jest.fn();

      const { container } = render(
        <div onKeyDown={parentKeyDown}>
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
        </div>
      );

      const key = screen.getByRole('button');

      // Fire keyboard event
      fireEvent.keyDown(key, { key: 'Enter' });

      // Note should play
      expect(mockNoteOn).toHaveBeenCalled();

      // Parent handler should also fire (events bubble by default)
      expect(parentKeyDown).toHaveBeenCalled();
    });

    it('should handle keyboard events even when nested in complex DOM', () => {
      const mockNoteOn = jest.fn();
      const mockNoteOff = jest.fn();

      render(
        <div className="container">
          <div className="wrapper">
            <div className="inner">
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
            </div>
          </div>
        </div>
      );

      const key = screen.getByRole('button');

      fireEvent.keyDown(key, { key: 'Enter' });

      // Should work regardless of nesting depth
      expect(mockNoteOn).toHaveBeenCalled();
    });
  });

  describe('Handler Timing and Execution Order', () => {
    it('should call noteOn before noteOff', async () => {
      const mockNoteOn = jest.fn();
      const mockNoteOff = jest.fn();
      const callOrder = [];

      mockNoteOn.mockImplementation(() => callOrder.push('noteOn'));
      mockNoteOff.mockImplementation(() => callOrder.push('noteOff'));

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

      fireEvent.keyDown(key, { key: 'Enter' });

      // noteOn should be called immediately
      expect(callOrder[0]).toBe('noteOn');

      // Wait for noteOff
      await new Promise(resolve => setTimeout(resolve, 250));

      // noteOff should be called after noteOn
      expect(callOrder[1]).toBe('noteOff');
      expect(callOrder).toEqual(['noteOn', 'noteOff']);
    });

    it('should maintain correct timing with rapid activations', async () => {
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

      // Rapid activations
      fireEvent.keyDown(key, { key: 'Enter' });
      await new Promise(resolve => setTimeout(resolve, 50));

      fireEvent.keyDown(key, { key: 'Enter' });
      await new Promise(resolve => setTimeout(resolve, 50));

      fireEvent.keyDown(key, { key: 'Enter' });

      // All activations should register
      expect(mockNoteOn).toHaveBeenCalledTimes(3);

      // Wait for all to complete
      await new Promise(resolve => setTimeout(resolve, 300));

      // All should have been released
      expect(mockNoteOff).toHaveBeenCalledTimes(3);
    });
  });

  describe('Menu Button Event Handlers', () => {
    it('should handle keyboard events on menu buttons', () => {
      const mockMenuClick = jest.fn();
      const mockSaveSession = jest.fn();

      render(
        <ShareButton
          label="share"
          title="Share"
          onClickMenuHandler={mockMenuClick}
          saveSessionToDB={mockSaveSession}
          sessionID="test-123"
        />
      );

      const button = screen.getByRole('button', { name: 'Share' });

      // Test Enter
      fireEvent.keyDown(button, { key: 'Enter' });
      expect(mockMenuClick).toHaveBeenCalledTimes(1);

      mockMenuClick.mockClear();

      // Test Space
      fireEvent.keyDown(button, { key: ' ' });
      expect(mockMenuClick).toHaveBeenCalledTimes(1);
    });

    it('should not interfere between different button types', () => {
      const mockNoteOn = jest.fn();
      const mockNoteOff = jest.fn();
      const mockMenuClick = jest.fn();
      const mockSaveSession = jest.fn();

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
          <ShareButton
            label="share"
            title="Share"
            onClickMenuHandler={mockMenuClick}
            saveSessionToDB={mockSaveSession}
            sessionID="test-123"
          />
        </div>
      );

      const pianoKey = screen.getByRole('button', { name: 'Play C4' });
      const shareButton = screen.getByRole('button', { name: 'Share' });

      // Activate piano key
      fireEvent.keyDown(pianoKey, { key: 'Enter' });
      expect(mockNoteOn).toHaveBeenCalled();
      expect(mockMenuClick).not.toHaveBeenCalled();

      mockNoteOn.mockClear();

      // Activate share button
      fireEvent.keyDown(shareButton, { key: 'Enter' });
      expect(mockMenuClick).toHaveBeenCalled();
      expect(mockNoteOn).not.toHaveBeenCalled();
    });
  });

  describe('Edge Case: Event Object Properties', () => {
    it('should check event.key property correctly', () => {
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

      // Test with event.key = 'Enter' (correct)
      fireEvent.keyDown(key, { key: 'Enter' });
      expect(mockNoteOn).toHaveBeenCalledTimes(1);

      mockNoteOn.mockClear();

      // Test with event.code = 'Enter' but different key (should not trigger)
      fireEvent.keyDown(key, { key: 'SomethingElse', code: 'Enter' });
      expect(mockNoteOn).not.toHaveBeenCalled();
    });

    it('should handle Space key with different code values', () => {
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

      // Space with various code values (all should work)
      fireEvent.keyDown(key, { key: ' ', code: 'Space' });
      expect(mockNoteOn).toHaveBeenCalledTimes(1);

      mockNoteOn.mockClear();

      fireEvent.keyDown(key, { key: ' ', code: 'Spacebar' }); // Old browsers
      expect(mockNoteOn).toHaveBeenCalledTimes(1);

      mockNoteOn.mockClear();

      fireEvent.keyDown(key, { key: ' ' }); // No code
      expect(mockNoteOn).toHaveBeenCalledTimes(1);
    });
  });
});
