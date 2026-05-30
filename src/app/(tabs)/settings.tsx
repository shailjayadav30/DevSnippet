import Ionicons from "@expo/vector-icons/Ionicons";
import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import {
  deleteGeminiKey,
  getGeminiKey,
  setGeminiKey,
} from "@/services/storageService";
import { COLORS, FONT, RADIUS, SPACING } from "@/theme/theme";
import Typography from "@/components/ui/Typography";

const APP_VERSION = "1.0.0";

export default function SettingsScreen() {
  const [apiKey, setApiKey] = useState("");
  const [savedKey, setSavedKey] = useState<string | null>(null);
  const [showKey, setShowKey] = useState(false);
  const [saving, setSaving] = useState(false);

  const loadKey = useCallback(async () => {
    const key = await getGeminiKey();
    setSavedKey(key);
    if (key) setApiKey(key);
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadKey();
    }, [loadKey])
  );

  const handleSaveKey = async () => {
    const trimmed = apiKey.trim();
    if (!trimmed) {
      Alert.alert("Empty Key", "Please enter your Gemini API key.");
      return;
    }
    setSaving(true);
    try {
      await setGeminiKey(trimmed);
      setSavedKey(trimmed);
      Alert.alert("Saved", "Your API key has been saved securely.");
    } catch {
      Alert.alert("Error", "Could not save the key.");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteKey = () => {
    Alert.alert("Delete API Key", "Remove your saved Gemini API key?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          await deleteGeminiKey();
          setSavedKey(null);
          setApiKey("");
        },
      },
    ]);
  };

  const maskKey = (key: string): string => {
    if (key.length <= 8) return "••••••••";
    return `${key.slice(0, 4)}${"•".repeat(key.length - 8)}${key.slice(-4)}`;
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Ionicons name="settings" size={22} color={COLORS.primary} />
            <Typography variant="heading" style={styles.headerTitle}>
              Settings
            </Typography>
          </View>
        </View>

        {/* AI Configuration */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="sparkles-outline" size={16} color={COLORS.secondary} />
            <Text style={styles.sectionTitle}>AI Configuration</Text>
          </View>

          {/* Status banner */}
          <View style={[styles.statusBanner, savedKey ? styles.statusOk : styles.statusWarn]}>
            <Ionicons
              name={savedKey ? "checkmark-circle" : "alert-circle-outline"}
              size={18}
              color={savedKey ? COLORS.tertiary : COLORS.warning}
            />
            <Text style={[styles.statusText, { color: savedKey ? COLORS.tertiary : COLORS.warning }]}>
              {savedKey ? "API key is configured" : "No API key set — AI features disabled"}
            </Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardLabel}>GEMINI API KEY</Text>
            <Text style={styles.cardDescription}>
              Get a free key at{" "}
              <Text style={styles.link}>aistudio.google.com</Text>
              {"\n"}Stored securely using device Keychain / Keystore.
            </Text>

            {/* Saved key display */}
            {savedKey && (
              <View style={styles.savedKeyRow}>
                <View style={styles.savedKeyInfo}>
                  <Ionicons
                    name="lock-closed"
                    size={14}
                    color={COLORS.tertiary}
                  />
                  <Text style={styles.savedKeyText}>
                    {showKey ? savedKey : maskKey(savedKey)}
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={() => setShowKey((v) => !v)}
                  style={styles.eyeBtn}
                >
                  <Ionicons
                    name={showKey ? "eye-off-outline" : "eye-outline"}
                    size={18}
                    color={COLORS.textMuted}
                  />
                </TouchableOpacity>
              </View>
            )}

            <TextInput
              style={styles.input}
              value={apiKey}
              onChangeText={setApiKey}
              placeholder="AIza..."
              placeholderTextColor={COLORS.textMuted}
              secureTextEntry={!showKey}
              autoCapitalize="none"
              autoCorrect={false}
            />

            <View style={styles.keyActions}>
              <TouchableOpacity
                style={[styles.saveKeyBtn, saving && { opacity: 0.6 }]}
                onPress={handleSaveKey}
                disabled={saving}
                activeOpacity={0.8}
              >
                <Ionicons name="save-outline" size={16} color={COLORS.onPrimary} />
                <Text style={styles.saveKeyBtnText}>
                  {saving ? "Saving..." : "Save Key"}
                </Text>
              </TouchableOpacity>

              {savedKey && (
                <TouchableOpacity
                  style={styles.deleteKeyBtn}
                  onPress={handleDeleteKey}
                  activeOpacity={0.8}
                >
                  <Ionicons name="trash-outline" size={16} color={COLORS.error} />
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>

        {/* Storage info */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="server-outline" size={16} color={COLORS.primary} />
            <Text style={styles.sectionTitle}>Storage</Text>
          </View>
          <View style={styles.card}>
            {[
              { icon: "cube-outline" as const, label: "Snippet Database", value: "SQLite", color: COLORS.primary },
              { icon: "options-outline" as const, label: "App Preferences", value: "AsyncStorage", color: COLORS.tertiary },
              { icon: "lock-closed-outline" as const, label: "API Keys", value: "SecureStore", color: COLORS.secondary },
              { icon: "folder-outline" as const, label: "Files & Exports", value: "Expo FileSystem", color: COLORS.warning },
            ].map((item) => (
              <View key={item.label} style={styles.storageRow}>
                <View style={[styles.storageIcon, { backgroundColor: `${item.color}18` }]}>
                  <Ionicons name={item.icon} size={18} color={item.color} />
                </View>
                <View style={styles.storageInfo}>
                  <Text style={styles.storageLabel}>{item.label}</Text>
                  <Text style={styles.storageValue}>{item.value}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* About */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="information-circle-outline" size={16} color={COLORS.textMuted} />
            <Text style={styles.sectionTitle}>About</Text>
          </View>
          <View style={styles.card}>
            <View style={styles.aboutRow}>
              <View style={styles.appLogo}>
                <Ionicons name="code-slash" size={28} color={COLORS.primary} />
              </View>
              <View>
                <Text style={styles.appName}>Codezy</Text>
                <Text style={styles.appVersion}>Version {APP_VERSION}</Text>
              </View>
            </View>
            <Text style={styles.appDescription}>
              A developer-first snippet manager. Save, organize, and understand your code — completely offline.
            </Text>
            {[
              { label: "Offline-first with SQLite" },
              { label: "AI-powered code explanations" },
              { label: "Export as .txt, .js, .json" },
              { label: "Secure API key storage" },
            ].map((f) => (
              <View key={f.label} style={styles.featureRow}>
                <Ionicons name="checkmark-circle" size={14} color={COLORS.tertiary} />
                <Text style={styles.featureText}>{f.label}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Built with Expo SDK 56 · React Native</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.background },
  scrollContent: { padding: SPACING[4], paddingBottom: 80 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: SPACING[6],
  },
  headerLeft: { flexDirection: "row", alignItems: "center", gap: 10 },
  headerTitle: { fontSize: 22 },
  section: { marginBottom: SPACING[6] },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: SPACING[3],
  },
  sectionTitle: {
    color: COLORS.textMuted,
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1.2,
    textTransform: "uppercase",
    fontFamily: FONT.monoMedium,
  },
  statusBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    padding: 12,
    borderRadius: RADIUS.md,
    marginBottom: SPACING[3],
    borderWidth: 1,
  },
  statusOk: {
    backgroundColor: "rgba(126,231,135,0.08)",
    borderColor: "rgba(126,231,135,0.2)",
  },
  statusWarn: {
    backgroundColor: "rgba(255,184,108,0.08)",
    borderColor: "rgba(255,184,108,0.2)",
  },
  statusText: { fontSize: 13, fontFamily: FONT.bodyMedium },
  card: {
    backgroundColor: COLORS.surfaceContainer,
    borderRadius: RADIUS.xl,
    padding: SPACING[4],
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: 12,
  },
  cardLabel: {
    color: COLORS.textMuted,
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 1.2,
    textTransform: "uppercase",
    fontFamily: FONT.mono,
  },
  cardDescription: {
    color: COLORS.textMuted,
    fontSize: 13,
    lineHeight: 20,
    fontFamily: FONT.body,
  },
  link: { color: COLORS.primary, textDecorationLine: "underline" },
  savedKeyRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: COLORS.surfaceLow,
    padding: 10,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  savedKeyInfo: { flexDirection: "row", alignItems: "center", gap: 8, flex: 1 },
  savedKeyText: {
    color: COLORS.tertiary,
    fontFamily: FONT.mono,
    fontSize: 13,
    flex: 1,
  },
  eyeBtn: { padding: 4 },
  input: {
    backgroundColor: COLORS.surfaceLow,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.md,
    padding: 14,
    color: COLORS.text,
    fontFamily: FONT.mono,
    fontSize: 14,
  },
  keyActions: { flexDirection: "row", gap: 12 },
  saveKeyBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    borderRadius: RADIUS.md,
  },
  saveKeyBtnText: {
    color: COLORS.onPrimary,
    fontWeight: "700",
    fontSize: 14,
    fontFamily: FONT.bodyMedium,
  },
  deleteKeyBtn: {
    height: 46,
    width: 46,
    borderRadius: RADIUS.md,
    backgroundColor: "rgba(239,68,68,0.10)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  storageRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 4,
  },
  storageIcon: {
    height: 38,
    width: 38,
    borderRadius: RADIUS.md,
    justifyContent: "center",
    alignItems: "center",
  },
  storageInfo: { flex: 1 },
  storageLabel: { color: COLORS.text, fontSize: 14, fontFamily: FONT.bodyMedium },
  storageValue: { color: COLORS.textMuted, fontSize: 12, fontFamily: FONT.mono, marginTop: 1 },
  aboutRow: { flexDirection: "row", alignItems: "center", gap: 14 },
  appLogo: {
    height: 52,
    width: 52,
    borderRadius: RADIUS.lg,
    backgroundColor: COLORS.surfaceLow,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  appName: {
    color: COLORS.text,
    fontSize: 20,
    fontWeight: "800",
    fontFamily: FONT.heading,
  },
  appVersion: {
    color: COLORS.textMuted,
    fontSize: 13,
    fontFamily: FONT.mono,
  },
  appDescription: {
    color: COLORS.textMuted,
    fontSize: 13,
    lineHeight: 20,
    fontFamily: FONT.body,
  },
  featureRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  featureText: { color: COLORS.textSecondary, fontSize: 13, fontFamily: FONT.body },
  footer: { alignItems: "center", marginTop: SPACING[4] },
  footerText: { color: COLORS.textMuted, fontSize: 11, fontFamily: FONT.mono },
});
