import Ionicons from "@expo/vector-icons/Ionicons";
import * as Clipboard from "expo-clipboard";
import * as FileSystem from "expo-file-system/legacy";
import { router, useLocalSearchParams } from "expo-router";
import * as Sharing from "expo-sharing";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Markdown from "react-native-markdown-display";

import Screen from "@/components/layout/Screen";
import { getSnippetById, toggleBookmark } from "@/database/snippetService";
import type { Snippet } from "@/database/types";
import { explainCode } from "@/services/apiServices";
import { COLORS, FONT, SPACING } from "@/theme/theme";

export default function SnippetDetailsScreen() {
  const { id } = useLocalSearchParams();

  const [snippet, setSnippet] = useState<Snippet | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiResponse, setAiResponse] = useState<string>("");

  useEffect(() => {
    const numId = Number(Array.isArray(id) ? id[0] : id);
    getSnippetById(numId).then((data) => {
      if (data) setSnippet(data);
    }).catch(console.log);
  }, [id]);

  const parseTags = (tags: string): string[] => {
    try {
      return JSON.parse(tags || "[]");
    } catch {
      return [];
    }
  };

  const copySnippet = async () => {
    if (!snippet) return;
    await Clipboard.setStringAsync(snippet.code);
    Alert.alert("Copied", "Code copied to clipboard.");
  };

  const buildFileContent = (format: "txt" | "js" | "json") => {
    if (!snippet) return { fileName: "", content: "" };
    const safe = snippet.title.replace(/[<>:"/\\|?*]/g, "_");
    switch (format) {
      case "txt":
        return { fileName: `${safe}.txt`, content: snippet.code };
      case "js":
        return { fileName: `${safe}.js`, content: snippet.code };
      case "json":
        return {
          fileName: `${safe}.json`,
          content: JSON.stringify(
            {
              title: snippet.title,
              file_name: snippet.file_name,
              language: snippet.language,
              tags: parseTags(snippet.tags),
              code: snippet.code,
            },
            null,
            2
          ),
        };
    }
  };

  const writeFile = async (format: "txt" | "js" | "json"): Promise<string | null> => {
    const dir = FileSystem.documentDirectory ?? FileSystem.cacheDirectory;
    if (!dir) return null;
    const { fileName, content } = buildFileContent(format);
    const path = `${dir}${fileName}`;
    await FileSystem.writeAsStringAsync(path, content);
    return path;
  };

  const shareSnippet = async (format: "txt" | "js" | "json") => {
    try {
      const available = await Sharing.isAvailableAsync();
      if (!available) { Alert.alert("Sharing not available on this device."); return; }
      const path = await writeFile(format);
      if (path) await Sharing.shareAsync(path);
    } catch (e) {
      console.log("Share error", e);
    }
  };

  const exportSnippet = async (format: "txt" | "js" | "json") => {
    try {
      const path = await writeFile(format);
      if (path) Alert.alert("Exported", `Saved to:\n${path}`);
    } catch (e) {
      console.log("Export error", e);
    }
  };

  const showShareOptions = () =>
    Alert.alert("Share Snippet", "Choose format", [
      { text: ".txt", onPress: () => shareSnippet("txt") },
      { text: ".js", onPress: () => shareSnippet("js") },
      { text: ".json", onPress: () => shareSnippet("json") },
      { text: "Cancel", style: "cancel" },
    ]);

  const showExportOptions = () =>
    Alert.alert("Export Snippet", "Choose format", [
      { text: ".txt", onPress: () => exportSnippet("txt") },
      { text: ".js", onPress: () => exportSnippet("js") },
      { text: ".json", onPress: () => exportSnippet("json") },
      { text: "Cancel", style: "cancel" },
    ]);

  const handleBookmark = async () => {
    if (!snippet) return;
    await toggleBookmark(snippet.id, snippet.is_bookmarked);
    setSnippet({ ...snippet, is_bookmarked: snippet.is_bookmarked ? 0 : 1 });
  };

  const handleAiExplain = async () => {
    if (!snippet) return;
    setAiLoading(true);
    setAiResponse("");
    try {
      const response = await explainCode(snippet.code, snippet.language);
      setAiResponse(response);
    } catch {
      setAiResponse("Failed to get AI explanation. Check your API key in Settings.");
    } finally {
      setAiLoading(false);
    }
  };

  if (!snippet) {
    return (
      <Screen style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </Screen>
    );
  }

  return (
    <Screen style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Top bar */}
        <View style={styles.topBar}>
          <TouchableOpacity onPress={() => router.back()} style={styles.iconBtn}>
            <Ionicons name="arrow-back" size={22} color={COLORS.text} />
          </TouchableOpacity>
          <View style={styles.topBarRight}>
            <TouchableOpacity onPress={handleBookmark} style={styles.iconBtn}>
              <Ionicons
                name={snippet.is_bookmarked ? "bookmark" : "bookmark-outline"}
                size={22}
                color={snippet.is_bookmarked ? COLORS.primary : COLORS.text}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() =>
                router.push({
                  pathname: "/(tabs)/home/edit/[id]",
                  params: { id: snippet.id.toString() },
                })
              }
              style={styles.iconBtn}
            >
              <Ionicons name="create-outline" size={22} color={COLORS.text} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Header */}
        <View style={styles.headerSection}>
          <View style={styles.languageBadge}>
            <Text style={styles.languageText}>{snippet.language}</Text>
          </View>
          <Text style={styles.fileName}>{snippet.file_name}</Text>
          <Text style={styles.title}>{snippet.title}</Text>
        </View>

        {/* Code card */}
        <View style={styles.codeCard}>
          <View style={styles.codeHeader}>
            <Text style={styles.codeFileName}>{snippet.file_name}</Text>
            <Text style={styles.lineText}>
              {snippet.code.split("\n").length} lines
            </Text>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <Text style={styles.codeText}>{snippet.code}</Text>
          </ScrollView>
        </View>

        {/* Action buttons */}
        <View style={styles.actionGrid}>
          <TouchableOpacity
            onPress={copySnippet}
            style={[styles.actionBtn, styles.primaryBtn]}
          >
            <Ionicons name="copy-outline" size={20} color={COLORS.onPrimary} />
            <Text style={styles.primaryBtnText}>Copy</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={showShareOptions} style={styles.actionBtn}>
            <Ionicons name="share-social-outline" size={20} color={COLORS.text} />
            <Text style={styles.secondaryBtnText}>Share</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={showExportOptions} style={styles.actionBtn}>
            <Ionicons name="download-outline" size={20} color={COLORS.text} />
            <Text style={styles.secondaryBtnText}>Export</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleAiExplain}
            style={[styles.actionBtn, styles.aiBtn]}
            disabled={aiLoading}
          >
            <Ionicons name="sparkles-outline" size={20} color="#fff" />
            <Text style={styles.primaryBtnText}>
              {aiLoading ? "Thinking..." : "AI Explain"}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Tags */}
        <View style={styles.tagsRow}>
          {parseTags(snippet.tags).map((tag) => (
            <View key={tag} style={styles.tag}>
              <Text style={styles.tagText}>{tag}</Text>
            </View>
          ))}
        </View>

        {/* AI loading */}
        {aiLoading && (
          <View style={styles.aiLoadingContainer}>
            <ActivityIndicator color={COLORS.secondary} size="large" />
            <Text style={styles.aiLoadingText}>Analyzing your code...</Text>
          </View>
        )}

        {/* AI response with Markdown */}
        {!!aiResponse && !aiLoading && (
          <View style={styles.aiContainer}>
            <View style={styles.aiTitleRow}>
              <Ionicons name="sparkles" size={20} color={COLORS.secondary} />
              <Text style={styles.aiTitle}>AI Insights</Text>
            </View>
            <View style={styles.aiCard}>
              <Markdown style={markdownStyles}>{aiResponse}</Markdown>
            </View>
          </View>
        )}
      </ScrollView>
    </Screen>
  );
}

const markdownStyles = {
  body: { color: COLORS.text, fontSize: 14, lineHeight: 22 },
  heading1: { color: COLORS.text, fontFamily: FONT.heading, fontSize: 20, marginBottom: 8 },
  heading2: { color: COLORS.text, fontFamily: FONT.headingMedium, fontSize: 17, marginBottom: 6 },
  heading3: { color: COLORS.textSecondary, fontFamily: FONT.headingMedium, fontSize: 15, marginBottom: 4 },
  paragraph: { color: COLORS.textSecondary, fontSize: 14, lineHeight: 22, marginBottom: 10 },
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
  em: { color: COLORS.textMuted, fontStyle: "italic" as const },
};

const styles = StyleSheet.create({
  container: { backgroundColor: COLORS.background },
  scrollContent: { paddingBottom: 120 },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.background,
  },
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  topBarRight: { flexDirection: "row", gap: 8 },
  iconBtn: {
    height: 44,
    width: 44,
    borderRadius: 12,
    backgroundColor: COLORS.surfaceContainer,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  headerSection: { marginTop: SPACING[6] },
  languageBadge: {
    alignSelf: "flex-start",
    backgroundColor: COLORS.secondaryContainer,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    marginBottom: 12,
  },
  languageText: {
    color: COLORS.secondary,
    fontSize: 12,
    fontWeight: "700",
    textTransform: "uppercase",
    fontFamily: FONT.mono,
  },
  fileName: { color: COLORS.textMuted, fontSize: 13, fontFamily: FONT.mono },
  title: {
    color: COLORS.text,
    fontSize: 28,
    fontWeight: "800",
    marginTop: 6,
    lineHeight: 36,
    fontFamily: FONT.heading,
  },
  codeCard: {
    marginTop: SPACING[6],
    backgroundColor: COLORS.surfaceLowest,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: COLORS.border,
    overflow: "hidden",
  },
  codeHeader: {
    height: 48,
    backgroundColor: COLORS.surfaceLow,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
  },
  codeFileName: { color: COLORS.text, fontSize: 14, fontWeight: "700", fontFamily: FONT.mono },
  lineText: { color: COLORS.textMuted, fontSize: 12, fontFamily: FONT.mono },
  codeText: {
    color: COLORS.text,
    padding: 16,
    fontSize: 14,
    lineHeight: 22,
    fontFamily: FONT.mono,
    minWidth: "100%",
  },
  actionGrid: {
    marginTop: SPACING[6],
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  actionBtn: {
    flex: 1,
    minWidth: "47%",
    height: 56,
    borderRadius: 14,
    backgroundColor: COLORS.surfaceContainer,
    borderWidth: 1,
    borderColor: COLORS.border,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    gap: 8,
  },
  primaryBtn: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  aiBtn: { backgroundColor: COLORS.secondaryContainer, borderColor: COLORS.secondary },
  primaryBtnText: { color: COLORS.onPrimary, fontWeight: "700", fontSize: 14 },
  secondaryBtnText: { color: COLORS.text, fontWeight: "700", fontSize: 14 },
  tagsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: SPACING[5],
  },
  tag: {
    backgroundColor: COLORS.surfaceContainer,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  tagText: { color: COLORS.primary, fontSize: 12, fontWeight: "700", fontFamily: FONT.mono },
  aiLoadingContainer: {
    alignItems: "center",
    marginTop: SPACING[8],
    gap: 12,
  },
  aiLoadingText: { color: COLORS.textMuted, fontSize: 14, fontFamily: FONT.body },
  aiContainer: { marginTop: SPACING[8] },
  aiTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 16,
  },
  aiTitle: {
    color: COLORS.text,
    fontSize: 22,
    fontWeight: "800",
    fontFamily: FONT.heading,
  },
  aiCard: {
    backgroundColor: COLORS.surfaceContainer,
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
});
