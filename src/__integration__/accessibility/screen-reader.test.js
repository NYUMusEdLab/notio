/**
 * Integration Tests: Screen Reader Compatibility
 *
 * Purpose: Verify screen readers can announce all interactive elements correctly
 * Coverage: 60-70% (integration-first testing strategy per Constitution)
 *
 * Tests:
 * - T051: Screen reader announcements using jest-axe
 * - T052: ARIA roles verification
 * - T053: ARIA labels on icon-only buttons
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { axe, toHaveNoViolations } from 'jest-axe';
import Key from '../../components/keyboard/Key';
import ShareButton from '../../components/menu/ShareButton';
import VideoButton from '../../components/menu/VideoButton';
import HelpButton from '../../components/menu/HelpButton';
import SubMenu from '../../components/menu/SubMenu';
import DropdownCustomScaleMenu from '../../components/menu/DropdownCustomScaleMenu';

expect.extend(toHaveNoViolations);

describe('Screen Reader Compatibility Integration Tests', () => {
  describe('T051: Screen Reader Announcements with jest-axe', () => {
    it('should have no accessibility violations for Key components', async () => {
      const mockNoteOn = jest.fn();
      const mockNoteOff = jest.fn();

      const { container } = render(
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

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should have no accessibility violations for menu buttons', async () => {
      const mockMenuClick = jest.fn();
      const mockSaveSession = jest.fn();
      const mockVideoVisibility = jest.fn();

      const { container } = render(
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

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should have no accessibility violations for SubMenu', async () => {
      const mockMenuClick = jest.fn();
      const mockSubmenuClick = jest.fn();

      const { container } = render(
        <SubMenu
          subMenuButtons={[
            { name: 'Option 1', value: 'opt1' },
            { name: 'Option 2', value: 'opt2' },
          ]}
          title="Test Menu"
          handleClickSubMenuButton={mockSubmenuClick}
          onClickMenuHandler={mockMenuClick}
        />
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe('T052: ARIA Roles Verification', () => {
    it('should have proper role="button" on Key components', () => {
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
      expect(key).toHaveAttribute('role', 'button');
      expect(key).toHaveAttribute('aria-label', 'Play C4');
    });

    it('should have proper role="button" on ShareButton', () => {
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
      expect(button).toHaveAttribute('role', 'button');
      expect(button).toHaveAttribute('aria-label', 'Share');
    });

    it('should have proper role="button" on VideoButton', () => {
      const mockMenuClick = jest.fn();
      const mockVideoVisibility = jest.fn();

      render(
        <VideoButton
          label="video"
          title="Watch Tutorial"
          onClickMenuHandler={mockMenuClick}
          handleChangeVideoVisibility={mockVideoVisibility}
          videoUrl="https://example.com/video"
        />
      );

      const button = screen.getByRole('button', { name: 'Watch tutorial video' });
      expect(button).toHaveAttribute('role', 'button');
      expect(button).toHaveAttribute('aria-label', 'Watch tutorial video');
    });

    it('should have proper role="button" on HelpButton', () => {
      render(
        <HelpButton
          title="Help"
          active={false}
        />
      );

      const button = screen.getByRole('button', { name: 'Help' });
      expect(button).toHaveAttribute('role', 'button');
      expect(button).toHaveAttribute('aria-label', 'Help');
    });

    it('should have proper role="button" on SubMenu items', () => {
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

      // SubMenu renders submenu items with role="button"
      const menuItems = screen.getAllByRole('button');
      // At minimum, the parent menu button should exist
      expect(menuItems.length).toBeGreaterThanOrEqual(1);

      menuItems.forEach(item => {
        expect(item).toHaveAttribute('role', 'button');
      });
    });

    it('should have proper role="button" on DropdownCustomScaleMenu', () => {
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
      expect(menuitem).toHaveAttribute('role', 'menuitem');
      expect(menuitem).toHaveAttribute('aria-label', 'Customize scale settings');
    });
  });

  describe('T053: ARIA Labels on Icon-Only Buttons', () => {
    it('should have aria-label on ShareButton (icon-only)', () => {
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
      expect(button).toHaveAccessibleName();
      expect(button).toHaveAttribute('aria-label', 'Share');
    });

    it('should have aria-label on VideoButton (icon-only)', () => {
      const mockMenuClick = jest.fn();
      const mockVideoVisibility = jest.fn();

      render(
        <VideoButton
          label="video"
          title="Watch Tutorial"
          onClickMenuHandler={mockMenuClick}
          handleChangeVideoVisibility={mockVideoVisibility}
          videoUrl="https://example.com/video"
        />
      );

      const button = screen.getByRole('button', { name: 'Watch tutorial video' });
      expect(button).toHaveAccessibleName();
      expect(button).toHaveAttribute('aria-label', 'Watch tutorial video');
    });

    it('should have aria-label on HelpButton (icon-only)', () => {
      render(
        <HelpButton
          title="Help"
          active={false}
        />
      );

      const button = screen.getByRole('button', { name: 'Help' });
      expect(button).toHaveAccessibleName();
      expect(button).toHaveAttribute('aria-label', 'Help');
    });

    it('should have aria-label on DropdownCustomScaleMenu (icon-only)', () => {
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
      expect(menuitem).toHaveAccessibleName();
      expect(menuitem).toHaveAttribute('aria-label', 'Customize scale settings');
    });

    it('should have descriptive aria-labels on all icon buttons', () => {
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

      // Check icon buttons specifically by their aria-labels
      const shareButton = screen.getByRole('button', { name: 'Share' });
      const videoButton = screen.getByRole('button', { name: 'Watch tutorial video' });
      const helpButton = screen.getByRole('button', { name: 'Help' });

      // All should have accessible names with proper length
      expect(shareButton).toHaveAccessibleName();
      expect(videoButton).toHaveAccessibleName();
      expect(helpButton).toHaveAccessibleName();

      // Verify aria-labels are descriptive
      expect(shareButton.getAttribute('aria-label').length).toBeGreaterThan(2);
      expect(videoButton.getAttribute('aria-label').length).toBeGreaterThan(2);
      expect(helpButton.getAttribute('aria-label').length).toBeGreaterThan(2);
    });
  });

  describe('Screen Reader Context and Semantic Structure', () => {
    it('should provide context for piano keys with note information', () => {
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
            note="D#4"
            keyColor="black"
            toneIsInScale={true}
            noteOnHandler={mockNoteOn}
            noteOffHandler={mockNoteOff}
            noteName={[{ key: 'English', value: 'D#' }]}
            pianoOn={false}
            isMouseDown={false}
          />
        </div>
      );

      const c4Key = screen.getByRole('button', { name: 'Play C4' });
      const dSharp4Key = screen.getByRole('button', { name: 'Play D#4' });

      // Verify aria-labels include note information
      expect(c4Key).toHaveAttribute('aria-label', 'Play C4');
      expect(dSharp4Key).toHaveAttribute('aria-label', 'Play D#4');
    });

    it('should maintain accessible names when components re-render', () => {
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
      expect(key).toHaveAccessibleName();

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

      const updatedKey = screen.getByRole('button', { name: 'Play C4' });
      expect(updatedKey).toHaveAccessibleName();
      expect(updatedKey).toHaveAttribute('aria-label', 'Play C4');
    });
  });
});
