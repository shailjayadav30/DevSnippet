import { useEffect, useRef, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";

import Typography from "@/components/ui/Typography";
import { COLORS, FONT_SIZE, FONT_WEIGHT } from "@/theme/theme";

import { db } from "@/database/database";
import { updateSnippet } from "@/database/snippetService";

import type { Languages } from "@rivascva/react-native-code-editor/lib/typescript/languages";

const COLOR = {
  background: "#111318",
  surface: "#1A1D24",
  border: "#2A2E38",
  text: "#E2E8F0",
  muted: "#6B7280",
};

const EditSnippet = () => {
  const { id } = useLocalSearchParams();

  const [title, setTitle] = useState("");
  const [fileName, setFileName] = useState("");
  const [language, setLanguage] =
    useState<Languages>("typescript");
  const [code, setCode] = useState("");
  const [tags, setTags] = useState<string[]>([]);

  const [tagInput, setTagInput] = useState("");

  const tagInputRef = useRef<TextInput>(null);

  useEffect(() => {
    if (!id) return;
    const snippetId = Array.isArray(id) ? id[0] : id;

    db.getFirstAsync<any>("SELECT * FROM snippets WHERE id = ?", [snippetId])
      .then((snippet) => {
        if (!snippet) return;
        setTitle(snippet.title || "");
        setFileName(snippet.file_name || "");
        setLanguage(snippet.language as Languages);
        setCode(snippet.code || "");
        if (snippet.tags) setTags(JSON.parse(snippet.tags));
      })
      .catch(console.log);
  }, [id]);

  const handleUpdateSnippet = async () => {
    try {
      await updateSnippet({
        id: Number(Array.isArray(id) ? id[0] : id),
        title,
        fileName,
        language,
        code,
        tags,
      });

      router.back();
    } catch (error) {
      console.log(error);
    }
  };

  const addTag = (value: string) => {
    const cleaned = value.trim().toUpperCase();

    if (cleaned && !tags.includes(cleaned)) {
      setTags((prev) => [...prev, cleaned]);
    }

    setTagInput("");
  };

  return (
    <SafeAreaView
      style={styles.safe}
    >
      <StatusBar
        barStyle="light-content"
      />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={
          Platform.OS === "ios"
            ? "padding"
            : "height"
        }
      >
        <ScrollView
          contentContainerStyle={
            styles.scrollContent
          }
          keyboardShouldPersistTaps="handled"
        >
          {/* TITLE */}
          <View style={styles.section}>
            <Text style={styles.label}>
              TITLE
            </Text>

            <TextInput
              style={styles.input}
              value={title}
              onChangeText={setTitle}
              placeholder="Title"
              placeholderTextColor={
                COLOR.muted
              }
            />
          </View>

          {/* FILE NAME */}
          <View style={styles.section}>
            <Text style={styles.label}>
              FILE NAME
            </Text>

            <TextInput
              style={styles.input}
              value={fileName}
              onChangeText={setFileName}
              placeholder="snippet.ts"
              placeholderTextColor={
                COLOR.muted
              }
            />
          </View>

          {/* TAGS */}
          <View style={styles.section}>
            <Text style={styles.label}>
              TAGS
            </Text>

            <View style={styles.tagsBox}>
              <View style={styles.tagsInner}>
                {tags.map((tag, index) => (
                  <View
                    key={index}
                    style={styles.tag}
                  >
                    <Text
                      style={styles.tagText}
                    >
                      {tag}
                    </Text>

                    <TouchableOpacity
                      onPress={() =>
                        setTags((prev) =>
                          prev.filter(
                            (_, i) =>
                              i !== index
                          )
                        )
                      }
                    >
                      <Ionicons
                        name="close"
                        size={14}
                        color={COLOR.muted}
                      />
                    </TouchableOpacity>
                  </View>
                ))}

                <TextInput
                  ref={tagInputRef}
                  style={styles.tagInput}
                  value={tagInput}
                  onChangeText={setTagInput}
                  placeholder="Add tag"
                  placeholderTextColor={
                    COLOR.muted
                  }
                  onSubmitEditing={() =>
                    addTag(tagInput)
                  }
                />
              </View>
            </View>
          </View>

          {/* CODE */}
          <View style={styles.section}>
            <Text style={styles.label}>
              CODE
            </Text>

            <TextInput
              style={styles.codeInput}
              value={code}
              onChangeText={setCode}
              multiline
              textAlignVertical="top"
              autoCapitalize="none"
              autoCorrect={false}
              placeholder="Write snippet..."
              placeholderTextColor={
                COLOR.muted
              }
            />
          </View>

          {/* SAVE BUTTON */}
          <TouchableOpacity
            onPress={handleUpdateSnippet}
            activeOpacity={0.8}
            style={styles.saveBtnContainer}
          >
            <Typography
              style={styles.saveBtn}
              color={COLORS.inverseText}
              variant="mono"
            >
              Update
            </Typography>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default EditSnippet;

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor:
      COLOR.background,
  },

  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },

  section: {
    marginBottom: 20,
  },

  label: {
    color: COLOR.muted,
    fontSize: 11,
    fontWeight: "700",
    marginBottom: 8,
  },

  input: {
    backgroundColor:
      COLOR.surface,
    borderWidth: 1,
    borderColor: COLOR.border,
    borderRadius: 10,
    padding: 14,
    color: COLOR.text,
  },

  codeInput: {
    minHeight: 300,
    backgroundColor:
      COLOR.surface,
    borderWidth: 1,
    borderColor: COLOR.border,
    borderRadius: 12,
    padding: 16,
    color: COLOR.text,
    fontFamily:
      Platform.OS === "ios"
        ? "Menlo"
        : "monospace",
  },

  tagsBox: {
    backgroundColor:
      COLOR.surface,
    borderWidth: 1,
    borderColor: COLOR.border,
    borderRadius: 10,
    padding: 10,
  },

  tagsInner: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },

  tag: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#2A2E38",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },

  tagText: {
    color: COLOR.text,
  },

  tagInput: {
    color: COLOR.text,
    minWidth: 100,
  },

  saveBtnContainer: {
    backgroundColor:
      COLORS.primary,
    paddingVertical: 14,
    borderRadius: 12,
    marginTop: 20,
    marginBottom: 40,
  },

  saveBtn: {
    textAlign: "center",
    fontSize: FONT_SIZE.md,
    fontWeight: FONT_WEIGHT.bold,
  },
});