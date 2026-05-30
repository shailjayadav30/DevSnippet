import Ionicons from "@expo/vector-icons/Ionicons";
import { useFocusEffect, router } from "expo-router";
import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import {
  getBookmarkedSnippets,
  toggleBookmark,
} from "@/database/snippetService";
import type { Snippet } from "@/database/types";
import { COLORS, FONT, RADIUS, SPACING } from "@/theme/theme";
import Typography from "@/components/ui/Typography";

const parseTags = (tags: string): string[] => {
  try {
    return JSON.parse(tags || "[]");
  } catch {
    return [];
  }
};

export default function SavedScreen() {
  const [snippets, setSnippets] = useState<Snippet[]>([]);
  const [loading, setLoading] = useState(false);

  const loadBookmarked = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getBookmarkedSnippets();
      setSnippets(data);
    } catch (e) {
      console.log("Saved load error", e);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadBookmarked();
    }, [loadBookmarked])
  );

  const handleRemoveBookmark = (snippet: Snippet) => {
    Alert.alert("Remove from Saved", `Remove "${snippet.title}" from saved?`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Remove",
        style: "destructive",
        onPress: async () => {
          await toggleBookmark(snippet.id, snippet.is_bookmarked);
          setSnippets((prev) => prev.filter((s) => s.id !== snippet.id));
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Ionicons name="bookmark" size={22} color={COLORS.primary} />
            <Typography variant="heading" style={styles.headerTitle}>
              Saved Snippets
            </Typography>
          </View>
          <View style={styles.countBadge}>
            <Text style={styles.countText}>{snippets.length}</Text>
          </View>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {loading ? (
            <ActivityIndicator
              color={COLORS.primary}
              size="large"
              style={{ marginTop: 60 }}
            />
          ) : snippets.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons
                name="bookmark-outline"
                size={56}
                color={COLORS.textMuted}
              />
              <Typography
                variant="headingMedium"
                color={COLORS.textMuted}
                style={styles.emptyTitle}
              >
                No saved snippets
              </Typography>
              <Typography
                variant="body"
                color={COLORS.textMuted}
                style={styles.emptySubtitle}
              >
                Open any snippet and tap the bookmark icon to save it here.
              </Typography>
              <TouchableOpacity
                style={styles.browseBtn}
                onPress={() => router.push("/(tabs)/home")}
                activeOpacity={0.8}
              >
                <Typography variant="monoMedium" color={COLORS.onPrimary}>
                  Browse Snippets
                </Typography>
              </TouchableOpacity>
            </View>
          ) : (
            snippets.map((snippet) => (
              <TouchableOpacity
                key={snippet.id}
                activeOpacity={0.85}
                onPress={() =>
                  router.push({
                    pathname: "/(tabs)/home/snippets/[id]",
                    params: { id: snippet.id.toString() },
                  })
                }
              >
                <View style={styles.card}>
                  <View style={styles.cardTop}>
                    <View style={styles.langBadge}>
                      <Text style={styles.langText}>{snippet.language}</Text>
                    </View>
                    <TouchableOpacity
                      onPress={() => handleRemoveBookmark(snippet)}
                      activeOpacity={0.7}
                      style={styles.bookmarkBtn}
                    >
                      <Ionicons
                        name="bookmark"
                        size={18}
                        color={COLORS.primary}
                      />
                    </TouchableOpacity>
                  </View>

                  <Text style={styles.title} numberOfLines={2}>
                    {snippet.title}
                  </Text>

                  <Text style={styles.fileName} numberOfLines={1}>
                    {snippet.file_name}
                  </Text>

                  <Text numberOfLines={2} style={styles.codePreview}>
                    {snippet.code}
                  </Text>

                  {/* Tags */}
                  <View style={styles.tagsRow}>
                    {parseTags(snippet.tags)
                      .slice(0, 4)
                      .map((tag) => (
                        <View key={tag} style={styles.tag}>
                          <Text style={styles.tagText}>{tag}</Text>
                        </View>
                      ))}
                  </View>
                </View>
              </TouchableOpacity>
            ))
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.background },
  container: { flex: 1, backgroundColor: COLORS.background },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: SPACING[4],
    paddingVertical: SPACING[4],
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  headerTitle: { fontSize: 20 },
  countBadge: {
    backgroundColor: COLORS.surfaceContainer,
    borderRadius: RADIUS.full,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  countText: {
    color: COLORS.primary,
    fontFamily: FONT.monoMedium,
    fontSize: 13,
    fontWeight: "700",
  },
  scrollContent: {
    padding: SPACING[4],
    paddingBottom: 120,
    gap: SPACING[3],
  },
  emptyState: {
    alignItems: "center",
    marginTop: 80,
    paddingHorizontal: SPACING[8],
  },
  emptyTitle: { marginTop: 16, textAlign: "center" },
  emptySubtitle: { marginTop: 8, textAlign: "center", lineHeight: 20 },
  browseBtn: {
    marginTop: 24,
    backgroundColor: COLORS.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: RADIUS.lg,
  },
  card: {
    backgroundColor: COLORS.surfaceContainer,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  cardTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  langBadge: {
    backgroundColor: COLORS.secondaryContainer,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  langText: {
    color: COLORS.secondary,
    fontSize: 11,
    fontWeight: "700",
    textTransform: "uppercase",
    fontFamily: FONT.mono,
  },
  bookmarkBtn: {
    height: 36,
    width: 36,
    borderRadius: 10,
    backgroundColor: "rgba(88,166,255,0.1)",
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    color: COLORS.text,
    fontSize: 17,
    fontWeight: "700",
    marginTop: 10,
    fontFamily: FONT.heading,
  },
  fileName: {
    color: COLORS.textMuted,
    fontSize: 12,
    fontFamily: FONT.mono,
    marginTop: 4,
  },
  codePreview: {
    color: COLORS.textMuted,
    fontFamily: FONT.mono,
    fontSize: 12,
    lineHeight: 18,
    marginTop: 8,
  },
  tagsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
    marginTop: 12,
  },
  tag: {
    backgroundColor: COLORS.surfaceLow,
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  tagText: {
    color: COLORS.primary,
    fontSize: 10,
    fontWeight: "700",
    fontFamily: FONT.mono,
  },
});
