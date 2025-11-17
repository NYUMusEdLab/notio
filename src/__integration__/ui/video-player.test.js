import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import VideoTutorial from '../../components/menu/VideoTutorial';

describe('Video Player Text (US6)', () => {
  const defaultProps = {
    videoUrl: 'https://www.youtube.com/watch?v=test',
    resetVideoUrl: 'https://www.youtube.com/watch?v=default',
    activeVideoTab: 'Enter_url',
    handleChangeVideoUrl: jest.fn(),
    handleChangeActiveVideoTab: jest.fn(),
    handleResetVideoUrl: jest.fn(),
    handleChangeVideoVisibility: jest.fn(),
    onClickCloseHandler: jest.fn(),
  };

  test('Instruction text should be correct and not mention YouTube', () => {
    render(<VideoTutorial {...defaultProps} />);

    // Check for the correct instruction text
    const instructionText = screen.getByText(/Enter the URL for any video or playlist you want to use with Notio, then press Enter/i);
    expect(instructionText).toBeInTheDocument();

    // Verify the instruction text specifically does NOT mention YouTube
    const instructionTextContent = instructionText.textContent;
    expect(instructionTextContent).not.toMatch(/youtube/i);
  });

  test('Status text should have correct spelling of "currently"', () => {
    render(<VideoTutorial {...defaultProps} />);

    // Check for correct spelling: "currently" not "curently"
    const statusText = screen.getByText(/You are currently watching:/i);
    expect(statusText).toBeInTheDocument();

    // Verify the typo does NOT exist
    expect(screen.queryByText(/curently/i)).not.toBeInTheDocument();
  });

  test('All instances of "URL" should be uppercase', () => {
    render(<VideoTutorial {...defaultProps} />);

    // Tab title should be "Enter URL" (uppercase)
    const tabButton = screen.getByRole('tab', { name: /Enter URL/i });
    expect(tabButton).toBeInTheDocument();

    // Form label should be "Video URL" (uppercase)
    const formLabel = screen.getByText(/Video URL/i);
    expect(formLabel).toBeInTheDocument();

    // Placeholder should reference "URL" in uppercase
    const urlInput = screen.getByPlaceholderText(/Enter URL/i);
    expect(urlInput).toBeInTheDocument();

    // Instruction text should use "URL" (uppercase)
    const instructionWithURL = screen.getByText(/Enter the URL for any/i);
    expect(instructionWithURL).toBeInTheDocument();
  });

  test('Instruction text should say "press Enter" not "hit Enter"', () => {
    render(<VideoTutorial {...defaultProps} />);

    // Should say "press Enter"
    const instructionText = screen.getByText(/then press Enter/i);
    expect(instructionText).toBeInTheDocument();

    // Should NOT say "hit Enter"
    expect(screen.queryByText(/hit Enter/i)).not.toBeInTheDocument();
  });

  test('Combined: All text corrections are applied', () => {
    render(<VideoTutorial {...defaultProps} />);

    // 1. Correct instruction text (no YouTube, uppercase URL, "press Enter")
    expect(screen.getByText(/Enter the URL for any video or playlist you want to use with Notio, then press Enter/i)).toBeInTheDocument();

    // 2. Correct spelling of "currently"
    expect(screen.getByText(/You are currently watching:/i)).toBeInTheDocument();

    // 3. All "URL" instances are uppercase
    expect(screen.getByRole('tab', { name: /Enter URL/i })).toBeInTheDocument();
    expect(screen.getByText(/Video URL/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Enter URL/i)).toBeInTheDocument();

    // 4. No typos or old text in instruction
    const instructionText = screen.getByText(/Enter the URL for any video or playlist/i);
    expect(instructionText.textContent).not.toMatch(/youtube/i);
    expect(screen.queryByText(/curently/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/hit Enter/i)).not.toBeInTheDocument();
  });
});

describe('Video Player Font Size (US7)', () => {
  const defaultProps = {
    videoUrl: 'https://www.youtube.com/watch?v=test',
    resetVideoUrl: 'https://www.youtube.com/watch?v=default',
    activeVideoTab: 'Enter_url',
    handleChangeVideoUrl: jest.fn(),
    handleChangeActiveVideoTab: jest.fn(),
    handleResetVideoUrl: jest.fn(),
    handleChangeVideoVisibility: jest.fn(),
    onClickCloseHandler: jest.fn(),
  };

  test('Instruction text has CSS class for font sizing', () => {
    render(<VideoTutorial {...defaultProps} />);

    // Verify the explainer text has the correct CSS class
    // The class will apply font-size: 18px in the browser
    const instructionText = screen.getByText(/Enter the URL for any video or playlist/i);
    expect(instructionText).toHaveClass('video-url__explainer');
  });

  test('Form label has CSS class for font sizing', () => {
    render(<VideoTutorial {...defaultProps} />);

    // Verify the title label has the correct CSS class
    // The class will apply font-size: 18px in the browser
    const labelText = screen.getByText(/Video URL/i);
    expect(labelText).toHaveClass('video-url__title');
  });

  test('Currently watching text has CSS class for font sizing', () => {
    render(<VideoTutorial {...defaultProps} />);

    // Verify the "currently watching" text has the correct CSS class
    // The class will apply font-size: 16px in the browser
    const watchingText = screen.getByText(/You are currently watching:/i);
    expect(watchingText).toHaveClass('video-url__currently-watching');
  });
});
