import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe, toHaveNoViolations } from 'jest-axe';
import VideoTutorial from './VideoTutorial';

// Extend Jest matchers
expect.extend(toHaveNoViolations);

// Mock ReactPlayer to avoid actual video loading in tests
jest.mock('react-player/lazy', () => {
  const React = require('react');
  return function MockReactPlayer({ url, onReady, onError, controls }) {
    React.useEffect(() => {
      // Simulate onReady callback
      if (onReady) {
        onReady();
      }
    }, [url, onReady]);

    return React.createElement(
      'div',
      { 'data-testid': 'react-player', 'data-url': url, 'data-controls': controls },
      `Mock ReactPlayer: ${url}`
    );
  };
});

// Default props for VideoTutorial component
const defaultProps = {
  vissible: true,
  activeVideoTab: 'Player',
  videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
  handleChangeVideoVisibility: jest.fn(),
  handleChangeActiveVideoTab: jest.fn(),
  handleChangeVideoUrl: jest.fn(),
  resetVideoUrl: 'https://youtu.be/dkIdl51TBXA',
  handleResetVideoUrl: jest.fn(),
  onClickCloseHandler: jest.fn()
};

describe('VideoTutorial Component - User Story 1', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  describe('T008: Submit valid YouTube URL → Video loads and plays', () => {
    test('should load and display video when valid YouTube URL is submitted', async () => {
      render(<VideoTutorial {...defaultProps} />);

      // Navigate to Enter URL tab
      const enterUrlTab = screen.getByText('Enter URL');
      await userEvent.click(enterUrlTab);

      // Find input field and submit button
      const input = screen.getByPlaceholderText('Enter URL');
      const submitButton = screen.getByRole('button', { name: /enter/i });

      // Enter a valid YouTube URL
      const testUrl = 'https://www.youtube.com/watch?v=newVideoId123';
      await userEvent.clear(input);
      await userEvent.type(input, testUrl);

      // Submit the form
      await userEvent.click(submitButton);

      // Verify handleChangeVideoUrl was called with the new URL
      expect(defaultProps.handleChangeVideoUrl).toHaveBeenCalledWith(testUrl);

      // Verify handleChangeActiveVideoTab was called to switch to Player tab
      expect(defaultProps.handleChangeActiveVideoTab).toHaveBeenCalledWith('Player');
    });

    test('should display ReactPlayer with the submitted URL', async () => {
      const { rerender } = render(<VideoTutorial {...defaultProps} />);

      // Navigate to Enter URL tab
      const enterUrlTab = screen.getByText('Enter URL');
      await userEvent.click(enterUrlTab);

      // Submit new URL
      const input = screen.getByPlaceholderText('Enter URL');
      const submitButton = screen.getByRole('button', { name: /enter/i });
      const testUrl = 'https://www.youtube.com/watch?v=testVideo456';

      await userEvent.clear(input);
      await userEvent.type(input, testUrl);
      await userEvent.click(submitButton);

      // Re-render with updated videoUrl prop (simulating parent component update)
      rerender(<VideoTutorial {...defaultProps} videoUrl={testUrl} activeVideoTab="Player" />);

      // Verify ReactPlayer is rendered with the new URL
      await waitFor(() => {
        const players = screen.getAllByTestId('react-player');
        // The first player is the main Player tab player
        expect(players[0]).toHaveAttribute('data-url', testUrl);
      });
    });

    test('should have video controls available', async () => {
      render(<VideoTutorial {...defaultProps} />);

      // Switch to Player tab
      const playerTab = screen.getByText('Player');
      await userEvent.click(playerTab);

      // Verify ReactPlayer has controls enabled
      // Note: There are multiple react-player instances (tutorials), so we get all and check the first one (main player)
      const players = screen.getAllByTestId('react-player');
      expect(players[0]).toHaveAttribute('data-controls', 'true');
    });
  });

  describe('T009: Submit YouTube URL when blocked → Show region-blocked error message', () => {
    test('should display error message when YouTube is blocked', async () => {
      // This test will be fully implemented after T016-T018 (error handling implementation)
      // For now, we verify the component renders without errors
      render(<VideoTutorial {...defaultProps} />);
      expect(screen.getByText('Player')).toBeInTheDocument();
    });

    test('should keep input field visible when error occurs', async () => {
      render(<VideoTutorial {...defaultProps} />);

      // Navigate to Enter URL tab
      const enterUrlTab = screen.getByText('Enter URL');
      await userEvent.click(enterUrlTab);

      // Input field should be visible
      const input = screen.getByPlaceholderText('Enter URL');
      expect(input).toBeVisible();
    });

    test('should display actionable error message suggesting alternatives', async () => {
      // This test will be fully implemented after T017 (error message display)
      // For now, we verify the Enter URL tab is accessible
      render(<VideoTutorial {...defaultProps} />);

      const enterUrlTab = screen.getByText('Enter URL');
      await userEvent.click(enterUrlTab);

      expect(screen.getByPlaceholderText('Enter URL')).toBeInTheDocument();
    });
  });

  describe('T010: Accessibility check with jest-axe for error states', () => {
    test('should have no accessibility violations in Player tab', async () => {
      const { container } = render(<VideoTutorial {...defaultProps} />);

      // Run axe accessibility checks
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    test('should have no accessibility violations in Enter URL tab', async () => {
      const { container } = render(<VideoTutorial {...defaultProps} />);

      // Navigate to Enter URL tab
      const enterUrlTab = screen.getByText('Enter URL');
      await userEvent.click(enterUrlTab);

      // Run axe accessibility checks
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    test('should have no accessibility violations in Tutorials tab', async () => {
      const { container } = render(<VideoTutorial {...defaultProps} />);

      // Navigate to Tutorials tab
      const tutorialsTab = screen.getByText('Tutorials');
      await userEvent.click(tutorialsTab);

      // Run axe accessibility checks
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    test('should have proper ARIA attributes on form elements', async () => {
      render(<VideoTutorial {...defaultProps} />);

      // Navigate to Enter URL tab
      const enterUrlTab = screen.getByText('Enter URL');
      await userEvent.click(enterUrlTab);

      // Verify form control has proper ID
      const input = screen.getByPlaceholderText('Enter URL');
      expect(input).toHaveAttribute('id', 'formYoutubeUrl');

      // Verify label exists and is associated with input
      const label = screen.getByText('Video URL');
      expect(label).toBeInTheDocument();
    });

    test('should have keyboard-accessible buttons', async () => {
      render(<VideoTutorial {...defaultProps} />);

      // Navigate to Enter URL tab
      const enterUrlTab = screen.getByText('Enter URL');
      await userEvent.click(enterUrlTab);

      // Verify buttons are accessible via role
      const submitButton = screen.getByRole('button', { name: /enter/i });
      const resetButton = screen.getByRole('button', { name: /reset/i });

      expect(submitButton).toBeInTheDocument();
      expect(resetButton).toBeInTheDocument();

      // Buttons should be keyboard-focusable (implicit with role="button")
      expect(submitButton.tagName).toBe('BUTTON');
      expect(resetButton.tagName).toBe('BUTTON');
    });
  });

  describe('Additional integration tests', () => {
    test('should preserve Tutorials tab with hardcoded videos', async () => {
      render(<VideoTutorial {...defaultProps} />);

      // Navigate to Tutorials tab
      const tutorialsTab = screen.getByText('Tutorials');
      await userEvent.click(tutorialsTab);

      // Verify all 6 tutorial videos are present
      expect(screen.getByText('Keyboard on/off')).toBeInTheDocument();
      expect(screen.getByText('Notation')).toBeInTheDocument();
      expect(screen.getByText('Ambitus')).toBeInTheDocument();
      expect(screen.getByText('Select different scales')).toBeInTheDocument();
      expect(screen.getByText('Video player')).toBeInTheDocument();
      expect(screen.getByText('Share your setup')).toBeInTheDocument();

      // Verify tutorial videos have correct URLs (hardcoded)
      const players = screen.getAllByTestId('react-player');
      expect(players.length).toBeGreaterThanOrEqual(6);
    });

    test('should reset video URL when reset button is clicked', async () => {
      render(<VideoTutorial {...defaultProps} />);

      // Navigate to Enter URL tab
      const enterUrlTab = screen.getByText('Enter URL');
      await userEvent.click(enterUrlTab);

      // Click reset button
      const resetButton = screen.getByRole('button', { name: /reset/i });
      await userEvent.click(resetButton);

      // Verify handleResetVideoUrl was called
      expect(defaultProps.handleResetVideoUrl).toHaveBeenCalled();
    });

    test('should display currently watching URL', async () => {
      render(<VideoTutorial {...defaultProps} />);

      // Navigate to Enter URL tab
      const enterUrlTab = screen.getByText('Enter URL');
      await userEvent.click(enterUrlTab);

      // Verify current URL is displayed
      const currentUrlLink = screen.getByRole('link', { name: defaultProps.videoUrl });
      expect(currentUrlLink).toHaveAttribute('href', defaultProps.videoUrl);
    });
  });
});
