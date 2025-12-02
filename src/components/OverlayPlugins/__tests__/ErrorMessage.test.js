/**
 * Integration tests for ErrorMessage component
 *
 * Tests rendering, accessibility, and error display functionality
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import ErrorMessage from '../ErrorMessage';

// Extend Jest matchers
expect.extend(toHaveNoViolations);

describe('ErrorMessage Component', () => {
  test('does not render when no errors', () => {
    const { container } = render(<ErrorMessage errors={[]} />);
    expect(container.firstChild).toBeNull();
  });

  test('does not render when errors is undefined', () => {
    const { container } = render(<ErrorMessage />);
    expect(container.firstChild).toBeNull();
  });

  test('renders single error message', () => {
    render(<ErrorMessage errors={['Invalid octave value']} />);

    expect(screen.getByText('Invalid octave value')).toBeInTheDocument();
  });

  test('renders multiple error messages', () => {
    const errors = [
      'Invalid octave value',
      'Invalid video URL',
      'Invalid custom scale'
    ];

    render(<ErrorMessage errors={errors} />);

    errors.forEach(error => {
      expect(screen.getByText(error)).toBeInTheDocument();
    });
  });

  test('renders with custom title', () => {
    render(
      <ErrorMessage
        errors={['Test error']}
        title="Configuration Errors"
      />
    );

    expect(screen.getByText('Configuration Errors')).toBeInTheDocument();
  });

  test('renders with default title', () => {
    render(<ErrorMessage errors={['Test error']} />);

    expect(screen.getByText('Errors')).toBeInTheDocument();
  });

  test('renders without title when title prop is empty', () => {
    render(<ErrorMessage errors={['Test error']} title="" />);

    expect(screen.queryByRole('heading')).not.toBeInTheDocument();
  });

  test('applies custom className', () => {
    const { container } = render(
      <ErrorMessage errors={['Test error']} className="custom-error" />
    );

    const errorDiv = container.querySelector('.error-message');
    expect(errorDiv).toHaveClass('custom-error');
  });

  test('renders errors as list items', () => {
    const errors = ['Error 1', 'Error 2', 'Error 3'];
    render(<ErrorMessage errors={errors} />);

    const listItems = screen.getAllByRole('listitem');
    expect(listItems).toHaveLength(3);
  });

  describe('Accessibility', () => {
    test('has role="alert" for screen readers', () => {
      render(<ErrorMessage errors={['Test error']} />);

      const errorContainer = screen.getByRole('alert');
      expect(errorContainer).toBeInTheDocument();
    });

    test('has aria-live="polite" for announcements', () => {
      const { container } = render(<ErrorMessage errors={['Test error']} />);

      const errorDiv = container.querySelector('.error-message');
      expect(errorDiv).toHaveAttribute('aria-live', 'polite');
    });

    test('has aria-atomic="true" for complete message reading', () => {
      const { container } = render(<ErrorMessage errors={['Test error']} />);

      const errorDiv = container.querySelector('.error-message');
      expect(errorDiv).toHaveAttribute('aria-atomic', 'true');
    });

    test('passes axe accessibility audit', async () => {
      const { container } = render(
        <ErrorMessage
          errors={['Error 1', 'Error 2', 'Error 3']}
          title="Validation Errors"
        />
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    test('passes axe audit with multiple errors', async () => {
      const errors = Array.from({ length: 10 }, (_, i) => `Error ${i + 1}`);
      const { container } = render(<ErrorMessage errors={errors} />);

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    test('title is properly associated with content', () => {
      render(
        <ErrorMessage errors={['Test error']} title="Configuration Errors" />
      );

      const heading = screen.getByRole('heading', { name: 'Configuration Errors' });
      expect(heading).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    test('handles empty string errors gracefully', () => {
      render(<ErrorMessage errors={['Valid error', '', 'Another error']} />);

      const listItems = screen.getAllByRole('listitem');
      expect(listItems).toHaveLength(3);
    });

    test('handles very long error messages', () => {
      const longError = 'a'.repeat(500);
      render(<ErrorMessage errors={[longError]} />);

      expect(screen.getByText(longError)).toBeInTheDocument();
    });

    test('handles special characters in error messages', () => {
      const errors = [
        'Error with <html> tags',
        'Error with & ampersand',
        'Error with "quotes"',
        "Error with 'apostrophes'"
      ];

      render(<ErrorMessage errors={errors} />);

      errors.forEach(error => {
        expect(screen.getByText(error)).toBeInTheDocument();
      });
    });

    test('re-renders when errors change', () => {
      const { rerender } = render(<ErrorMessage errors={['Error 1']} />);

      expect(screen.getByText('Error 1')).toBeInTheDocument();

      rerender(<ErrorMessage errors={['Error 2', 'Error 3']} />);

      expect(screen.queryByText('Error 1')).not.toBeInTheDocument();
      expect(screen.getByText('Error 2')).toBeInTheDocument();
      expect(screen.getByText('Error 3')).toBeInTheDocument();
    });

    test('removes component when errors are cleared', () => {
      const { rerender, container } = render(
        <ErrorMessage errors={['Error 1']} />
      );

      expect(screen.getByText('Error 1')).toBeInTheDocument();

      rerender(<ErrorMessage errors={[]} />);

      expect(container.firstChild).toBeNull();
    });
  });
});
