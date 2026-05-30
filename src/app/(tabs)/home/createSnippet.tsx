import { Ionicons } from "@expo/vector-icons";
import { useRef, useState } from "react";
import {
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { saveSnippet } from "@/database/snippetService";
import { router } from "expo-router";
import Typography from "@/components/ui/Typography";
import { COLORS, FONT_SIZE, FONT_WEIGHT } from "@/theme/theme";
import type { Languages } from "@rivascva/react-native-code-editor/lib/typescript/languages";
const COLOR = {
  background: "#111318",
  surface: "#1A1D24",
  surface2: "#20242D",
  border: "#2A2E38",
  text: "#E2E8F0",
  muted: "#6B7280",
  accent: "#5B9EF0",
  green: "#4ADE80",
  purple: "#C084FC",
  red: "#F87171",
};

// ─── Language config ──────────────────────────────────────────────────────────
export const LANGUAGES: {
  id: string;
  label: string;
  ext: string;
  dot: string;
}[] = [
  { id: "typescript", label: "TypeScript", ext: "ts", dot: "#3178C6" },
  { id: "javascript", label: "JavaScript", ext: "js", dot: "#F7DF1E" },
  { id: "python", label: "Python", ext: "py", dot: "#3572A5" },
  { id: "go", label: "Go", ext: "go", dot: "#00ADD8" },
  { id: "rust", label: "Rust", ext: "rs", dot: "#CE422B" },
  { id: "css", label: "CSS", ext: "css", dot: "#1572B6" },
  { id: "html", label: "HTML", ext: "html", dot: "#E34F26" },
  { id: "sql", label: "SQL", ext: "sql", dot: "#4479A1" },
];

const TagChip = ({
  label,
  onRemove,
}: {
  label: string;
  onRemove: () => void;
}) => (
  <View style={tagStyles.chip}>
    <Text style={tagStyles.label}>{label}</Text>
    <TouchableOpacity
      onPress={onRemove}
      hitSlop={{ top: 8, bottom: 8, left: 4, right: 8 }}
    >
      <Ionicons name="close" size={12} color={COLOR.muted} />
    </TouchableOpacity>
  </View>
);

const tagStyles = StyleSheet.create({
  chip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    borderWidth: 1.5,
    borderColor: "#3A3F4D",
    borderRadius: 8,
    paddingVertical: 4,
    paddingHorizontal: 10,
  },
  label: {
    color: COLOR.text,
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 0.6,
    textTransform: "uppercase",
    fontFamily: Platform.OS === "ios" ? "Menlo" : "monospace",
  },
});

// ─── Language Picker Modal ────────────────────────────────────────────────────
const LanguagePicker = ({
  visible,
  current,
  onSelect,
  onClose,
}: {
  visible: boolean;
  current: string;
  onSelect: (id: string) => void;
  onClose: () => void;
}) => (
  <Modal
    visible={visible}
    transparent
    animationType="fade"
    onRequestClose={onClose}
  >
    <TouchableWithoutFeedback onPress={onClose}>
      <View style={pickerStyles.overlay}>
        <TouchableWithoutFeedback>
          <View style={pickerStyles.sheet}>
            <Text style={pickerStyles.heading}>Select Language</Text>
            <FlatList
              data={LANGUAGES}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={pickerStyles.item}
                  onPress={() => {
                    onSelect(item.id);
                    onClose();
                  }}
                >
                  <View
                    style={[pickerStyles.dot, { backgroundColor: item.dot }]}
                  />
                  <Text
                    style={[
                      pickerStyles.itemLabel,
                      item.id === current && pickerStyles.active,
                    ]}
                  >
                    {item.label}
                  </Text>
                  {item.id === current && (
                    <Ionicons
                      name="checkmark"
                      size={16}
                      color={COLOR.accent}
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
);

const pickerStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "flex-end",
  },
  sheet: {
    backgroundColor: COLOR.surface2,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 40,
    paddingTop: 20,
    borderWidth: 1,
    borderColor: COLOR.border,
  },
  heading: {
    color: COLOR.muted,
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1.2,
    textTransform: "uppercase",
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 20,
    paddingVertical: 14,
  },
  dot: { width: 10, height: 10, borderRadius: 5 },
  itemLabel: {
    color: COLOR.text,
    fontSize: 15,
    fontFamily: Platform.OS === "ios" ? "Menlo" : "monospace",
  },
  active: { color: COLOR.accent },
});

// ─── Main Screen ──────────────────────────────────────────────────────────────
const CreateSnippet = () => {
  const [title, setTitle] = useState("");
  const [tags, setTags] = useState<string[]>(["UI-UX", "REACT"]);
  const [tagInput, setTagInput] = useState("");
  const [language, setLanguage] = useState<Languages>("typescript");
  const [code, setCode] = useState("");
  const [langPickerVisible, setLangPickerVisible] = useState(false);
  const tagInputRef = useRef<TextInput>(null);

  const currentLang = LANGUAGES.find((l) => l.id === language)!;

  const handleSaveSnippets = async () => {
    if (!title.trim()) {
      Alert.alert("Missing Title", "Please enter a title for this snippet.");
      return;
    }
    if (!code.trim()) {
      Alert.alert("Missing Code", "Please paste or write some code.");
      return;
    }
    const ext = LANGUAGES.find((l) => l.id === language)?.ext ?? "txt";
    const derivedFileName = `${title.trim().replace(/\s+/g, "_").toLowerCase()}.${ext}`;
    try {
      await saveSnippet({
        title: title.trim(),
        fileName: derivedFileName,
        language,
        code,
        tags,
      });
      router.back();
    } catch (error) {
      console.log("error", error);
    }
  };

  // When language changes, reset code to template
  const handleSelectLanguage = (id: string) => {
    // cast id to Languages to satisfy state setter typing
    setLanguage(id as Languages);
    // setCode(LANGUAGE_TEMPLATES[id] ?? "");
  };

  const addTag = (value: string) => {
    const cleaned = value.replace(/,/g, "").trim().toUpperCase();
    if (cleaned && !tags.includes(cleaned)) {
      setTags((prev) => [...prev, cleaned]);
    }
    setTagInput("");
  };

  const handleTagKeyPress = (e: any) => {
    if (
      e.nativeEvent.key === "," ||
      e.nativeEvent.key === " " ||
      e.nativeEvent.key === "Enter"
    ) {
      addTag(tagInput);
    }
    if (
      e.nativeEvent.key === "Backspace" &&
      tagInput === "" &&
      tags.length > 0
    ) {
      setTags((prev) => prev.slice(0, -1));
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor={COLOR.background} />

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
          {/* ── TITLE ── */}
          <View style={styles.section}>
            <Text style={styles.label}>TITLE</Text>
            <TextInput
              style={styles.input}
              value={title}
              onChangeText={setTitle}
              placeholder="Enter title..."
              placeholderTextColor={COLOR.muted}
            />
          </View>

          {/* ── LANGUAGE ── */}
          <View style={styles.section}>
            <Text style={styles.label}>LANGUAGE</Text>
            <TouchableOpacity
              style={styles.langSelector}
              onPress={() => setLangPickerVisible(true)}
              activeOpacity={0.8}
            >
              <View style={styles.langLeft}>
                <View
                  style={[styles.langDot, { backgroundColor: currentLang.dot }]}
                />
                <Text style={styles.langText}>{currentLang.label}</Text>
              </View>
              <Ionicons name="chevron-down" size={18} color={COLOR.muted} />
            </TouchableOpacity>
          </View>

          {/* ── TAGS ── */}
          <View style={styles.section}>
            <Text style={styles.label}>TAGS</Text>
            <TouchableOpacity
              style={styles.tagsBox}
              onPress={() => tagInputRef.current?.focus()}
              activeOpacity={1}
            >
              <View style={styles.tagsInner}>
                {tags.map((tag, i) => (
                  <TagChip
                    key={i}
                    label={tag}
                    onRemove={() =>
                      setTags((prev) => prev.filter((_, idx) => idx !== i))
                    }
                  />
                ))}
                <TextInput
                  ref={tagInputRef}
                  style={styles.tagInput}
                  value={tagInput}
                  onChangeText={setTagInput}
                  placeholder={tags.length === 0 ? "Add Tags..." : ""}
                  placeholderTextColor={COLOR.muted}
                  onKeyPress={handleTagKeyPress}
                  onSubmitEditing={() => addTag(tagInput)}
                  returnKeyType="done"
                />
              </View>
            </TouchableOpacity>
          </View>
          <TextInput
            placeholder="Paste your snippet..."
            style={styles.codeInput}
            value={code}
            onChangeText={setCode}
            placeholderTextColor={COLOR.muted}
            multiline
            textAlignVertical="top"
            autoCapitalize="none"
            autoCorrect={false}
          />
   <TouchableOpacity
        onPress={() => handleSaveSnippets()}
        activeOpacity={0.8}
        style={styles.saveBtnContainer}
      >
        <Typography style={styles.saveBtn} color={COLORS.inverseText} variant="mono">
          Save
        </Typography>
      </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>

 
   
      {/* ── LANGUAGE PICKER ── */}
      <LanguagePicker
        visible={langPickerVisible}
        current={language}
        onSelect={handleSelectLanguage}
        onClose={() => setLangPickerVisible(false)}
      />
    </SafeAreaView>
  );
};

export default CreateSnippet;

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLOR.background },

  scrollContent: { padding: 16, paddingBottom: 40 },
  section: { marginBottom: 20 },

  // Label
  label: {
    color: COLOR.muted,
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1.2,
    textTransform: "uppercase",
    marginBottom: 8,
  },

  // Input
  input: {
    height: 52,
    backgroundColor: COLOR.surface,
    borderWidth: 1,
    borderColor: COLOR.border,
    borderRadius: 10,
    paddingHorizontal: 14,
    color: COLOR.text,
    fontSize: 15,
    fontFamily: Platform.OS === "ios" ? "Menlo" : "monospace",
  },

  // Language selector
  langSelector: {
    height: 52,
    backgroundColor: COLOR.surface,
    borderWidth: 1,
    borderColor: COLOR.border,
    borderRadius: 10,
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  langLeft: { flexDirection: "row", alignItems: "center", gap: 10 },
  langDot: { width: 10, height: 10, borderRadius: 5 },
  langText: {
    color: COLOR.text,
    fontSize: 15,
    fontWeight: "500",
    fontFamily: Platform.OS === "ios" ? "Menlo" : "monospace",
  },

  // Tags
  tagsBox: {
    backgroundColor: COLOR.surface,
    borderWidth: 1,
    borderColor: COLOR.border,
    borderRadius: 10,
    padding: 10,
    minHeight: 52,
  },
  tagsInner: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    gap: 8,
  },
  tagInput: {
    color: COLOR.text,
    fontSize: 14,
    fontFamily: Platform.OS === "ios" ? "Menlo" : "monospace",
    minWidth: 100,
    paddingVertical: 4,
  },

  // Bottom bar
  bottomBar: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: COLOR.border,
    backgroundColor: COLOR.background,
  },
  bottomAction: {
    alignItems: "center",
    gap: 3,
    paddingHorizontal: 14,
  },
  bottomLabel: {
    color: COLOR.muted,
    fontSize: 9,
    fontWeight: "700",
    letterSpacing: 0.8,
  },
  bottomSep: {
    width: 1,
    height: 36,
    backgroundColor: COLOR.border,
    marginHorizontal: 4,
  },
  aiBtn: {
    marginLeft: "auto" as any,
    backgroundColor: "#C084FC",
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 14,
  },
  aiBtnText: { color: "#fff", fontSize: 13, fontWeight: "700" },
  autosave: {
    alignItems: "center",
    gap: 2,
    marginLeft: 10,
    maxWidth: 56,
  },
  autosaveText: {
    color: COLOR.muted,
    fontSize: 9,
    fontStyle: "italic",
    lineHeight: 12,
    textAlign: "center",
  },
 saveBtnContainer: {
  backgroundColor: COLORS.primary,
  paddingVertical: 12,
  paddingHorizontal: 16,
  borderRadius: 10,
  alignSelf: "flex-end",
  marginTop: 20,
  marginBottom: 30,
  minWidth: 100,
},
  saveBtn: {
    fontWeight: FONT_WEIGHT.bold,
    fontSize: FONT_SIZE.md,
    textAlign:"center"

  },
  codeInput: {
    minHeight: 200,
    backgroundColor: COLOR.surface,
    borderWidth: 1,
    borderColor: COLOR.border,
    borderRadius: 12,
    padding: 16,

    color: COLOR.text,
    fontSize: 14,
    lineHeight: 24,

    fontFamily: Platform.OS === "ios" ? "Menlo" : "monospace",
  },
});
