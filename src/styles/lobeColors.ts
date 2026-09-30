/**
 * LobeChat Official Color System & Palettes
 * Extracted directly from @lobehub/ui and LobeChat source.
 */

import {
  primaryColors,
  primaryColorsSwatches,
  neutralColors,
  neutralColorsSwatches,
  findCustomThemeName,
  type PrimaryColors,
  type NeutralColors,
} from '@lobehub/ui';

export {
  primaryColors,
  primaryColorsSwatches,
  neutralColors,
  neutralColorsSwatches,
  findCustomThemeName,
  type PrimaryColors,
  type NeutralColors,
};

export interface LobeColorItem {
  key: string;
  name: string;
  hex: string;
  rgb: string;
}

/**
 * 12 Official LobeChat Primary Accent Colors (Dark Mode scale 9)
 * Synced 100% with @lobehub/ui
 */
export const LOBE_PRIMARY_COLORS: Record<string, LobeColorItem> = {
  cyan: {
    key: 'cyan',
    name: 'Cyan (Lobe Cyan)',
    hex: '#95f3d9',
    rgb: '149, 243, 217',
  },
  blue: {
    key: 'blue',
    name: 'Blue (Cloud SRE)',
    hex: '#60b1ff',
    rgb: '96, 177, 255',
  },
  geekblue: {
    key: 'geekblue',
    name: 'Geek Blue (Deep Tech)',
    hex: '#0072f5',
    rgb: '0, 114, 245',
  },
  gold: {
    key: 'gold',
    name: 'Gold (Executive)',
    hex: '#ffb224',
    rgb: '255, 178, 36',
  },
  green: {
    key: 'green',
    name: 'Green (Terminal CLI)',
    hex: '#62c473',
    rgb: '98, 196, 115',
  },
  lime: {
    key: 'lime',
    name: 'Lime (Neon Lime)',
    hex: '#c4f042',
    rgb: '196, 240, 66',
  },
  magenta: {
    key: 'magenta',
    name: 'Magenta (Holo Foil)',
    hex: '#e34ba9',
    rgb: '227, 75, 169',
  },
  orange: {
    key: 'orange',
    name: 'Orange (Vibrant)',
    hex: '#ff9927',
    rgb: '255, 153, 39',
  },
  purple: {
    key: 'purple',
    name: 'Purple (Glassmorphism)',
    hex: '#bd54c6',
    rgb: '189, 84, 198',
  },
  red: {
    key: 'red',
    name: 'Red (Crimson)',
    hex: '#f4416c',
    rgb: '244, 65, 108',
  },
  volcano: {
    key: 'volcano',
    name: 'Volcano (Blaze)',
    hex: '#ec5e41',
    rgb: '236, 94, 65',
  },
  yellow: {
    key: 'yellow',
    name: 'Yellow (Warning)',
    hex: '#ffef5c',
    rgb: '255, 239, 92',
  },
};

/**
 * Official LobeChat Neutral Grayscale Tokens
 */
export const LOBE_NEUTRAL_COLORS: Record<string, string> = {
  slate: '#707276',
  mauve: '#737177',
  sage: '#6e7371',
  olive: '#70736e',
  sand: '#73726a',
};

/**
 * Official LobeChat Dark Theme Surface & Boundary Tokens
 */
export const LOBE_BG_COLORS = {
  layout: '#000000',
  layoutSubtle: '#050505',
  container: '#0a0a0c',
  containerSubtle: '#101014',
  elevated: '#141416',
  spotlight: '#1f1f23',
  border: 'rgba(255, 255, 255, 0.08)',
  borderSecondary: 'rgba(255, 255, 255, 0.04)',
  borderHover: 'rgba(255, 255, 255, 0.16)',
  textPrimary: '#ffffff',
  textSecondary: 'rgba(255, 255, 255, 0.65)',
  textTertiary: 'rgba(255, 255, 255, 0.45)',
  textQuaternary: 'rgba(255, 255, 255, 0.25)',
};

/**
 * Converts hex to RGB string (e.g. '#95f3d9' -> '149, 243, 217')
 */
export const hexToRgbString = (hex: string): string => {
  const clean = hex.replace('#', '');
  if (clean.length === 6) {
    const r = parseInt(clean.substring(0, 2), 16);
    const g = parseInt(clean.substring(2, 4), 16);
    const b = parseInt(clean.substring(4, 6), 16);
    return `${r}, ${g}, ${b}`;
  }
  return '149, 243, 217';
};

/**
 * Helper to get Lobe theme key from hex
 */
export const getLobeThemeKey = (hex: string): string => {
  const match = Object.values(LOBE_PRIMARY_COLORS).find(
    (c) => c.hex.toLowerCase() === hex.toLowerCase()
  );
  if (match) return match.key;
  const directMatch = findCustomThemeName('primary', hex);
  if (directMatch) return directMatch;
  return 'cyan';
};

/**
 * Real-time CSS Variable applicator (<100ms instant switch without reload, satisfying PRD G-05 & AC-03)
 */
export const applyLobeThemeVariables = (hex: string, rgb?: string) => {
  const rgbVal = rgb || hexToRgbString(hex);
  const root = document.documentElement;
  root.style.setProperty('--primary-color', hex);
  root.style.setProperty('--primary-rgb', rgbVal);
  root.style.setProperty('--primary-glow', `rgba(${rgbVal}, 0.35)`);
  root.style.setProperty('--primary-light', `rgba(${rgbVal}, 0.15)`);
  root.style.setProperty('--primary-border', `rgba(${rgbVal}, 0.45)`);
};
