/**
 * Minimalist Color Palette for Genfolio
 * Curated sleek monochrome, titanium, cool slate, ice blue, and sage.
 */

export interface MinimalistColorItem {
  key: string;
  name: string;
  hex: string;
  rgb: string;
  desc?: string;
}

export const MINIMALIST_PALETTE: Record<string, MinimalistColorItem> = {
  white: {
    key: 'white',
    name: 'Platinum White',
    hex: '#FAFAFA',
    rgb: '250, 250, 250',
    desc: 'Tối giản thuần khiết, phong cách Linear / Apple',
  },
  titanium: {
    key: 'titanium',
    name: 'Titanium Gray',
    hex: '#D4D4D8',
    rgb: '212, 212, 216',
    desc: 'Xám kim loại trung tính tinh tế',
  },
  zinc: {
    key: 'zinc',
    name: 'Zinc Slate',
    hex: '#A1A1AA',
    rgb: '161, 161, 170',
    desc: 'Trầm ấm, đĩnh đạc và hiện đại',
  },
  slate: {
    key: 'slate',
    name: 'Cool Slate',
    hex: '#94A3B8',
    rgb: '148, 163, 184',
    desc: 'Sắc xám lam lạnh, tinh tế thanh lịch',
  },
  ice: {
    key: 'ice',
    name: 'Ice Blue',
    hex: '#38BDF8',
    rgb: '56, 189, 248',
    desc: 'Điểm nhấn công nghệ thanh thoát',
  },
  sage: {
    key: 'sage',
    name: 'Nordic Sage',
    hex: '#34D399',
    rgb: '52, 211, 153',
    desc: 'Xanh thảo mộc nhạt, dịu mắt',
  },
  graphite: {
    key: 'graphite',
    name: 'Graphite',
    hex: '#71717A',
    rgb: '113, 113, 122',
    desc: 'Monochrome thanh lịch cao cấp',
  },
};

export const DEFAULT_MINIMALIST_COLOR = MINIMALIST_PALETTE.white;
