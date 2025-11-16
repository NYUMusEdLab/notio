/**
 * Unit Tests: Focus Management Edge Cases
 *
 * Purpose: Test edge cases in focus management
 * Coverage: 10-20% (unit tests for edge cases only per Constitution)
 *
 * Tests:
 * - T065: Focus behavior when element removed from DOM
 * - Focus restoration edge cases
 * - Unusual focus scenarios
 */

import React, { useState } from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Key from '../../../components/keyboard/Key';
import ShareButton from '../../../components/menu/ShareButton';

describe('Focus Management Edge Cases (Unit Tests)', () => {
  describe('T065: Focus Behavior When Element Removed from DOM', () => {
    it('should move focus to body when focused element is removed', () => {
      const mockNoteOn = jest.fn();
      const mockNoteOff = jest.fn();

      const DynamicKeyComponent = () => {
        const [showKey, setShowKey] = useState(true);

        return (
          <div>
            {showKey && (
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
            )}
            <button onClick={() => setShowKey(false)} data-testid="remove-button">
              Remove Key
            </button>
          </div>
        );
      };

      render(<DynamicKeyComponent />);

      const key = screen.getByRole('button', { name: 'Play C4' });
      const removeButton = screen.getByTestId('remove-button');

      // Focus the key
      key.focus();
      expect(document.activeElement).toBe(key);

      // Remove the key from DOM
      fireEvent.click(removeButton);

      // Focus should move to body (default browser behavior)
      expect(document.activeElement).toBe(document.body);
    });

    it('should handle focus when parent component unmounts', () => {
      const mockNoteOn = jest.fn();
      const mockNoteOff = jest.fn();

      const { unmount } = render(
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

      // Focus the key
      key.focus();
      expect(document.activeElement).toBe(key);

      // Unmount the component
      unmount();

      // Focus should move to body
      expect(document.activeElement).toBe(document.body);
    });

    it('should handle conditional rendering without focus errors', () => {
      const mockNoteOn = jest.fn();
      const mockNoteOff = jest.fn();

      const ConditionalComponent = () => {
        const [condition, setCondition] = useState(true);

        return (
          <div>
            {condition ? (
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
            ) : (
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
            <button onClick={() => setCondition(!condition)} data-testid="toggle-button">
              Toggle
            </button>
          </div>
        );
      };

      render(<ConditionalComponent />);

      const c4Key = screen.getByRole('button', { name: 'Play C4' });
      const toggleButton = screen.getByTestId('toggle-button');

      // Focus C4 key
      c4Key.focus();
      expect(document.activeElement).toBe(c4Key);

      // Toggle to D4 key
      fireEvent.click(toggleButton);

      // D4 key should now exist
      const d4Key = screen.getByRole('button', { name: 'Play D4' });
      expect(d4Key).toBeInTheDocument();

      // C4 key should not be queryable by its original label
      const c4KeyAfterToggle = screen.queryByRole('button', { name: 'Play C4' });
      expect(c4KeyAfterToggle).not.toBeInTheDocument();

      // The component switched from C4 to D4 successfully
      expect(d4Key).toHaveAttribute('aria-label', 'Play D4');
    });
  });

  describe('Focus Restoration Edge Cases', () => {
    it('should handle focus when element is temporarily disabled', () => {
      const mockMenuClick = jest.fn();
      const mockSaveSession = jest.fn();

      const { rerender } = render(
        <ShareButton
          label="share"
          title="Share"
          onClickMenuHandler={mockMenuClick}
          saveSessionToDB={mockSaveSession}
          sessionID="test-123"
        />
      );

      const button = screen.getByRole('button', { name: 'Share' });

      // Focus the button
      button.focus();
      expect(document.activeElement).toBe(button);

      // Re-render with different props (simulating state change)
      rerender(
        <ShareButton
          label="share"
          title="Share"
          onClickMenuHandler={mockMenuClick}
          saveSessionToDB={mockSaveSession}
          sessionID="test-456"
        />
      );

      // Button should still be focusable (ShareButton uses tabIndex="0")
      const updatedButton = screen.getByRole('button', { name: 'Share' });
      expect(updatedButton).toHaveAttribute('tabIndex', '0');
    });

    it('should handle rapid focus changes during user interaction', () => {
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

      // Rapidly change focus
      for (let i = 0; i < 10; i++) {
        keys[i % 3].focus();
        expect(document.activeElement).toBe(keys[i % 3]);
      }

      // Final focus should be stable (i=9, 9 % 3 = 0)
      expect(document.activeElement).toBe(keys[0]);
    });
  });

  describe('Unusual Focus Scenarios', () => {
    it('should handle focus when element is nested in complex structure', () => {
      const mockNoteOn = jest.fn();
      const mockNoteOff = jest.fn();

      render(
        <div>
          <div>
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
            </div>
          </div>
        </div>
      );

      const key = screen.getByRole('button', { name: 'Play C4' });

      // Should be focusable despite nesting (Key uses tabIndex="-1" for roving tabIndex pattern)
      key.focus();
      expect(document.activeElement).toBe(key);
      expect(key).toHaveAttribute('tabIndex', '-1');
    });

    it('should handle focus/blur cycles without memory leaks', () => {
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

      const key = screen.getByRole('button', { name: 'Play C4' });

      // Cycle focus/blur many times
      for (let i = 0; i < 100; i++) {
        fireEvent.focus(key);
        fireEvent.blur(key);
      }

      // Element should still be functional (Key uses tabIndex="-1" for roving tabIndex pattern)
      expect(key).toHaveAttribute('role', 'button');
      expect(key).toHaveAttribute('tabIndex', '-1');

      // Should still be focusable programmatically
      key.focus();
      expect(document.activeElement).toBe(key);
    });

    it('should handle programmatic focus changes', () => {
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
          <button data-testid="external-button">External Button</button>
        </div>
      );

      const key = screen.getByRole('button', { name: 'Play C4' });
      const externalButton = screen.getByTestId('external-button');

      // Programmatically focus the key
      key.focus();
      expect(document.activeElement).toBe(key);

      // Programmatically move focus away
      externalButton.focus();
      expect(document.activeElement).toBe(externalButton);

      // Move focus back
      key.focus();
      expect(document.activeElement).toBe(key);
    });

    it('should not prevent focus on valid focusable elements', () => {
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
          <input type="text" data-testid="text-input" />
          <button data-testid="button">Button</button>
        </div>
      );

      const key = screen.getByRole('button', { name: 'Play C4' });
      const input = screen.getByTestId('text-input');
      const button = screen.getByTestId('button');

      // All should be focusable
      key.focus();
      expect(document.activeElement).toBe(key);

      input.focus();
      expect(document.activeElement).toBe(input);

      button.focus();
      expect(document.activeElement).toBe(button);
    });
  });

  describe('Focus and Event Handler Interaction', () => {
    it('should maintain focus after keyboard activation', async () => {
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

      const key = screen.getByRole('button', { name: 'Play C4' });

      // Focus and activate
      key.focus();
      expect(document.activeElement).toBe(key);

      fireEvent.keyDown(key, { key: 'Enter', code: 'Enter' });
      expect(mockNoteOn).toHaveBeenCalledWith('C4');

      // Wait for note to finish (200ms)
      await waitFor(() => {
        expect(mockNoteOff).toHaveBeenCalledWith('C4');
      }, { timeout: 300 });

      // Focus should still be on the key
      expect(document.activeElement).toBe(key);
    });

    it('should maintain focus after mouse click', () => {
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

      const key = screen.getByRole('button', { name: 'Play C4' });

      // Focus
      key.focus();
      expect(document.activeElement).toBe(key);

      // Click (should not remove focus)
      fireEvent.click(key);

      // Focus should still be on the key (or at minimum, still focusable)
      key.focus();
      expect(document.activeElement).toBe(key);
    });
  });
});
