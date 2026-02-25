// ─── Color Palette ───
export const Colors = {
  primary: '#2563eb',
  primaryLight: '#60a5fa',
  primaryDark: '#1d4ed8',
  primaryBg: '#eff6ff',
  primaryBorder: '#bfdbfe',
  surfaceBg: '#f0f7ff',
  surface: '#ffffff',
  surfaceBorder: '#e0efff',
  text: '#0f2942',
  textSecondary: '#334155',
  textMuted: '#64748b',
  textFaint: '#94a3b8',
  streak: '#f59e0b',
  streakDark: '#92400e',
  streakBg: '#fef9c3',
  streakBorder: '#fde68a',
  success: '#16a34a',
  successBg: '#f0fdf4',
  successBorder: '#bbf7d0',
  danger: '#dc2626',
  dangerBg: '#fef2f2',
  dangerBorder: '#fecaca',
  inputBg: '#f8fafc',
  inputBorder: '#e2e8f0',
  divider: '#f1f5f9',
  white: '#ffffff',
  overlay: 'rgba(255,255,255,0.95)',
};

// ─── Spacing ───
export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
};

// ─── Border Radius ───
export const Radius = {
  sm: 8,
  md: 10,
  lg: 12,
  xl: 14,
  xxl: 20,
  full: 999,
};

// ─── Font Sizes ───
export const FontSize = {
  xs: 11,
  sm: 12,
  md: 13,
  base: 14,
  lg: 15,
  xl: 17,
  xxl: 20,
  xxxl: 22,
  display: 28,
  hero: 32,
};

// ─── Shadows (Platform-aware) ───
export const Shadow = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  md: {
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 3,
  },
  lg: {
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 5,
  },
};
