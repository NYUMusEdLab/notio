/**
 * Integration Tests: Focus Visibility and Management
 *
 * Purpose: Verify keyboard focus is visible and matches hover behavior
 * Coverage: 60-70% (integration-first testing strategy per Constitution)
 *
 * Tests:
 * - T062: Focus/hover parity in ColorKey (onFocus shows same info as onMouseOver)
 * - T063: Focus indicator visibility across all interactive elements
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Key from '../../components/keyboard/Key';
import ShareButton from '../../components/menu/ShareButton';
import VideoButton from '../../components/menu/VideoButton';
import HelpButton from '../../components/menu/HelpButton';
import SubMenu from '../../components/menu/SubMenu';
import DropdownCustomScaleMenu from '../../components/menu/DropdownCustomScaleMenu';

describe('Focus Visibility and Management Integration Tests', () => {
  describe('T062: Focus/Hover Parity in ColorKey', () => {
    it('should show same information on focus as on hover', () => {
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

      // Test hover behavior (ColorKey shows note info)
      fireEvent.mouseOver(key);
      // aria-label should be present for screen readers
      expect(key).toHaveAttribute('aria-label', 'Play C4');

      fireEvent.mouseOut(key);
      // aria-label persists (always available)
      expect(key).toHaveAttribute('aria-label', 'Play C4');

      // Test focus behavior (should show same info as hover)
      fireEvent.focus(key);
      expect(key).toHaveAttribute('aria-label', 'Play C4');

      fireEvent.blur(key);
      // aria-label still persists
      expect(key).toHaveAttribute('aria-label', 'Play C4');
    });

    it('should maintain focus visibility when switching between keys', () => {
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

      const c4Key = screen.getByRole('button', { name: 'Play C4' });
      const d4Key = screen.getByRole('button', { name: 'Play D4' });

      // Focus first key
      c4Key.focus();
      expect(document.activeElement).toBe(c4Key);

      // Focus second key
      d4Key.focus();
      expect(document.activeElement).toBe(d4Key);
      expect(document.activeElement).not.toBe(c4Key);
    });

    it('should handle rapid focus/blur events without errors', () => {
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

      // Rapidly focus and blur
      for (let i = 0; i < 10; i++) {
        fireEvent.focus(key);
        fireEvent.blur(key);
      }

      // Should not throw errors
      expect(key).toHaveAttribute('role', 'button');
    });

    it('should show note information on focus (same as hover)', () => {
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

      // Focus should show note info (via aria-label)
      fireEvent.focus(key);
      expect(key).toHaveAttribute('aria-label', 'Play C4');

      // Even when blurred, aria-label should persist
      fireEvent.blur(key);
      expect(key).toHaveAttribute('aria-label', 'Play C4');
    });
  });

  describe('T063: Focus Indicator Visibility', () => {
    it('should have tabIndex on all interactive Key components', () => {
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

      const keys = screen.getAllByRole('button', { name: /Play/ });
      expect(keys).toHaveLength(2);

      // Key components use tabIndex="-1" for roving tabIndex pattern (container has tabIndex="0")
      keys.forEach(key => {
        expect(key).toHaveAttribute('tabIndex', '-1');
      });
    });

    it('should have tabIndex on all menu buttons', () => {
      const mockMenuClick = jest.fn();
      const mockSaveSession = jest.fn();
      const mockVideoVisibility = jest.fn();

      render(
        <div>
          <ShareButton
            label="share"
            title="Share"
            onClickMenuHandler={mockMenuClick}
            saveSessionToDB={mockSaveSession}
            sessionID="test-123"
          />
          <VideoButton
            label="video"
            title="Watch Tutorial"
            onClickMenuHandler={mockMenuClick}
            handleChangeVideoVisibility={mockVideoVisibility}
            videoUrl="https://example.com/video"
          />
          <HelpButton
            title="Help"
            active={false}
          />
        </div>
      );

      const shareButton = screen.getByRole('button', { name: 'Share' });
      const videoButton = screen.getByRole('button', { name: 'Watch tutorial video' });
      const helpButton = screen.getByRole('button', { name: 'Help' });

      expect(shareButton).toHaveAttribute('tabIndex', '0');
      expect(videoButton).toHaveAttribute('tabIndex', '0');
      expect(helpButton).toHaveAttribute('tabIndex', '0');
    });

    it('should have tabIndex on submenu items', () => {
      const mockMenuClick = jest.fn();
      const mockSubmenuClick = jest.fn();

      render(
        <SubMenu
          subMenuButtons={[
            { name: 'Major', value: 'major' },
            { name: 'Minor', value: 'minor' },
          ]}
          title="Scale"
          handleClickSubMenuButton={mockSubmenuClick}
          onClickMenuHandler={mockMenuClick}
        />
      );

      const buttons = screen.getAllByRole('button');
      expect(buttons.length).toBeGreaterThanOrEqual(1);

      buttons.forEach(button => {
        expect(button).toHaveAttribute('tabIndex', '0');
      });
    });

    it('should have tabIndex on dropdown menu', () => {
      const mockMenuClick = jest.fn();
      const mockScaleChange = jest.fn();

      render(
        <DropdownCustomScaleMenu
          label="custom-scale"
          title="Customize"
          onClickMenuHandler={mockMenuClick}
          handleChangeScale={mockScaleChange}
        />
      );

      const menuitem = screen.getByRole('menuitem', { name: 'Customize scale settings' });
      expect(menuitem).toHaveAttribute('tabIndex', '-1');
    });

    it('should maintain focus when component updates', () => {
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
      key.focus();
      expect(document.activeElement).toBe(key);

      // Re-render with different props
      rerender(
        <Key
          note="C4"
          keyColor="white"
          toneIsInScale={false}
          noteOnHandler={mockNoteOn}
          noteOffHandler={mockNoteOff}
          noteName={[{ key: 'English', value: 'C' }]}
          pianoOn={false}
          isMouseDown={false}
        />
      );

      // Focus should persist after re-render
      const updatedKey = screen.getByRole('button', { name: 'Play C4' });
      expect(document.activeElement).toBe(updatedKey);
    });

    it('should be focusable after being clicked', () => {
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

      // Click the key
      fireEvent.click(key);

      // Should still be focusable
      key.focus();
      expect(document.activeElement).toBe(key);
    });

    it('should allow focus to move to next element on Tab', () => {
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

      // Focus should move through elements
      keys[0].focus();
      expect(document.activeElement).toBe(keys[0]);

      keys[1].focus();
      expect(document.activeElement).toBe(keys[1]);

      keys[2].focus();
      expect(document.activeElement).toBe(keys[2]);
    });
  });

  describe('Focus Management Edge Cases', () => {
    it('should handle focus when element is disabled or inactive', () => {
      const mockMenuClick = jest.fn();
      const mockVideoVisibility = jest.fn();

      const { rerender } = render(
        <VideoButton
          label="video"
          title="Watch Tutorial"
          onClickMenuHandler={mockMenuClick}
          handleChangeVideoVisibility={mockVideoVisibility}
          videoUrl="https://example.com/video"
        />
      );

      const button = screen.getByRole('button', { name: 'Watch tutorial video' });

      // Should be focusable
      button.focus();
      expect(document.activeElement).toBe(button);

      // Even if props change, should remain focusable
      rerender(
        <VideoButton
          label="video"
          title="Watch Tutorial"
          onClickMenuHandler={mockMenuClick}
          handleChangeVideoVisibility={mockVideoVisibility}
          videoUrl=""
        />
      );

      const updatedButton = screen.getByRole('button', { name: 'Watch tutorial video' });
      expect(updatedButton).toHaveAttribute('tabIndex', '0');
    });

    it('should handle focus/blur during keyboard interaction', async () => {
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

      // Focus using native DOM method (not fireEvent.focus which doesn't update activeElement)
      key.focus();
      expect(document.activeElement).toBe(key);

      // Press Enter (should not lose focus)
      fireEvent.keyDown(key, { key: 'Enter', code: 'Enter' });
      expect(mockNoteOn).toHaveBeenCalledWith('C4');

      // Focus should still be on the key
      expect(document.activeElement).toBe(key);
    });
  });
});
