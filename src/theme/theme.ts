// theme.ts

export const COLORS = {
  // Base
  background: "#10141a",
  onBackground: "#dfe2eb",

  // Surfaces
  surface: "#10141a",
  surfaceDim: "#10141a",
  surfaceBright: "#353940",

  surfaceLowest: "#0a0e14",
  surfaceLow: "#181c22",
  surfaceContainer: "#1c2026",
  surfaceHigh: "#262a31",
  surfaceHighest: "#31353c",

  // Surface Variants
  surfaceVariant: "#31353c",
  surfaceTint: "#a2c9ff",

  // Text
  text: "#dfe2eb",
  textSecondary: "#c0c7d4",
  textMuted: "#8b919d",
  inverseText: "#2d3137",

  // Borders
  border: "#414752",
  outline: "#8b919d",
  outlineVariant: "#414752",

  // Primary
  primary: "#58a6ff",
  primaryLight: "#a2c9ff",
  primaryContainer: "#58a6ff",
  onPrimary: "#00315c",
  onPrimaryContainer: "#003a6b",
  inversePrimary: "#0060aa",

  // Secondary
  secondary: "#bc8cf2",
  secondaryLight: "#dbb8ff",
  secondaryContainer: "#5c2e8f",
  onSecondary: "#441276",
  onSecondaryContainer: "#cea2ff",

  // Tertiary / Success
  tertiary: "#7ee787",
  tertiaryContainer: "#50b85e",
  onTertiary: "#003910",
  onTertiaryContainer: "#004414",

  // Error
  error: "#ff7b72",
  errorContainer: "#93000a",
  onError: "#690005",
  onErrorContainer: "#ffdad6",

  // Utility
  success: "#7ee787",
  warning: "#ffb86c",
  danger: "#ff7b72",
  info: "#58a6ff",

  // Overlays
  overlay: "rgba(0,0,0,0.4)",
  glass: "rgba(28, 32, 38, 0.7)",

  // Syntax Highlighting
  syntax :{
    keyword: "#ff7b72",
    string: "#a5d6ff",
    function: "#d2a8ff",
    variable: "#ffa657",
    number: "#79c0ff",
    comment: "#8b949e",
    type: "#7ee787",
  },
};

export const FONT = {
  heading: "SpaceGrotesk_700Bold",
  headingMedium: "SpaceGrotesk_500Medium",

  body: "Inter_400Regular",
  bodyMedium: "Inter_500Medium",
  bodySemiBold: "Inter_600SemiBold",

  mono: "JetBrainsMono_400Regular",
  monoMedium: "JetBrainsMono_500Medium",
};

export const FONT_SIZE = {
  xs: 10,
  sm: 12,
  base: 14,
  md: 16,
  lg: 18,
  xl: 20,
  "2xl": 24,
  "3xl": 32,
  "4xl": 40,
};

export const LINE_HEIGHT = {
  xs: 14,
  sm: 16,
  base: 20,
  md: 24,
  lg: 28,
  xl: 32,
  "2xl": 36,
  "3xl": 44,
};

export const FONT_WEIGHT = {
  regular: "400" as const,
  medium: "500" as const,
  semiBold: "600" as const,
  bold: "700" as const,
};

export const RADIUS = {
  xs: 4,
  sm: 6,
  md: 8,
  lg: 12,
  xl: 16,
  "2xl": 24,
  full: 9999,
};

export const SPACING = {
  0: 0,
  1: 4,
  2: 8,
  3: 12,
  4: 16,
  5: 20,
  6: 24,
  7: 28,
  8: 32,
  10: 40,
  12: 48,
  16: 64,
  20: 80,
};

export const SHADOWS = {
  none: {
    shadowColor: "transparent",
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },

  sm: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 2,
  },

  md: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
};

export const TYPOGRAPHY = {
  headlineLg: {
    fontFamily: FONT.heading,
    fontSize: FONT_SIZE["3xl"],
    lineHeight: LINE_HEIGHT["3xl"],
    fontWeight: FONT_WEIGHT.bold,
  },

  headlineMd: {
    fontFamily: FONT.headingMedium,
    fontSize: FONT_SIZE["2xl"],
    lineHeight: LINE_HEIGHT["2xl"],
    fontWeight: FONT_WEIGHT.semiBold,
  },

  headlineSm: {
    fontFamily: FONT.headingMedium,
    fontSize: FONT_SIZE.xl,
    lineHeight: LINE_HEIGHT.xl,
    fontWeight: FONT_WEIGHT.semiBold,
  },

  bodyLg: {
    fontFamily: FONT.body,
    fontSize: FONT_SIZE.md,
    lineHeight: LINE_HEIGHT.md,
    fontWeight: FONT_WEIGHT.regular,
  },

  bodyMd: {
    fontFamily: FONT.body,
    fontSize: FONT_SIZE.base,
    lineHeight: LINE_HEIGHT.base,
    fontWeight: FONT_WEIGHT.regular,
  },

  bodySm: {
    fontFamily: FONT.body,
    fontSize: FONT_SIZE.sm,
    lineHeight: LINE_HEIGHT.sm,
    fontWeight: FONT_WEIGHT.regular,
  },

  label: {
    fontFamily: FONT.bodyMedium,
    fontSize: FONT_SIZE.sm,
    lineHeight: LINE_HEIGHT.sm,
    fontWeight: FONT_WEIGHT.medium,
  },

  code: {
    fontFamily: FONT.mono,
    fontSize: FONT_SIZE.base,
    lineHeight: LINE_HEIGHT.base,
    fontWeight: FONT_WEIGHT.regular,
  },

  codeMedium: {
    fontFamily: FONT.monoMedium,
    fontSize: FONT_SIZE.base,
    lineHeight: LINE_HEIGHT.base,
    fontWeight: FONT_WEIGHT.medium,
  },

  caption: {
    fontFamily: FONT.body,
    fontSize: FONT_SIZE.xs,
    lineHeight: LINE_HEIGHT.xs,
    color: COLORS.textMuted,
  },
};

export const THEME = {
  colors: COLORS,
  font: FONT,
  typography: TYPOGRAPHY,
  spacing: SPACING,
  radius: RADIUS,
  shadows: SHADOWS,
};

export default THEME;