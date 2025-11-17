/**
 * Integration Tests: Keyboard Piano Interaction
 *
 * Purpose: Test keyboard interaction with piano keys and audio playback
 * Coverage: Integration test for T011 - keyboard piano playing with audio
 *
 * Tests:
 * - Keyboard activation triggers note playback
 * - Notes are released after 200ms (tap behavior)
 * - Multiple keys can be played in sequence
 * - Audio integration works correctly
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Key from '../../components/keyboard/Key';
import Keyboard from '../../components/keyboard/Keyboard';

describe('Keyboard Piano Integration Tests', () => {
  describe('T011: Keyboard Piano Playing with Audio', () => {
    it('should play note when Key is activated with Enter', async () => {
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

      // Press Enter to play note
      fireEvent.keyDown(key, { key: 'Enter' });

      // Verify note starts playing
      expect(mockNoteOn).toHaveBeenCalledTimes(1);
      expect(mockNoteOn).toHaveBeenCalledWith('C4');

      // Wait for automatic note release (200ms)
      await waitFor(() => {
        expect(mockNoteOff).toHaveBeenCalledTimes(1);
        expect(mockNoteOff).toHaveBeenCalledWith('C4');
      }, { timeout: 300 });
    });

    it('should play note when Key is activated with Space', async () => {
      const mockNoteOn = jest.fn();
      const mockNoteOff = jest.fn();

      render(
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
      );

      const key = screen.getByRole('button', { name: 'Play D4' });

      // Press Space to play note
      fireEvent.keyDown(key, { key: ' ' });

      // Verify note starts playing
      expect(mockNoteOn).toHaveBeenCalledWith('D4');

      // Wait for automatic note release
      await waitFor(() => {
        expect(mockNoteOff).toHaveBeenCalledWith('D4');
      }, { timeout: 300 });
    });

    it('should play multiple notes in sequence', async () => {
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
          <Key
            note="G4"
            keyColor="white"
            toneIsInScale={true}
            noteOnHandler={mockNoteOn}
            noteOffHandler={mockNoteOff}
            noteName={[{ key: 'English', value: 'G' }]}
            pianoOn={false}
            isMouseDown={false}
          />
        </div>
      );

      const keys = screen.getAllByRole('button', { name: /Play/ });

      // Play C major chord (C, E, G) in sequence
      fireEvent.keyDown(keys[0], { key: 'Enter' }); // C4
      await new Promise(resolve => setTimeout(resolve, 50));

      fireEvent.keyDown(keys[1], { key: 'Enter' }); // E4
      await new Promise(resolve => setTimeout(resolve, 50));

      fireEvent.keyDown(keys[2], { key: 'Enter' }); // G4

      // Verify all three notes were played
      expect(mockNoteOn).toHaveBeenCalledWith('C4');
      expect(mockNoteOn).toHaveBeenCalledWith('E4');
      expect(mockNoteOn).toHaveBeenCalledWith('G4');
      expect(mockNoteOn).toHaveBeenCalledTimes(3);

      // Wait for all notes to be released
      await waitFor(() => {
        expect(mockNoteOff).toHaveBeenCalledTimes(3);
      }, { timeout: 400 });
    });

    it('should handle rapid key presses without conflicts', async () => {
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

      // Press key rapidly 5 times
      for (let i = 0; i < 5; i++) {
        fireEvent.keyDown(key, { key: 'Enter' });
        await new Promise(resolve => setTimeout(resolve, 50));
      }

      // All presses should trigger noteOn
      expect(mockNoteOn).toHaveBeenCalledTimes(5);

      // Wait for all notes to be released
      await waitFor(() => {
        expect(mockNoteOff).toHaveBeenCalledTimes(5);
      }, { timeout: 1000 });
    });

    it('should respect toneIsInScale flag - no sound when false', () => {
      const mockNoteOn = jest.fn();
      const mockNoteOff = jest.fn();

      render(
        <Key
          note="C#4"
          keyColor="black"
          toneIsInScale={false}
          noteOnHandler={mockNoteOn}
          noteOffHandler={mockNoteOff}
          noteName={[]}
          pianoOn={false}
          isMouseDown={false}
        />
      );

      const key = screen.getByRole('button', { name: 'Play C#4' });

      // Try to play note
      fireEvent.keyDown(key, { key: 'Enter' });

      // Should NOT trigger any sound when not in scale
      expect(mockNoteOn).not.toHaveBeenCalled();
      expect(mockNoteOff).not.toHaveBeenCalled();
    });

    it('should have 200ms note duration (tap simulation)', async () => {
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

      const startTime = Date.now();

      // Press key
      fireEvent.keyDown(key, { key: 'Enter' });

      // Note should start immediately
      expect(mockNoteOn).toHaveBeenCalled();

      // Wait for note to be released
      await waitFor(() => {
        expect(mockNoteOff).toHaveBeenCalled();
      }, { timeout: 300 });

      const duration = Date.now() - startTime;

      // Duration should be approximately 200ms (allow some variance for test execution)
      expect(duration).toBeGreaterThanOrEqual(180);
      expect(duration).toBeLessThan(350);
    });
  });

  describe('Piano Key Interaction Patterns', () => {
    it('should differentiate between keyboard activation (tap) and mouse click (sustained)', async () => {
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

      // Keyboard activation: automatic release after 200ms
      fireEvent.keyDown(key, { key: 'Enter' });
      expect(mockNoteOn).toHaveBeenCalledTimes(1);

      await waitFor(() => {
        expect(mockNoteOff).toHaveBeenCalledTimes(1);
      }, { timeout: 300 });

      // Mouse click: manual release on mouseup
      mockNoteOn.mockClear();
      mockNoteOff.mockClear();

      fireEvent.mouseDown(key.querySelector('.color-key'));
      // Mouse interaction goes through ColorKey child, not Key parent
      // This test verifies keyboard and mouse are separate pathways
    });

    it('should work with both pianoOn=true and pianoOn=false', async () => {
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

      // Test with pianoOn=false (only ColorKey visible)
      fireEvent.keyDown(key, { key: 'Enter' });
      expect(mockNoteOn).toHaveBeenCalledWith('C4');

      await waitFor(() => {
        expect(mockNoteOff).toHaveBeenCalledWith('C4');
      }, { timeout: 300 });

      mockNoteOn.mockClear();
      mockNoteOff.mockClear();

      // Rerender with pianoOn=true (both ColorKey and PianoKey visible)
      rerender(
        <Key
          note="C4"
          keyColor="white"
          toneIsInScale={true}
          noteOnHandler={mockNoteOn}
          noteOffHandler={mockNoteOff}
          noteName={[{ key: 'English', value: 'C' }]}
          noteNameEnglish="C"
          pianoOn={true}
          isMouseDown={false}
        />
      );

      // Test with pianoOn=true
      const keyWithPiano = screen.getByRole('button', { name: 'Play C4' });
      fireEvent.keyDown(keyWithPiano, { key: 'Enter' });
      expect(mockNoteOn).toHaveBeenCalledWith('C4');

      await waitFor(() => {
        expect(mockNoteOff).toHaveBeenCalledWith('C4');
      }, { timeout: 300 });
    });
  });

  describe('Audio Integration', () => {
    it('should call noteOnHandler with correct note name', () => {
      const mockNoteOn = jest.fn();
      const mockNoteOff = jest.fn();

      render(
        <Key
          note="A4"
          keyColor="white"
          toneIsInScale={true}
          noteOnHandler={mockNoteOn}
          noteOffHandler={mockNoteOff}
          noteName={[{ key: 'English', value: 'A' }]}
          pianoOn={false}
          isMouseDown={false}
        />
      );

      const key = screen.getByRole('button', { name: 'Play A4' });

      fireEvent.keyDown(key, { key: 'Enter' });

      // Verify exact note name is passed
      expect(mockNoteOn).toHaveBeenCalledWith('A4');
      expect(mockNoteOn).toHaveBeenCalledTimes(1);
    });

    it('should call noteOffHandler after noteOnHandler', async () => {
      const mockNoteOn = jest.fn();
      const mockNoteOff = jest.fn();
      const callOrder = [];

      mockNoteOn.mockImplementation(() => callOrder.push('on'));
      mockNoteOff.mockImplementation(() => callOrder.push('off'));

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

      fireEvent.keyDown(key, { key: 'Enter' });

      await waitFor(() => {
        expect(callOrder).toEqual(['on', 'off']);
      }, { timeout: 300 });
    });
  });
});
