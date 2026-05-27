// src/theme/theme.ts

export const COLORS = {
  // =========================
  // CORE BRAND COLORS
  // =========================

  primary: "#0A0A0A",
  secondary: "#3B82F6",
  tertiary: "#7C3AED",

  // =========================
  // BACKGROUND COLORS
  // =========================

  background: "#050505",
  backgroundSecondary: "#0D0D0D",
  backgroundTertiary: "#121212",

  card: "#111111",
  modal: "#161616",
  elevated: "#1A1A1A",

  // =========================
  // TEXT COLORS
  // =========================

  textPrimary: "#F5F5F5",
  textSecondary: "#A1A1AA",
  textMuted: "#71717A",
  textDisabled: "#52525B",

  // =========================
  // BORDER COLORS
  // =========================

  border: "#222222",
  borderLight: "#2A2A2A",
  borderFocus: "#3B82F6",

  // =========================
  // STATUS COLORS
  // =========================

  success: "#22C55E",
  warning: "#F59E0B",
  error: "#EF4444",
  info: "#3B82F6",

  // =========================
  // CODE EDITOR COLORS
  // =========================

  codeBackground: "#0B0B0B",
  codeBorder: "#1F1F1F",
  lineNumber: "#525252",

  syntaxKeyword: "#C084FC",
  syntaxString: "#86EFAC",
  syntaxFunction: "#60A5FA",
  syntaxVariable: "#F9A8D4",
  syntaxComment: "#6B7280",

  // =========================
  // BUTTON COLORS
  // =========================

  buttonPrimary: "#3B82F6",
  buttonSecondary: "#7C3AED",
  buttonDanger: "#EF4444",

  buttonText: "#FFFFFF",

  // =========================
  // ICON COLORS
  // =========================

  iconPrimary: "#F5F5F5",
  iconSecondary: "#A1A1AA",
  iconActive: "#3B82F6",

  // =========================
  // DRAWER COLORS
  // =========================

  drawerBackground: "#090909",
  drawerActive: "#1A1A1A",
  drawerInactive: "#A1A1AA",

  // =========================
  // TAB COLORS
  // =========================

  tabBackground: "#0B0B0B",
  tabActive: "#FFFFFF",
  tabInactive: "#6B7280",

  // =========================
  // INPUT COLORS
  // =========================

  inputBackground: "#121212",
  inputBorder: "#262626",
  inputPlaceholder: "#6B7280",

  // =========================
  // GLASS / SEOUL NOIR EFFECTS
  // =========================

  glass: "rgba(255,255,255,0.04)",
  overlay: "rgba(0,0,0,0.5)",

  shadow: "#000000",
};



// ==========================================
// TYPOGRAPHY SYSTEM
// ==========================================

export const FONT = {
  heading: "SpaceGrotesk_700Bold",
  headingMedium: "SpaceGrotesk_500Medium",

  body: "Inter_400Regular",
  bodyMedium: "Inter_500Medium",
  bodySemiBold: "Inter_600SemiBold",

  mono: "JetBrainsMono_400Regular",
  monoMedium: "JetBrainsMono_500Medium",
};



// ==========================================
// FONT SIZES
// ==========================================

export const FONT_SIZE = {
  xs: 10,
  sm: 12,
  base: 14,
  md: 16,
  lg: 18,
  xl: 20,
  xxl: 24,
  title: 32,
  hero: 42,
};



// ==========================================
// LINE HEIGHTS
// ==========================================

export const LINE_HEIGHT = {
  sm: 16,
  base: 20,
  md: 24,
  lg: 28,
  xl: 34,
};



// ==========================================
// BORDER RADIUS
// ==========================================

export const RADIUS = {
  xs: 6,
  sm: 10,
  md: 14,
  lg: 18,
  xl: 24,
  full: 999,
};



// ==========================================
// SPACING SYSTEM
// ==========================================

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 28,
  section: 40,
};



// ==========================================
// SHADOWS
// ==========================================

export const SHADOWS = {
  soft: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 3,
  },

  medium: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 6,
  },
};



// ==========================================
// COMPONENT THEME TOKENS
// ==========================================

export const COMPONENTS = {
  header: {
    height: 70,
    backgroundColor: COLORS.background,
  },

  tabBar: {
    height: 70,
    borderRadius: 22,
  },

  card: {
    padding: 18,
    borderRadius: 20,
  },

  button: {
    height: 54,
    borderRadius: 16,
  },

  input: {
    height: 56,
    borderRadius: 16,
  },

  snippetCard: {
    borderRadius: 22,
    padding: 18,
  },
};



// ==========================================
// SEOUL NOIR GRADIENTS
// ==========================================

export const GRADIENTS = {
  primary: ["#3B82F6", "#7C3AED"],

  dark: ["#050505", "#111111"],

  card: ["#111111", "#171717"],

  accent: ["#60A5FA", "#A855F7"],
};



// ==========================================
// ANIMATION TIMINGS
// ==========================================

export const ANIMATION = {
  fast: 150,
  normal: 250,
  slow: 400,
};



// ==========================================
// EXPORT DEFAULT THEME
// ==========================================

export const THEME = {
  COLORS,
  FONT,
  FONT_SIZE,
  LINE_HEIGHT,
  RADIUS,
  SPACING,
  SHADOWS,
  COMPONENTS,
  GRADIENTS,
  ANIMATION,
};

export default THEME;