import Ionicons from "@expo/vector-icons/Ionicons";
import { useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Markdown from "react-native-markdown-display";

import { explainCode, type GeminiModelId } from "@/services/apiServices";
import { COLORS, FONT, RADIUS, SPACING } from "@/theme/theme";
import Typography from "@/components/ui/Typography";

// ── Model definitions ─────────────────────────────────────────────────────────
type GeminiModel = {
  id: GeminiModelId;
  name: string;
  tagline: string;
  badge: string;
  badgeColor: string;
  icon: React.ComponentProps<typeof Ionicons>["name"];
  description: string;
  free: boolean;
};

const GEMINI_MODELS: GeminiModel[] = [
  {
    id: "gemini-2.5-flash",
    name: "2.5 Flash",
    tagline: "Latest · Free · Fast",
    badge: "NEW",
    badgeColor: "#4ADE80",
    icon: "flash",
    description:
      "Newest Gemini model. Fast, capable, and completely free to use via Google AI Studio.",
    free: true,
  },
  {
    id: "gemini-2.0-flash",
    name: "2.0 Flash",
    tagline: "Stable · Free · Reliable",
    badge: "FAST",
    badgeColor: "#58A6FF",
    icon: "rocket-outline",
    description:
      "Stable and fast. Great default choice for most code explanations. Free tier.",
    free: true,
  },
  {
    id: "gemini-2.0-flash-thinking-exp-01-21",
    name: "2.0 Thinking",
    tagline: "Reasoning · Free · Deep",
    badge: "THINK",
    badgeColor: "#C084FC",
    icon: "bulb",
    description:
      "Experimental reasoning model. Shows step-by-step thinking for complex logic. Free.",
    free: true,
  },
  {
    id: "gemini-1.5-flash",
    name: "1.5 Flash",
    tagline: "Balanced · Free · Proven",
    badge: "FREE",
    badgeColor: "#FFAB40",
    icon: "layers",
    description:
      "Proven and reliable. A solid free choice for everyday code analysis tasks.",
    free: true,
  },
  {
    id: "gemini-1.5-flash-8b",
    name: "1.5 Flash 8B",
    tagline: "Lightest · Free · Ultra-fast",
    badge: "LITE",
    badgeColor: "#7EE787",
    icon: "speedometer",
    description:
      "Smallest and fastest model. Best for simple snippets. Completely free.",
    free: true,
  },
  {
    id: "gemini-1.5-pro",
    name: "1.5 Pro",
    tagline: "Powerful · Free (limited)",
    badge: "PRO",
    badgeColor: "#F87171",
    icon: "star",
    description:
      "Highest quality output for deep analysis. Free tier has lower rate limits (2 RPM).",
    free: true,
  },
];

// ── Language definitions ───────────────────────────────────────────────────────
const LANGUAGES = [
  { id: "typescript", label: "TypeScript", dot: "#3178C6" },
  { id: "javascript", label: "JavaScript", dot: "#F7DF1E" },
  { id: "python", label: "Python", dot: "#3572A5" },
  { id: "go", label: "Go", dot: "#00ADD8" },
  { id: "rust", label: "Rust", dot: "#CE422B" },
  { id: "java", label: "Java", dot: "#ED8B00" },
  { id: "css", label: "CSS", dot: "#1572B6" },
  { id: "html", label: "HTML", dot: "#E34F26" },
  { id: "sql", label: "SQL", dot: "#4479A1" },
  { id: "swift", label: "Swift", dot: "#FA7343" },
  { id: "kotlin", label: "Kotlin", dot: "#7F52FF" },
  { id: "cpp", label: "C++", dot: "#00599C" },
];

const MODES = [
  { id: "explain", label: "Explain", icon: "book-outline" as const },
  { id: "summarize", label: "Summarize", icon: "list-outline" as const },
  { id: "improve", label: "Improve", icon: "flash-outline" as const },
];

// ── Model Card (horizontal scroll) ────────────────────────────────────────────
const ModelCard = ({
  model,
  selected,
  onPress,
}: {
  model: GeminiModel;
  selected: boolean;
  onPress: () => void;
}) => (
  <TouchableOpacity
    onPress={onPress}
    activeOpacity={0.8}
    style={[modelCardStyles.card, selected && modelCardStyles.cardSelected]}
  >
    <View style={modelCardStyles.top}>
      <View
        style={[
          modelCardStyles.iconWrap,
          { backgroundColor: `${model.badgeColor}18` },
        ]}
      >
        <Ionicons name={model.icon} size={18} color={model.badgeColor} />
      </View>
      {selected && <View style={modelCardStyles.selectedDot} />}
    </View>

    <Text style={modelCardStyles.name}>{model.name}</Text>
    <Text style={modelCardStyles.tagline} numberOfLines={2}>{model.tagline}</Text>

    <View style={modelCardStyles.badgeRow}>
      <View
        style={[
          modelCardStyles.badge,
          { backgroundColor: `${model.badgeColor}20`, borderColor: `${model.badgeColor}40` },
        ]}
      >
        <Text style={[modelCardStyles.badgeText, { color: model.badgeColor }]}>
          {model.badge}
        </Text>
      </View>
      {model.free && (
        <View style={modelCardStyles.freeBadge}>
          <Text style={modelCardStyles.freeBadgeText}>FREE</Text>
        </View>
      )}
    </View>
  </TouchableOpacity>
);

const modelCardStyles = StyleSheet.create({
  card: {
    width: 128,
    padding: 12,
    borderRadius: RADIUS.xl,
    backgroundColor: COLORS.surfaceContainer,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    marginRight: SPACING[2],
    gap: 5,
  },
  cardSelected: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.surfaceHigh,
  },
  top: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  iconWrap: {
    height: 34,
    width: 34,
    borderRadius: RADIUS.md,
    justifyContent: "center",
    alignItems: "center",
  },
  selectedDot: {
    height: 8,
    width: 8,
    borderRadius: 4,
    backgroundColor: COLORS.primary,
    marginTop: 4,
  },
  name: {
    color: COLORS.text,
    fontSize: 13,
    fontWeight: "700",
    fontFamily: FONT.heading,
    marginTop: 2,
  },
  tagline: {
    color: COLORS.textMuted,
    fontSize: 10,
    fontFamily: FONT.mono,
    lineHeight: 14,
  },
  badgeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    flexWrap: "wrap",
    marginTop: 2,
  },
  badge: {
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: RADIUS.full,
    borderWidth: 1,
  },
  badgeText: {
    fontSize: 9,
    fontWeight: "800",
    fontFamily: FONT.mono,
    letterSpacing: 0.8,
  },
  freeBadge: {
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: RADIUS.full,
    backgroundColor: "rgba(126,231,135,0.15)",
    borderWidth: 1,
    borderColor: "rgba(126,231,135,0.35)",
  },
  freeBadgeText: {
    fontSize: 9,
    fontWeight: "800",
    fontFamily: FONT.mono,
    letterSpacing: 0.8,
    color: "#7EE787",
  },
});

// ── Main screen ────────────────────────────────────────────────────────────────
export default function AIScreen() {
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState(LANGUAGES[0]);
  const [model, setModel] = useState<GeminiModel>(GEMINI_MODELS[0]);
  const [mode, setMode] = useState(MODES[0].id);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");
  const [langPickerVisible, setLangPickerVisible] = useState(false);
  const [modelInfoVisible, setModelInfoVisible] = useState(false);

  const handleAnalyze = async () => {
    if (!code.trim()) return;
    setLoading(true);
    setResult("");
    try {
      const response = await explainCode(code.trim(), language.id, model.id);
      setResult(response);
    } catch {
      setResult("Failed to get a response. Check your API key in Settings.");
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setCode("");
    setResult("");
  };

  const activeModelData = GEMINI_MODELS.find((m) => m.id === model.id)!;

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={0}
      >
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <Ionicons name="sparkles" size={22} color={COLORS.secondary} />
              <Typography variant="heading" style={styles.headerTitle}>
                AI Code Analysis
              </Typography>
            </View>
          </View>

          {/* ── Model Selector ─────────────────────────────────────────── */}
          <View style={styles.section}>
            <View style={styles.sectionLabelRow}>
              <Text style={styles.label}>MODEL</Text>
              <TouchableOpacity
                onPress={() => setModelInfoVisible(true)}
                style={styles.infoBtn}
              >
                <Ionicons
                  name="information-circle-outline"
                  size={16}
                  color={COLORS.textMuted}
                />
                <Text style={styles.infoBtnText}>Compare</Text>
              </TouchableOpacity>
            </View>

            {/* Horizontal model cards */}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.modelScroll}
            >
              {GEMINI_MODELS.map((m) => (
                <ModelCard
                  key={m.id}
                  model={m}
                  selected={model.id === m.id}
                  onPress={() => {
                    setModel(m);
                    setResult("");
                  }}
                />
              ))}
            </ScrollView>

            {/* Active model pill */}
            <View style={styles.activeModelPill}>
              <Ionicons
                name={activeModelData.icon}
                size={14}
                color={activeModelData.badgeColor}
              />
              <Text style={styles.activeModelText}>
                Using{" "}
                <Text style={[styles.activeModelName, { color: activeModelData.badgeColor }]}>
                  {activeModelData.name}
                </Text>
                {"  ·  "}
                {activeModelData.tagline}
              </Text>
            </View>
          </View>

          {/* ── Mode selector ──────────────────────────────────────────── */}
          <View style={styles.modeRow}>
            {MODES.map((m) => (
              <TouchableOpacity
                key={m.id}
                style={[styles.modeBtn, mode === m.id && styles.modeBtnActive]}
                onPress={() => setMode(m.id)}
                activeOpacity={0.8}
              >
                <Ionicons
                  name={m.icon}
                  size={16}
                  color={mode === m.id ? COLORS.onPrimary : COLORS.textMuted}
                />
                <Text
                  style={[
                    styles.modeBtnText,
                    mode === m.id && styles.modeBtnTextActive,
                  ]}
                >
                  {m.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* ── Language picker ────────────────────────────────────────── */}
          <View style={styles.section}>
            <Text style={styles.label}>LANGUAGE</Text>
            <TouchableOpacity
              style={styles.langSelector}
              onPress={() => setLangPickerVisible(true)}
              activeOpacity={0.8}
            >
              <View style={styles.langLeft}>
                <View style={[styles.langDot, { backgroundColor: language.dot }]} />
                <Text style={styles.langText}>{language.label}</Text>
              </View>
              <Ionicons name="chevron-down" size={18} color={COLORS.textMuted} />
            </TouchableOpacity>
          </View>

          {/* ── Code input ─────────────────────────────────────────────── */}
          <View style={styles.section}>
            <View style={styles.sectionLabelRow}>
              <Text style={styles.label}>CODE</Text>
              {code.length > 0 && (
                <TouchableOpacity onPress={handleClear}>
                  <Text style={styles.clearText}>Clear</Text>
                </TouchableOpacity>
              )}
            </View>
            <TextInput
              style={styles.codeInput}
              value={code}
              onChangeText={setCode}
              placeholder={`Paste your ${language.label} code here...`}
              placeholderTextColor={COLORS.textMuted}
              multiline
              textAlignVertical="top"
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          {/* ── Analyze button ─────────────────────────────────────────── */}
          <TouchableOpacity
            style={[
              styles.analyzeBtn,
              { backgroundColor: activeModelData.badgeColor + "CC" },
              (!code.trim() || loading) && styles.analyzeBtnDisabled,
            ]}
            onPress={handleAnalyze}
            activeOpacity={0.8}
            disabled={!code.trim() || loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <Ionicons name={activeModelData.icon} size={20} color="#fff" />
            )}
            <Text style={styles.analyzeBtnText}>
              {loading
                ? `${activeModelData.name} is thinking...`
                : mode === "explain"
                ? "Explain Code"
                : mode === "summarize"
                ? "Summarize Code"
                : "Suggest Improvements"}
            </Text>
          </TouchableOpacity>

          {/* ── Loading state ──────────────────────────────────────────── */}
          {loading && (
            <View style={styles.loadingState}>
              <ActivityIndicator
                color={activeModelData.badgeColor}
                size="large"
              />
              <Text style={styles.loadingText}>
                {activeModelData.name} is analyzing...
              </Text>
              <Text style={styles.loadingSubtext}>
                {activeModelData.description}
              </Text>
            </View>
          )}

          {/* ── Result ─────────────────────────────────────────────────── */}
          {!!result && !loading && (
            <View style={styles.resultContainer}>
              <View style={styles.resultHeader}>
                <View style={styles.resultHeaderLeft}>
                  <Ionicons
                    name={activeModelData.icon}
                    size={18}
                    color={activeModelData.badgeColor}
                  />
                  <Text style={styles.resultTitle}>
                    {mode === "explain"
                      ? "Explanation"
                      : mode === "summarize"
                      ? "Summary"
                      : "Improvements"}
                  </Text>
                </View>
                <View style={styles.resultHeaderRight}>
                  <View
                    style={[
                      styles.modelUsedBadge,
                      { borderColor: `${activeModelData.badgeColor}40` },
                    ]}
                  >
                    <Text
                      style={[
                        styles.modelUsedText,
                        { color: activeModelData.badgeColor },
                      ]}
                    >
                      {activeModelData.name}
                    </Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => setResult("")}
                    style={styles.closeResultBtn}
                  >
                    <Ionicons name="close" size={18} color={COLORS.textMuted} />
                  </TouchableOpacity>
                </View>
              </View>
              <View style={styles.resultCard}>
                <Markdown style={markdownStyles}>{result}</Markdown>
              </View>
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>

      {/* ── Language picker modal ─────────────────────────────────────── */}
      <Modal
        visible={langPickerVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setLangPickerVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setLangPickerVisible(false)}>
          <View style={styles.overlay}>
            <TouchableWithoutFeedback>
              <View style={styles.sheet}>
                <Text style={styles.sheetTitle}>Select Language</Text>
                <FlatList
                  data={LANGUAGES}
                  keyExtractor={(item) => item.id}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      style={styles.sheetItem}
                      onPress={() => {
                        setLanguage(item);
                        setLangPickerVisible(false);
                      }}
                    >
                      <View
                        style={[styles.langDot, { backgroundColor: item.dot }]}
                      />
                      <Text
                        style={[
                          styles.sheetItemText,
                          item.id === language.id && styles.sheetItemActive,
                        ]}
                      >
                        {item.label}
                      </Text>
                      {item.id === language.id && (
                        <Ionicons
                          name="checkmark"
                          size={16}
                          color={COLORS.primary}
                          style={{ marginLeft: "auto" }}
                        />
                      )}
                    </TouchableOpacity>
                  )}
                />
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      {/* ── Model info / compare modal ────────────────────────────────── */}
      <Modal
        visible={modelInfoVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModelInfoVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setModelInfoVisible(false)}>
          <View style={styles.overlay}>
            <TouchableWithoutFeedback>
              <View style={[styles.sheet, styles.modelSheet]}>
                <View style={styles.modelSheetHeader}>
                  <Text style={styles.sheetTitle}>CHOOSE MODEL</Text>
                  <TouchableOpacity
                    onPress={() => setModelInfoVisible(false)}
                    style={styles.sheetCloseBtn}
                  >
                    <Ionicons name="close" size={20} color={COLORS.textMuted} />
                  </TouchableOpacity>
                </View>
                <FlatList
                  data={GEMINI_MODELS}
                  keyExtractor={(item) => item.id}
                  contentContainerStyle={{ paddingBottom: 24 }}
                  renderItem={({ item }) => {
                    const isSelected = model.id === item.id;
                    return (
                      <TouchableOpacity
                        style={[
                          styles.modelRow,
                          isSelected && styles.modelRowSelected,
                        ]}
                        onPress={() => {
                          setModel(item);
                          setResult("");
                          setModelInfoVisible(false);
                        }}
                        activeOpacity={0.8}
                      >
                        <View
                          style={[
                            styles.modelRowIcon,
                            { backgroundColor: `${item.badgeColor}18` },
                          ]}
                        >
                          <Ionicons
                            name={item.icon}
                            size={20}
                            color={item.badgeColor}
                          />
                        </View>
                        <View style={styles.modelRowInfo}>
                          <View style={styles.modelRowTop}>
                            <Text style={styles.modelRowName}>{item.name}</Text>
                            <View
                              style={[
                                styles.modelRowBadge,
                                {
                                  backgroundColor: `${item.badgeColor}20`,
                                  borderColor: `${item.badgeColor}40`,
                                },
                              ]}
                            >
                              <Text
                                style={[
                                  styles.modelRowBadgeText,
                                  { color: item.badgeColor },
                                ]}
                              >
                                {item.badge}
                              </Text>
                            </View>
                            {item.free && (
                              <View style={styles.modelRowFreeBadge}>
                                <Ionicons name="gift-outline" size={9} color="#7EE787" />
                                <Text style={styles.modelRowFreeText}>FREE</Text>
                              </View>
                            )}
                          </View>
                          <Text style={styles.modelRowTagline}>
                            {item.tagline}
                          </Text>
                          <Text style={styles.modelRowDesc}>
                            {item.description}
                          </Text>
                        </View>
                        {isSelected && (
                          <Ionicons
                            name="checkmark-circle"
                            size={22}
                            color={COLORS.primary}
                          />
                        )}
                      </TouchableOpacity>
                    );
                  }}
                />
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </SafeAreaView>
  );
}

// ── Markdown styles ────────────────────────────────────────────────────────────
const markdownStyles = {
  body: { color: COLORS.text, fontSize: 14, lineHeight: 22 },
  heading1: {
    color: COLORS.text,
    fontFamily: FONT.heading,
    fontSize: 20,
    marginBottom: 8,
  },
  heading2: {
    color: COLORS.text,
    fontFamily: FONT.headingMedium,
    fontSize: 17,
    marginBottom: 6,
  },
  heading3: {
    color: COLORS.textSecondary,
    fontFamily: FONT.headingMedium,
    fontSize: 15,
    marginBottom: 4,
  },
  paragraph: {
    color: COLORS.textSecondary,
    fontSize: 14,
    lineHeight: 22,
    marginBottom: 10,
  },
  code_inline: {
    backgroundColor: COLORS.surfaceHigh,
    color: COLORS.secondary,
    fontFamily: FONT.mono,
    fontSize: 13,
    paddingHorizontal: 4,
    borderRadius: 4,
  },
  fence: {
    backgroundColor: COLORS.surfaceLow,
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
  },
  code_block: {
    backgroundColor: COLORS.surfaceLow,
    color: COLORS.text,
    fontFamily: FONT.mono,
    fontSize: 13,
    lineHeight: 20,
    padding: 12,
    borderRadius: 10,
  },
  bullet_list: { marginBottom: 8 },
  list_item: { color: COLORS.textSecondary, fontSize: 14, lineHeight: 22 },
  strong: { color: COLORS.text, fontWeight: "700" as const },
};

// ── Styles ─────────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.background },
  scrollContent: { padding: SPACING[4], paddingBottom: 80 },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: SPACING[5],
  },
  headerLeft: { flexDirection: "row", alignItems: "center", gap: 10 },
  headerTitle: { fontSize: 22 },

  section: { marginBottom: SPACING[4] },
  sectionLabelRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  label: {
    color: COLORS.textMuted,
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 1.2,
    textTransform: "uppercase",
    fontFamily: FONT.monoMedium,
  },
  infoBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.surfaceContainer,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  infoBtnText: {
    color: COLORS.textMuted,
    fontSize: 11,
    fontFamily: FONT.monoMedium,
  },

  modelScroll: { paddingBottom: 4, paddingTop: 2 },

  activeModelPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 10,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.surfaceContainer,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignSelf: "flex-start",
  },
  activeModelText: {
    color: COLORS.textMuted,
    fontSize: 12,
    fontFamily: FONT.mono,
  },
  activeModelName: {
    fontWeight: "700",
  },

  modeRow: {
    flexDirection: "row",
    gap: SPACING[2],
    marginBottom: SPACING[4],
  },
  modeBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 10,
    borderRadius: RADIUS.lg,
    backgroundColor: COLORS.surfaceContainer,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  modeBtnActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  modeBtnText: {
    color: COLORS.textMuted,
    fontFamily: FONT.monoMedium,
    fontSize: 12,
  },
  modeBtnTextActive: { color: COLORS.onPrimary },

  langSelector: {
    height: 52,
    backgroundColor: COLORS.surfaceContainer,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.md,
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  langLeft: { flexDirection: "row", alignItems: "center", gap: 10 },
  langDot: { width: 10, height: 10, borderRadius: 5 },
  langText: { color: COLORS.text, fontSize: 15, fontFamily: FONT.mono },

  clearText: { color: COLORS.error, fontSize: 12, fontFamily: FONT.bodyMedium },

  codeInput: {
    minHeight: 200,
    backgroundColor: COLORS.surfaceContainer,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.lg,
    padding: 16,
    color: COLORS.text,
    fontSize: 13,
    lineHeight: 22,
    fontFamily: FONT.mono,
  },

  analyzeBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    paddingVertical: 14,
    borderRadius: RADIUS.lg,
    marginBottom: SPACING[5],
  },
  analyzeBtnDisabled: { opacity: 0.45 },
  analyzeBtnText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 15,
    fontFamily: FONT.bodyMedium,
  },

  loadingState: {
    alignItems: "center",
    gap: 10,
    paddingVertical: 32,
  },
  loadingText: {
    color: COLORS.text,
    fontFamily: FONT.bodyMedium,
    fontSize: 15,
    fontWeight: "600",
  },
  loadingSubtext: {
    color: COLORS.textMuted,
    fontFamily: FONT.body,
    fontSize: 12,
    textAlign: "center",
    paddingHorizontal: 32,
  },

  resultContainer: { marginTop: SPACING[2] },
  resultHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
  },
  resultHeaderLeft: { flexDirection: "row", alignItems: "center", gap: 8 },
  resultHeaderRight: { flexDirection: "row", alignItems: "center", gap: 8 },
  resultTitle: {
    color: COLORS.text,
    fontSize: 20,
    fontWeight: "800",
    fontFamily: FONT.heading,
  },
  modelUsedBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    backgroundColor: COLORS.surfaceContainer,
  },
  modelUsedText: { fontSize: 11, fontWeight: "700", fontFamily: FONT.mono },
  closeResultBtn: {
    height: 32,
    width: 32,
    borderRadius: 8,
    backgroundColor: COLORS.surfaceContainer,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  resultCard: {
    backgroundColor: COLORS.surfaceContainer,
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
    borderColor: COLORS.border,
  },

  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "flex-end",
  },
  sheet: {
    backgroundColor: COLORS.surfaceLow,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 40,
    paddingTop: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
    maxHeight: "70%",
  },
  modelSheet: { maxHeight: "85%", paddingTop: 0 },
  modelSheetHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  sheetCloseBtn: {
    height: 32,
    width: 32,
    borderRadius: 8,
    backgroundColor: COLORS.surfaceContainer,
    justifyContent: "center",
    alignItems: "center",
  },
  sheetTitle: {
    color: COLORS.textMuted,
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 1.2,
    textTransform: "uppercase",
    fontFamily: FONT.mono,
  },
  sheetItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 20,
    paddingVertical: 14,
  },
  sheetItemText: { color: COLORS.text, fontSize: 15, fontFamily: FONT.mono },
  sheetItemActive: { color: COLORS.primary },

  modelRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 14,
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  modelRowSelected: { backgroundColor: `${COLORS.primary}0D` },
  modelRowIcon: {
    height: 44,
    width: 44,
    borderRadius: RADIUS.lg,
    justifyContent: "center",
    alignItems: "center",
    flexShrink: 0,
  },
  modelRowInfo: { flex: 1, gap: 3 },
  modelRowTop: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    flexWrap: "wrap",
  },
  modelRowName: {
    color: COLORS.text,
    fontSize: 15,
    fontWeight: "700",
    fontFamily: FONT.heading,
  },
  modelRowBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: RADIUS.full,
    borderWidth: 1,
  },
  modelRowBadgeText: {
    fontSize: 9,
    fontWeight: "800",
    fontFamily: FONT.mono,
    letterSpacing: 0.8,
  },
  modelRowTagline: {
    color: COLORS.textMuted,
    fontSize: 12,
    fontFamily: FONT.mono,
  },
  modelRowDesc: {
    color: COLORS.textSecondary,
    fontSize: 12,
    lineHeight: 18,
    fontFamily: FONT.body,
    marginTop: 2,
  },
  modelRowFreeBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: RADIUS.full,
    backgroundColor: "rgba(126,231,135,0.12)",
    borderWidth: 1,
    borderColor: "rgba(126,231,135,0.30)",
  },
  modelRowFreeText: {
    fontSize: 9,
    fontWeight: "800",
    fontFamily: FONT.mono,
    letterSpacing: 0.8,
    color: "#7EE787",
  },
});
