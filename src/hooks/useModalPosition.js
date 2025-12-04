/**
 * useModalPosition Hook
 *
 * Custom hook for accessing modal position context in functional components.
 * Wraps useContext(ModalPositionContext) with error handling.
 *
 * Contract: specs/005-url-storage-completion/contracts/context-api.md
 * Tasks: T040, T041
 */

import { useContext } from 'react';
import { ModalPositionContext } from '../contexts/ModalPositionContext';

/**
 * useModalPosition
 *
 * Hook to access modal position state and update function from context.
 * Throws an error if used outside of ModalPositionProvider.
 *
 * @returns {import('../contexts/ModalPositionContext').ModalPositionContextValue}
 * @throws {Error} When used outside ModalPositionProvider
 *
 * @example
 * function MyModal({ modalName }) {
 *   const { positions, updatePosition } = useModalPosition();
 *   const position = positions[modalName];
 *
 *   const handleDragStop = (newPosition) => {
 *     updatePosition(modalName, newPosition);
 *   };
 *
 *   return <div style={{ transform: `translate(${position.x}px, ${position.y}px)` }}>...</div>;
 * }
 */
export function useModalPosition() {
  const context = useContext(ModalPositionContext);

  // Error handling: Ensure hook is used within provider
  if (context === undefined) {
    throw new Error(
      'useModalPosition must be used within a ModalPositionProvider. ' +
      'Wrap your component tree with <ModalPositionProvider> in WholeApp.js.'
    );
  }

  // Additional validation: Check if context has expected shape
  // This catches cases where context exists but doesn't have the required structure
  if (!context.positions || typeof context.updatePosition !== 'function') {
    throw new Error(
      'useModalPosition: Invalid context value. ' +
      'Expected { positions: {...}, updatePosition: function }, ' +
      `but received: ${JSON.stringify(context)}`
    );
  }

  return context;
}

/**
 * Default export for convenient importing
 */
export default useModalPosition;
