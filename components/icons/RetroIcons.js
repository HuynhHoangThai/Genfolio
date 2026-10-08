/**
 * Nintendo 2001 Retro Console Design System Icons
 * Derived from references/nintendo-2001/DESIGN.md
 * 
 * Aesthetic:
 * - Injection-molded hardware shapes, chamfered 45° cuts, sharp edges (rounded.xs / 2px)
 * - Industrial console hardware motifs: Game Boy Advance cartridges, GameCube memory cards,
 *   link cable ports, and tactile silicon controller buttons.
 * - Colors inherit currentColor or default to Nintendo 2001 palette tokens:
 *   #21242e (carbon), #3d4f97 (chrome-indigo), #ecab37 (amber), #f68d1f (signal), #e60012 (brand red).
 */

import React from "react";

/**
 * SaveCartridgeIcon
 * Represents a Nintendo Game Boy Advance cartridge / GameCube Memory Card with
 * top grip ridges, label window, and bottom contact pins.
 */
export function SaveCartridgeIcon({ className = "w-3.5 h-3.5", ...props }) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      className={`inline-block shrink-0 ${className}`}
      aria-hidden="true"
      {...props}
    >
      {/* Outer Cartridge Body with chamfered top-right & top-left shoulders */}
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M3 1H11L14 4V14C14 14.5523 13.5523 15 13 15H3C2.44772 15 2 14.5523 2 14V2C2 1.44772 2.44772 1 3 1ZM4 3V6H10V3H4ZM4 8H12V13H4V8Z"
      />
      {/* Top cartridge grip notch */}
      <rect x="5" y="4" width="4" height="1" fill="#ecab37" />
    </svg>
  );
}

/**
 * ShareLinkIcon
 * Nintendo GBA Link Cable / Beam transfer node motif.
 * Two data terminals bridged by a high-speed console serial bus.
 */
export function ShareLinkIcon({ className = "w-3.5 h-3.5", ...props }) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      className={`inline-block shrink-0 ${className}`}
      aria-hidden="true"
      {...props}
    >
      {/* Node 1 - Source Terminal */}
      <rect x="2" y="2" width="4" height="4" rx="0.5" />
      {/* Node 2 - Destination Terminal */}
      <rect x="10" y="2" width="4" height="4" rx="0.5" />
      {/* Node 3 - Hub Terminal */}
      <rect x="6" y="10" width="4" height="4" rx="0.5" />
      {/* Serial Cable Circuit Traces */}
      <path
        d="M4 6V8H7V10H9V8H12V6H10V7H6V6H4Z"
        fill="currentColor"
        opacity="0.85"
      />
    </svg>
  );
}

/**
 * FolderArchiveIcon
 * Cartridge Library & Memory Bank slot storage case.
 */
export function FolderArchiveIcon({ className = "w-3.5 h-3.5", ...props }) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      className={`inline-block shrink-0 ${className}`}
      aria-hidden="true"
      {...props}
    >
      {/* Tab and Main Drawer Body */}
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M1 2.5C1 1.94772 1.44772 1.5 2 1.5H6.29289C6.55812 1.5 6.81249 1.60536 7 1.79289L8.70711 3.5H14C14.5523 3.5 15 3.94772 15 4.5V13.5C15 14.0523 14.5523 14.5 14 14.5H2C1.44772 14.5 1 14.0523 1 13.5V2.5ZM3 5.5H13V12.5H3V5.5Z"
      />
      {/* Cartridge slot index plate */}
      <rect x="5" y="7.5" width="6" height="1.5" fill="#f68d1f" />
    </svg>
  );
}

/**
 * RetroCopyIcon
 * Dual data block cloner - duplicate memory pak blocks.
 */
export function RetroCopyIcon({ className = "w-3.5 h-3.5", ...props }) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      className={`inline-block shrink-0 ${className}`}
      aria-hidden="true"
      {...props}
    >
      <rect x="5" y="1" width="9" height="10" rx="0.5" fill="none" stroke="currentColor" strokeWidth="1.75" />
      <path
        d="M2 5V14C2 14.5523 2.44772 15 3 15H11"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="square"
      />
    </svg>
  );
}

/**
 * RetroCheckIcon
 * Chiseled console tick mark.
 */
export function RetroCheckIcon({ className = "w-3.5 h-3.5", ...props }) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      className={`inline-block shrink-0 ${className}`}
      aria-hidden="true"
      {...props}
    >
      <path
        d="M13.854 3.646a.5.5 0 0 1 0 .708l-7.5 7.5a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6 11.293l7.146-7.147a.5.5 0 0 1 .708 0z"
        stroke="currentColor"
        strokeWidth="0.8"
      />
    </svg>
  );
}

/**
 * RetroCloseIcon
 * Chiseled 'X' Cancel action button.
 */
export function RetroCloseIcon({ className = "w-3 h-3", ...props }) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      className={`inline-block shrink-0 ${className}`}
      aria-hidden="true"
      {...props}
    >
      <path
        d="M3.293 2.293a1 1 0 0 1 1.414 0L8 5.586l3.293-3.293a1 1 0 1 1 1.414 1.414L9.414 7l3.293 3.293a1 1 0 0 1-1.414 1.414L8 8.414l-3.293 3.293a1 1 0 0 1-1.414-1.414L6.586 7 3.293 3.707a1 1 0 0 1 0-1.414z"
      />
    </svg>
  );
}

/**
 * RetroLightningIcon
 * Power Indicator / Battery LED / Quick Dev Mode.
 */
export function RetroLightningIcon({ className = "w-3.5 h-3.5", ...props }) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      className={`inline-block shrink-0 ${className}`}
      aria-hidden="true"
      {...props}
    >
      <path d="M8.5 1L2 9H8L7.5 15L14 7H8L8.5 1Z" />
    </svg>
  );
}

/**
 * RetroStarIcon
 * Nintendo Official Seal of Quality 5-point star.
 */
export function RetroStarIcon({ className = "w-2.5 h-2.5", ...props }) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      className={`inline-block shrink-0 ${className}`}
      aria-hidden="true"
      {...props}
    >
      <path d="M8 0.5L10.3 5.5L15.5 6.2L11.7 10L12.6 15.5L8 12.8L3.4 15.5L4.3 10L0.5 6.2L5.7 5.5L8 0.5Z" />
    </svg>
  );
}

/**
 * RetroSignalChevron
 * Nintendo 2001 button-arrow-chip style forward indicator.
 */
export function RetroSignalChevron({ className = "w-2.5 h-2.5", ...props }) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      className={`inline-block shrink-0 ${className}`}
      aria-hidden="true"
      {...props}
    >
      <path d="M5 2L11 8L5 14V2Z" />
    </svg>
  );
}

/**
 * RetroSocialTwitterIcon
 * Clean retro-styled vector mark for X / Twitter.
 */
export function RetroSocialTwitterIcon({ className = "w-3.5 h-3.5", ...props }) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      className={`inline-block shrink-0 ${className}`}
      aria-hidden="true"
      {...props}
    >
      <path d="M12.6 1H10.1L6.7 5.7L3.1 1H0.5L5.4 7.2L0.3 14.5H2.8L6.4 9.4L10.3 14.5H12.9L7.8 7.9L12.6 1ZM9.2 12.8L2.2 2.6H3.8L10.8 12.8H9.2Z" />
    </svg>
  );
}

/**
 * RetroSocialLinkedInIcon
 * Clean retro-styled vector badge for LinkedIn.
 */
export function RetroSocialLinkedInIcon({ className = "w-3.5 h-3.5", ...props }) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      className={`inline-block shrink-0 ${className}`}
      aria-hidden="true"
      {...props}
    >
      <path d="M1 2C1 1.45 1.45 1 2 1H14C14.55 1 15 1.45 15 2V14C15 14.55 14.55 15 14 15H2C1.45 15 1 14.55 1 14V2ZM5.2 6H3V13H5.2V6ZM4.1 3.2C3.4 3.2 2.9 3.7 2.9 4.4C2.9 5.1 3.4 5.6 4.1 5.6C4.8 5.6 5.3 5.1 5.3 4.4C5.3 3.7 4.8 3.2 4.1 3.2ZM13 8.7C13 6.9 11.9 6 10.4 6C9.3 6 8.7 6.6 8.4 7.1V6.1H6.3V13H8.5V9.4C8.5 8.4 8.7 7.5 9.9 7.5C11.1 7.5 11.1 8.6 11.1 9.5V13H13.3V8.7H13Z" />
    </svg>
  );
}

/**
 * RetroSocialFacebookIcon
 * Clean retro-styled vector badge for Facebook.
 */
export function RetroSocialFacebookIcon({ className = "w-3.5 h-3.5", ...props }) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      className={`inline-block shrink-0 ${className}`}
      aria-hidden="true"
      {...props}
    >
      <path d="M1 2C1 1.45 1.45 1 2 1H14C14.55 1 15 1.45 15 2V14C15 14.55 14.55 15 14 15H2C1.45 15 1 14.55 1 14V2ZM9.6 13V8.5H11.1L11.3 6.8H9.6V5.7C9.6 5.2 9.8 4.8 10.5 4.8H11.4V3.3C11.2 3.3 10.5 3.2 9.7 3.2C8 3.2 6.8 4.2 6.8 6.1V6.8H5.2V8.5H6.8V13H9.6Z" />
    </svg>
  );
}
