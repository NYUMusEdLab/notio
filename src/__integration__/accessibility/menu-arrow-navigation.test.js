/**
 * Integration Tests: Menu Arrow Key Navigation
 *
 * Purpose: Test arrow key navigation, Home/End keys, and circular wrapping in dropdown menus
 * Coverage: 60-70% (integration-first testing strategy per Constitution)
 *
 * Tests:
 * - T009-T017: Arrow key navigation workflow
 * - T063-T065: Home/End key navigation
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { axe, toHaveNoViolations } from 'jest-axe';
import SubMenu from '../../components/menu/SubMenu';
import ListRadio from '../../components/form/ListRadio';

expect.extend(toHaveNoViolations);

describe('Menu Arrow Key Navigation Integration Tests', () => {
  const mockHandleChange = jest.fn();
  const mockSetTitle = jest.fn();
  const mockSetImage = jest.fn();

  const scaleData = [
    { name: 'Major', label: 'Major' },
    { name: 'Minor', label: 'Minor' },
    { name: 'Dorian', label: 'Dorian' },
    { name: 'Phrygian', label: 'Phrygian' },
    { name: 'Lydian', label: 'Lydian' }
  ];

  const menuContent = (
    <div className="items-list">
      <ListRadio
        nameField="scale"
        data={scaleData}
        initOption="Major"
        handleChange={mockHandleChange}
        setTitle={mockSetTitle}
      />
    </div>
  );

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('T009-T011: Arrow Down Navigation', () => {
    it('should move focus to first menu item when Arrow Down pressed from trigger', async () => {
      const { container } = render(
        <SubMenu
          title="Scale Selection"
          selected="Major"
          active={false}
          content={menuContent}
        />
      );

      // Find and click the trigger to open menu
      const trigger = screen.getByRole('button', { name: 'Scale Selection' });
      fireEvent.click(trigger);

      // Wait for menu to open and items to be rendered
      await waitFor(() => {
        const menuItems = screen.getAllByRole('menuitemradio');
        expect(menuItems.length).toBeGreaterThan(0);
      }, { timeout: 2000 });

      // Get the menu container
      const menuContainer = screen.getByRole('menu');

      // Press Arrow Down on the menu container (simulating keyboard navigation in the menu)
      fireEvent.keyDown(menuContainer, { key: 'ArrowDown', code: 'ArrowDown' });

      // First menu item should now have focus
      await waitFor(() => {
        const menuItems = screen.getAllByRole('menuitemradio');
        expect(menuItems[0]).toHaveFocus();
      }, { timeout: 2000 });
    });

    it('should navigate to next menu item when Arrow Down pressed', async () => {
      const { container } = render(
        <SubMenu
          title="Scale Selection"
          selected="Major"
          active={false}
          content={menuContent}
        />
      );

      const trigger = screen.getByRole('button', { name: 'Scale Selection' });
      fireEvent.click(trigger);

      await waitFor(() => {
        const menuItems = screen.getAllByRole('menuitemradio');
        expect(menuItems.length).toBeGreaterThan(0);
      });

      // Navigate to first item
      fireEvent.keyDown(trigger, { key: 'ArrowDown' });

      const menuItems = screen.getAllByRole('menuitemradio');
      await waitFor(() => expect(menuItems[0]).toHaveFocus());

      // Navigate to second item
      fireEvent.keyDown(menuItems[0], { key: 'ArrowDown' });

      await waitFor(() => expect(menuItems[1]).toHaveFocus());
    });

    it('should wrap to first item when Arrow Down pressed on last item', async () => {
      render(
        <SubMenu
          title="Scale Selection"
          selected="Major"
          active={false}
          content={menuContent}
        />
      );

      const trigger = screen.getByRole('button', { name: 'Scale Selection' });
      fireEvent.click(trigger);

      await waitFor(() => {
        const menuItems = screen.getAllByRole('menuitemradio');
        expect(menuItems.length).toBeGreaterThan(0);
      });

      const menuItems = screen.getAllByRole('menuitemradio');
      const lastItem = menuItems[menuItems.length - 1];

      // Focus last item
      lastItem.focus();
      expect(lastItem).toHaveFocus();

      // Press Arrow Down on last item (should wrap to first)
      fireEvent.keyDown(lastItem, { key: 'ArrowDown' });

      await waitFor(() => expect(menuItems[0]).toHaveFocus());
    });
  });

  describe('T012-T014: Arrow Up Navigation', () => {
    it('should move focus to first menu item when Arrow Up pressed from trigger', async () => {
      render(
        <SubMenu
          title="Scale Selection"
          selected="Major"
          active={false}
          content={menuContent}
        />
      );

      const trigger = screen.getByRole('button', { name: 'Scale Selection' });
      fireEvent.click(trigger);

      await waitFor(() => {
        const menuItems = screen.getAllByRole('menuitemradio');
        expect(menuItems.length).toBeGreaterThan(0);
      });

      // Press Arrow Up from trigger (should go to first item, not last)
      fireEvent.keyDown(trigger, { key: 'ArrowUp', code: 'ArrowUp' });

      const menuItems = screen.getAllByRole('menuitemradio');
      await waitFor(() => expect(menuItems[0]).toHaveFocus());
    });

    it('should navigate to previous menu item when Arrow Up pressed', async () => {
      render(
        <SubMenu
          title="Scale Selection"
          selected="Major"
          active={false}
          content={menuContent}
        />
      );

      const trigger = screen.getByRole('button', { name: 'Scale Selection' });
      fireEvent.click(trigger);

      await waitFor(() => {
        const menuItems = screen.getAllByRole('menuitemradio');
        expect(menuItems.length).toBeGreaterThan(0);
      });

      const menuItems = screen.getAllByRole('menuitemradio');

      // Focus second item
      menuItems[1].focus();
      expect(menuItems[1]).toHaveFocus();

      // Navigate to first item
      fireEvent.keyDown(menuItems[1], { key: 'ArrowUp' });

      await waitFor(() => expect(menuItems[0]).toHaveFocus());
    });

    it('should wrap to last item when Arrow Up pressed on first item', async () => {
      render(
        <SubMenu
          title="Scale Selection"
          selected="Major"
          active={false}
          content={menuContent}
        />
      );

      const trigger = screen.getByRole('button', { name: 'Scale Selection' });
      fireEvent.click(trigger);

      await waitFor(() => {
        const menuItems = screen.getAllByRole('menuitemradio');
        expect(menuItems.length).toBeGreaterThan(0);
      });

      const menuItems = screen.getAllByRole('menuitemradio');

      // Focus first item
      menuItems[0].focus();
      expect(menuItems[0]).toHaveFocus();

      // Press Arrow Up on first item (should wrap to last)
      fireEvent.keyDown(menuItems[0], { key: 'ArrowUp' });

      await waitFor(() => expect(menuItems[menuItems.length - 1]).toHaveFocus());
    });
  });

  describe('T063-T065: Home/End Key Navigation', () => {
    it('should jump to first menu item when Home key pressed', async () => {
      render(
        <SubMenu
          title="Scale Selection"
          selected="Major"
          active={false}
          content={menuContent}
        />
      );

      const trigger = screen.getByRole('button', { name: 'Scale Selection' });
      fireEvent.click(trigger);

      await waitFor(() => {
        const menuItems = screen.getAllByRole('menuitemradio');
        expect(menuItems.length).toBeGreaterThan(0);
      });

      const menuItems = screen.getAllByRole('menuitemradio');

      // Focus middle item
      const middleItem = menuItems[Math.floor(menuItems.length / 2)];
      middleItem.focus();
      expect(middleItem).toHaveFocus();

      // Press Home key
      fireEvent.keyDown(middleItem, { key: 'Home' });

      await waitFor(() => expect(menuItems[0]).toHaveFocus());
    });

    it('should jump to last menu item when End key pressed', async () => {
      render(
        <SubMenu
          title="Scale Selection"
          selected="Major"
          active={false}
          content={menuContent}
        />
      );

      const trigger = screen.getByRole('button', { name: 'Scale Selection' });
      fireEvent.click(trigger);

      await waitFor(() => {
        const menuItems = screen.getAllByRole('menuitemradio');
        expect(menuItems.length).toBeGreaterThan(0);
      });

      const menuItems = screen.getAllByRole('menuitemradio');

      // Focus first item
      menuItems[0].focus();
      expect(menuItems[0]).toHaveFocus();

      // Press End key
      fireEvent.keyDown(menuItems[0], { key: 'End' });

      await waitFor(() => expect(menuItems[menuItems.length - 1]).toHaveFocus());
    });
  });

  describe('T015: Escape Key Behavior', () => {
    it('should close menu and restore focus to trigger when Escape pressed', async () => {
      render(
        <SubMenu
          title="Scale Selection"
          selected="Major"
          active={false}
          content={menuContent}
        />
      );

      const trigger = screen.getByRole('button', { name: 'Scale Selection' });
      fireEvent.click(trigger);

      await waitFor(() => {
        const menuItems = screen.getAllByRole('menuitemradio');
        expect(menuItems.length).toBeGreaterThan(0);
      });

      // Navigate to a menu item
      fireEvent.keyDown(trigger, { key: 'ArrowDown' });

      const menuItems = screen.getAllByRole('menuitemradio');
      await waitFor(() => expect(menuItems[0]).toHaveFocus());

      // Press Escape
      fireEvent.keyDown(menuItems[0], { key: 'Escape' });

      // Focus should return to trigger
      await waitFor(() => expect(trigger).toHaveFocus());
    });
  });

  describe('T016: Tab Key Behavior', () => {
    it('should allow Tab to move focus out of menu while menu stays open', async () => {
      render(
        <div>
          <SubMenu
            title="Scale Selection"
            selected="Major"
            active={false}
            content={menuContent}
          />
          <button>Next Element</button>
        </div>
      );

      const trigger = screen.getByRole('button', { name: 'Scale Selection' });
      fireEvent.click(trigger);

      await waitFor(() => {
        const menuItems = screen.getAllByRole('menuitemradio');
        expect(menuItems.length).toBeGreaterThan(0);
      });

      // Navigate to a menu item
      fireEvent.keyDown(trigger, { key: 'ArrowDown' });

      const menuItems = screen.getAllByRole('menuitemradio');
      await waitFor(() => expect(menuItems[0]).toHaveFocus());

      // Press Tab (should allow default behavior)
      fireEvent.keyDown(menuItems[0], { key: 'Tab' });

      // Menu should still be visible (not testing focus movement as that's browser-specific)
      expect(screen.getByRole('menu')).toBeInTheDocument();
    });
  });

  describe('Accessibility Compliance', () => {
    it('should have no axe accessibility violations', async () => {
      const { container } = render(
        <SubMenu
          title="Scale Selection"
          selected="Major"
          active={false}
          content={menuContent}
        />
      );

      const trigger = screen.getByRole('button', { name: 'Scale Selection' });
      fireEvent.click(trigger);

      await waitFor(() => {
        const menuItems = screen.getAllByRole('menuitemradio');
        expect(menuItems.length).toBeGreaterThan(0);
      });

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should have correct ARIA attributes on trigger', () => {
      render(
        <SubMenu
          title="Scale Selection"
          selected="Major"
          active={false}
          content={menuContent}
        />
      );

      const trigger = screen.getByRole('button', { name: 'Scale Selection' });
      expect(trigger).toHaveAttribute('aria-label', 'Scale Selection');
      expect(trigger).toHaveAttribute('aria-expanded');
    });

    it('should have correct ARIA attributes on menu and menu items', async () => {
      render(
        <SubMenu
          title="Scale Selection"
          selected="Major"
          active={false}
          content={menuContent}
        />
      );

      const trigger = screen.getByRole('button', { name: 'Scale Selection' });
      fireEvent.click(trigger);

      await waitFor(() => {
        const menu = screen.getByRole('menu');
        expect(menu).toBeInTheDocument();
      });

      const menuItems = screen.getAllByRole('menuitemradio');
      menuItems.forEach(item => {
        expect(item).toHaveAttribute('aria-checked');
        expect(item).toHaveAttribute('tabIndex', '-1');
      });
    });
  });
});
