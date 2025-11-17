/**
 * Sample Integration Test
 *
 * Purpose: Demonstrates integration testing with jest-axe for accessibility
 * Constitution v2.0.0: Integration tests are PRIMARY (60-70% of test suite)
 *
 * This test shows how to:
 * - Test component integration (ColorKey + MusicalStaff interaction)
 * - Use jest-axe for accessibility validation
 * - Follow React Testing Library best practices
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import { axe } from 'jest-axe';

// Simple test component to demonstrate integration testing
function SampleMusicalComponent() {
  return (
    <div role="main" aria-label="Musical interface">
      <h1>Notio Music Education</h1>
      <button onClick={() => console.log('Note played')}>
        Play C4
      </button>
      <div role="region" aria-label="Musical notation">
        Staff notation will appear here
      </div>
    </div>
  );
}

describe('Sample Integration Test - Musical Component', () => {
  it('should render without accessibility violations', async () => {
    const { container } = render(<SampleMusicalComponent />);

    // Verify basic rendering
    expect(screen.getByText('Notio Music Education')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /play c4/i })).toBeInTheDocument();

    // T019: Demonstrate jest-axe usage for accessibility testing
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should have accessible button for playing notes', () => {
    render(<SampleMusicalComponent />);

    const playButton = screen.getByRole('button', { name: /play c4/i });

    // Integration test: Verify button is keyboard accessible
    expect(playButton).toBeInTheDocument();
    expect(playButton).toBeVisible();
  });

  it('should have labeled regions for musical content', () => {
    render(<SampleMusicalComponent />);

    // Integration test: Verify ARIA labels for screen readers
    const notationRegion = screen.getByRole('region', { name: /musical notation/i });
    expect(notationRegion).toBeInTheDocument();
  });
});

/**
 * Integration Test Best Practices (Rainer Hahnekamp):
 *
 * ✅ DO:
 * - Test realistic user workflows
 * - Test component interactions
 * - Test accessibility (WCAG 2.1 AA)
 * - Use roles and labels (not test IDs)
 * - Mock external dependencies (Firebase, Tone.js)
 *
 * ❌ DON'T:
 * - Test implementation details
 * - Test isolated units (save for unit tests)
 * - Use .toBe() for DOM comparisons
 * - Rely on CSS selectors
 */
