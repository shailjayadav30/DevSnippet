import { COLORS, FONT, RADIUS, SPACING } from "@/theme/theme";
import Ionicons from "@expo/vector-icons/Ionicons";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useCallback, useState } from "react";
import { router, useFocusEffect } from "expo-router";
import Screen from "@/components/layout/Screen";
import LangScrollbar from "@/components/LangScrollbar";
import Typography from "@/components/ui/Typography";
import { getAllSnippets, searchSnippets, deleteSnippet } from "@/database/snippetService";
import type { Snippet } from "@/database/types";

const parseTags = (tags: string): string[] => {
  try {
    return JSON.parse(tags || "[]");
  } catch {
    return [];
  }
};

const SnippetCard = ({
  snippet,
  onDelete,
}: {
  snippet: Snippet;
  onDelete: (id: number) => void;
}) => (
  <TouchableOpacity
    activeOpacity={0.85}
    onPress={() =>
      router.push({
        pathname: "/(tabs)/home/snippets/[id]",
        params: { id: snippet.id.toString() },
      })
    }
  >
    <View style={cardStyles.card}>
      <View style={cardStyles.cardTop}>
        <Text style={cardStyles.fileName} numberOfLines={1}>
          {snippet.file_name}
        </Text>
        <View style={cardStyles.langBadge}>
          <Text style={cardStyles.langText}>{snippet.language}</Text>
        </View>
      </View>

      <Text style={cardStyles.title} numberOfLines={2}>
        {snippet.title}
      </Text>

      <Text numberOfLines={3} style={cardStyles.codePreview}>
        {snippet.code}
      </Text>

      <View style={cardStyles.footer}>
        <View style={cardStyles.tagsRow}>
          {parseTags(snippet.tags)
            .slice(0, 3)
            .map((tag) => (
              <View key={tag} style={cardStyles.tag}>
                <Text style={cardStyles.tagText}>{tag}</Text>
              </View>
            ))}
        </View>
        <View style={cardStyles.footerRight}>
          {snippet.is_bookmarked === 1 && (
            <Ionicons
              name="bookmark"
              size={16}
              color={COLORS.primary}
              style={{ marginRight: 6 }}
            />
          )}
          <TouchableOpacity
            onPress={() => onDelete(snippet.id)}
            activeOpacity={0.7}
            style={cardStyles.deleteBtn}
          >
            <Ionicons name="trash-outline" size={18} color={COLORS.error} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  </TouchableOpacity>
);

const cardStyles = StyleSheet.create({
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
  fileName: {
    color: COLORS.textMuted,
    fontSize: 13,
    fontFamily: FONT.mono,
    flex: 1,
    marginRight: 8,
  },
  langBadge: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  langText: {
    color: COLORS.onPrimary,
    fontSize: 11,
    fontWeight: "700",
    textTransform: "uppercase",
  },
  title: {
    color: COLORS.text,
    fontSize: 17,
    fontWeight: "700",
    marginTop: 10,
    fontFamily: FONT.heading,
  },
  codePreview: {
    color: COLORS.textMuted,
    marginTop: 8,
    fontFamily: FONT.mono,
    fontSize: 12,
    lineHeight: 18,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 12,
  },
  tagsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
    flex: 1,
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
  footerRight: {
    flexDirection: "row",
    alignItems: "center",
  },
  deleteBtn: {
    height: 34,
    width: 34,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(239,68,68,0.10)",
  },
});

const Index = () => {
  const [snippets, setSnippets] = useState<Snippet[]>([]);
  const [selectedLanguage, setSelectedLanguage] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);

  const loadSnippets = useCallback(async () => {
    setLoading(true);
    try {
      const data = searchQuery.trim()
        ? await searchSnippets(searchQuery.trim())
        : await getAllSnippets(selectedLanguage);
      setSnippets(data);
    } catch (error) {
      console.log("Error fetching snippets", error);
    } finally {
      setLoading(false);
    }
  }, [selectedLanguage, searchQuery]);

  useFocusEffect(
    useCallback(() => {
      loadSnippets();
    }, [loadSnippets])
  );

  const handleDelete = (id: number) => {
    Alert.alert("Delete Snippet", "Are you sure you want to delete this snippet?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            await deleteSnippet(id);
            setSnippets((prev) => prev.filter((s) => s.id !== id));
          } catch (error) {
            console.log("Delete error", error);
          }
        },
      },
    ]);
  };

  return (
    <Screen style={styles.container}>
      <StatusBar hidden={true} />
      <View style={styles.mainContainer}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Search */}
          <View style={styles.inputContainer}>
            <Ionicons size={18} name="search" color={COLORS.textMuted} />
            <TextInput
              placeholderTextColor={COLORS.textMuted}
              style={styles.textInput}
              placeholder="Search snippets..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              returnKeyType="search"
              onSubmitEditing={loadSnippets}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery("")}>
                <Ionicons name="close-circle" size={18} color={COLORS.textMuted} />
              </TouchableOpacity>
            )}
          </View>

          {/* Language filter */}
          {!searchQuery && (
            <View style={styles.scrollBar}>
              <LangScrollbar
                selectedLanguage={selectedLanguage}
                onSelectLanguage={(lang) => {
                  setSelectedLanguage(lang);
                }}
              />
            </View>
          )}

          {/* Header row */}
          <View style={styles.btnContainer}>
            <Typography variant="headingMedium">
              {searchQuery ? `Results for "${searchQuery}"` : "Recent Snippets"}
            </Typography>
            <TouchableOpacity
              onPress={() => router.push("/(tabs)/home/createSnippet")}
              activeOpacity={0.8}
            >
              <Typography variant="monoMedium" color={COLORS.primary}>
                + New
              </Typography>
            </TouchableOpacity>
          </View>

          {/* Content */}
          <View style={styles.cardsContainer}>
            {loading ? (
              <ActivityIndicator
                color={COLORS.primary}
                size="large"
                style={{ marginTop: 40 }}
              />
            ) : snippets.length === 0 ? (
              <View style={styles.emptyState}>
                <Ionicons
                  name="code-slash-outline"
                  size={48}
                  color={COLORS.textMuted}
                />
                <Typography
                  variant="bodyMedium"
                  color={COLORS.textMuted}
                  style={{ marginTop: 12, textAlign: "center" }}
                >
                  {searchQuery
                    ? "No snippets matched your search."
                    : "No snippets yet. Tap + New to create one."}
                </Typography>
              </View>
            ) : (
              snippets.map((snippet) => (
                <SnippetCard
                  key={snippet.id}
                  snippet={snippet}
                  onDelete={handleDelete}
                />
              ))
            )}
          </View>
        </ScrollView>

        {/* FAB */}
        <TouchableOpacity
          onPress={() => router.push("/(tabs)/home/createSnippet")}
          style={styles.fab}
          activeOpacity={0.8}
        >
          <Ionicons name="add" color={COLORS.onPrimary} size={28} />
        </TouchableOpacity>
      </View>
    </Screen>
  );
};

export default Index;

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.background,
  },
  mainContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 120,
  },
  inputContainer: {
    height: 52,
    backgroundColor: COLORS.surfaceContainer,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    paddingHorizontal: SPACING[3],
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING[2],
    borderColor: COLORS.border,
  },
  textInput: {
    color: COLORS.text,
    fontSize: 15,
    fontFamily: FONT.bodyMedium,
    flex: 1,
  },
  scrollBar: {
    marginTop: SPACING[4],
  },
  btnContainer: {
    marginTop: SPACING[5],
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  cardsContainer: {
    marginTop: SPACING[4],
    gap: SPACING[3],
  },
  emptyState: {
    alignItems: "center",
    marginTop: 60,
    paddingHorizontal: 20,
  },
  fab: {
    borderRadius: 50,
    height: 56,
    width: 56,
    backgroundColor: COLORS.primary,
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    bottom: 8,
    right: SPACING[4],
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 8,
  },
});
