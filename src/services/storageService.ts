import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from "expo-secure-store";

// ── Keys ──────────────────────────────────────────────────────────────────────
const KEYS = {
  THEME: "app_theme",
  FONT_SIZE: "app_font_size",
  GEMINI_KEY: "gemini_api_key",
};

// ── AsyncStorage: app preferences ─────────────────────────────────────────────

export type AppTheme = "dark" | "light" | "system";
export type AppFontSize = "small" | "medium" | "large";

export const getTheme = async (): Promise<AppTheme> => {
  const val = await AsyncStorage.getItem(KEYS.THEME);
  return (val as AppTheme) ?? "dark";
};

export const setTheme = async (theme: AppTheme): Promise<void> => {
  await AsyncStorage.setItem(KEYS.THEME, theme);
};

export const getFontSize = async (): Promise<AppFontSize> => {
  const val = await AsyncStorage.getItem(KEYS.FONT_SIZE);
  return (val as AppFontSize) ?? "medium";
};

export const setFontSize = async (size: AppFontSize): Promise<void> => {
  await AsyncStorage.setItem(KEYS.FONT_SIZE, size);
};

// ── SecureStore: sensitive tokens ─────────────────────────────────────────────

export const getGeminiKey = async (): Promise<string | null> => {
  return SecureStore.getItemAsync(KEYS.GEMINI_KEY);
};

export const setGeminiKey = async (key: string): Promise<void> => {
  await SecureStore.setItemAsync(KEYS.GEMINI_KEY, key);
};

export const deleteGeminiKey = async (): Promise<void> => {
  await SecureStore.deleteItemAsync(KEYS.GEMINI_KEY);
};
