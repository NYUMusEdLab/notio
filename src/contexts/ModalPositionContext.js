/**
 * Modal Position Context
 *
 * Provides modal position state and update functionality to components
 * without props drilling. Eliminates the 5-layer chain: WholeApp → TopMenu
 * → Button → Content → Overlay.
 *
 * Contract: specs/005-url-storage-completion/contracts/context-api.md
 * Tasks: T038, T039
 */

import React from 'react';

/**
 * @typedef {Object} ModalPosition
 * @property {number|null} x - X coordinate (null if not positioned)
 * @property {number|null} y - Y coordinate (null if not positioned)
 */

/**
 * @typedef {Object} ModalPositions
 * @property {ModalPosition} video - Video modal position
 * @property {ModalPosition} help - Help modal position
 * @property {ModalPosition} share - Share modal position
 */

/**
 * @typedef {Object} ModalPositionContextValue
 * @property {ModalPositions} positions - Current positions for all modals
 * @property {(modalName: string, position: ModalPosition) => void} updatePosition - Update a modal's position
 */

/**
 * ModalPositionContext
 *
 * Context for sharing modal position state across component tree.
 * Provides positions object and updatePosition function.
 *
 * IMPORTANT: This context has no default value. Components must be wrapped
 * with ModalPositionProvider to use this context.
 *
 * @type {React.Context<ModalPositionContextValue|undefined>}
 */
export const ModalPositionContext = React.createContext(undefined);

// Set display name for React DevTools
ModalPositionContext.displayName = 'ModalPositionContext';

/**
 * ModalPositionProvider
 *
 * Provider component that wraps the application and provides modal position
 * state to all descendants via context.
 *
 * @param {Object} props
 * @param {ModalPositionContextValue} props.value - Context value to provide
 * @param {React.ReactNode} props.children - Child components
 * @returns {React.ReactElement}
 *
 * @example
 * <ModalPositionProvider value={{ positions, updatePosition }}>
 *   <App />
 * </ModalPositionProvider>
 */
export function ModalPositionProvider({ value, children }) {
  return (
    <ModalPositionContext.Provider value={value}>
      {children}
    </ModalPositionContext.Provider>
  );
}

/**
 * Default export for convenient importing
 */
export default ModalPositionContext;
