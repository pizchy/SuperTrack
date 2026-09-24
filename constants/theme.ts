// SuperTrack Design System Tokens
export const Colors = {
  // Base
  Background: '#060E1E',
  Surface: '#0D1B2E',
  SurfaceElevated: '#132236',
  SurfaceBorder: '#1E3050',

  // Brand
  Primary: '#00C4B4',
  PrimaryDark: '#009E91',
  PrimaryLight: '#33CFBF',
  PrimaryMuted: 'rgba(0, 196, 180, 0.12)',

  // Accent
  Gold: '#F5A623',
  GoldMuted: 'rgba(245, 166, 35, 0.12)',

  // Semantic
  Success: '#00C853',
  SuccessMuted: 'rgba(0, 200, 83, 0.12)',
  Warning: '#FF9F1C',
  WarningMuted: 'rgba(255, 159, 28, 0.12)',
  Danger: '#FF5A5F',
  DangerMuted: 'rgba(255, 90, 95, 0.12)',
  Info: '#4A90E2',
  InfoMuted: 'rgba(74, 144, 226, 0.12)',

  // Tax Category Colors
  IncomeTax: '#FF6B6B',
  Medicare: '#FFB347',
  GST: '#A78BFA',
  Super: '#00C4B4',
  StudentLoan: '#F472B6',
  TakeHome: '#00C853',

  // Text
  TextPrimary: '#FFFFFF',
  TextSecondary: '#8FACC8',
  TextMuted: '#4A6582',
  TextInverse: '#060E1E',

  // Overlay
  Overlay: 'rgba(6, 14, 30, 0.85)',
};

export const Typography = {
  // Sizes
  xs: 12,
  sm: 14,
  base: 16,
  lg: 18,
  xl: 20,
  '2xl': 24,
  '3xl': 28,
  '4xl': 32,
  '5xl': 40,

  // Weights
  Regular: '400' as const,
  Medium: '500' as const,
  SemiBold: '600' as const,
  Bold: '700' as const,
  ExtraBold: '800' as const,
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  '2xl': 48,
  '3xl': 64,
};

export const Radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  full: 9999,
};

export const Shadows = {
  sm: {
    shadowColor: '#00C4B4',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  glow: {
    shadowColor: '#00C4B4',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
};
