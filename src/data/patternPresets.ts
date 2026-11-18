import { ColorPalette, MotifStudyInfo, PatternConfig } from '../types/pattern';

export const COLOR_PALETTES: ColorPalette[] = [
  {
    id: 'classic-traditional',
    name: 'Classic Indigo & Madder',
    description: 'The archetype Sindhi Ajrak: deep river-vat indigo, root-madder red, and warm ivory resist.',
    ground: '#0c2033',       // Deep indigo ground
    primary: '#8c2527',      // Madder red
    secondary: '#183856',    // Indigo mid-tone
    accent: '#f5eedd',       // Unbleached cotton ivory
    outline: '#15171a',      // Syahi iron resist
  },
  {
    id: 'madder-field',
    name: 'Lal Bhorg (Madder Dominant)',
    description: 'An earthier variant dominated by boiling-vat madder red with indigo medallion accents.',
    ground: '#731e20',
    primary: '#0e2235',
    secondary: '#942f32',
    accent: '#f8f3e5',
    outline: '#19191c',
  },
  {
    id: 'syahi-charcoal',
    name: 'Syahi & Deep Vat',
    description: 'Highlighting the black iron-mordant (syahi) with restrained indigo and ivory linework.',
    ground: '#141619',
    primary: '#122a42',
    secondary: '#782325',
    accent: '#ede5d4',
    outline: '#090a0c',
  },
  {
    id: 'kora-light',
    name: 'Kora Resist (Ivory Ground)',
    description: 'Inverted study reflecting the sun-bleached kora cotton base before full double-dip dyeing.',
    ground: '#f4eee0',
    primary: '#0e2235',
    secondary: '#8a2628',
    accent: '#c98e3b',
    outline: '#202226',
  },
  {
    id: 'kasimi-gold',
    name: 'Kasimi Ochre Accent',
    description: 'Featuring warm yellow-ochre pigment accents alongside traditional indigo and alizarin madder.',
    ground: '#0f2438',
    primary: '#c48734',
    secondary: '#852224',
    accent: '#f7f2e4',
    outline: '#151619',
  },
];

export const MOTIF_STUDIES: MotifStudyInfo[] = [
  {
    id: 'star-trellis',
    title: 'Study 01: Star-Trellis Geometry',
    subtitle: 'Octagonal polygon study inspired by Taveez & Sitara tessellations',
    traditionalInspiration: 'Inspired by traditional Taveez (amulet) and eight-pointed Sitara diamond interlocks',
    description: 'Explores the interlock of 8-pointed stars with diagonal secondary diamond networks. In traditional woodblock carving, this structure produces an unbroken wallpaper tessellation (p4m symmetry).',
    geometryType: '8-Fold Octagonal Tessellation',
    symmetryGroup: 'p4m (Wallpaper Group 11)',
    carvingDifficulty: 'Master (Poregar 3-block alignment)',
  },
  {
    id: 'eightfold-rosette',
    title: 'Study 02: Eightfold Rosette',
    subtitle: 'Radial symmetry study inspired by traditional Phool (flower) motifs',
    traditionalInspiration: 'Derived from classical Sindhi Phool (floral medallion) and Badami rounded geometry',
    description: 'A study in concentric radial geometry featuring an 8-petal central core, octagonal stepped halo, and quadrant corner florets that form secondary rosettes at grid intersections.',
    geometryType: 'Radial & Orthogonal Point Symmetry',
    symmetryGroup: 'c4m / p4mm',
    carvingDifficulty: 'High (requires exact radial concentricity)',
  },
  {
    id: 'stepped-diamond',
    title: 'Study 03: Stepped Diamond & Knot',
    subtitle: 'Stepped polygon study inspired by Chokri and Hasheeya corner units',
    traditionalInspiration: 'Inspired by traditional Chokri (stepped diamond) and Kangri saw-tooth border structures',
    description: 'Constructed from concentric 45-degree diamond bands with stepped crenellations and a central cross. When tiled, the outer steps lock into neighboring motifs to produce secondary latch-hook lozenges.',
    geometryType: 'Stepped Polygon & Chevron Interlock',
    symmetryGroup: 'cmm / p4m',
    carvingDifficulty: 'Intermediate (clean straight chisel grain)',
  },
];

export const DEFAULT_PATTERN_CONFIG: PatternConfig = {
  motifId: 'star-trellis',
  paletteId: 'classic-traditional',
  customColors: {
    ground: COLOR_PALETTES[0].ground,
    primary: COLOR_PALETTES[0].primary,
    secondary: COLOR_PALETTES[0].secondary,
    accent: COLOR_PALETTES[0].accent,
    outline: COLOR_PALETTES[0].outline,
  },
  gridDensity: 3,
  motifScale: 1.0,
  spacing: 0,
  rotation: 0,
  gridLayout: 'square',
  strokeWidth: 2,
  showBorder: true,
  borderWidth: 28,
  textureEffect: true,
  showGridGuides: false,
};
