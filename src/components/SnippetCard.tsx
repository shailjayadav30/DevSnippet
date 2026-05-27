import React from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import Ionicons from "@expo/vector-icons/Ionicons";

import { COLORS, FONT } from "@/theme/theme";

type SnippetCardProps = {
  title: string;
  language: string;
  tags: string[];
  updatedAt: string;
  isFavorite?: boolean;
  onPress?: () => void;
};

const SnippetCard = ({
  title,
  language,
  tags,
  updatedAt,
  isFavorite,
  onPress,
}: SnippetCardProps) => {
  return (
    <TouchableOpacity
      activeOpacity={0.85}
      style={styles.card}
      onPress={onPress}
    >
      {/* TOP SECTION */}
      <View style={styles.topRow}>
        <View style={styles.languageBadge}>
          <Text style={styles.languageText}>
            {language}
          </Text>
        </View>

        <Ionicons
          name={
            isFavorite
              ? "heart"
              : "heart-outline"
          }
          size={20}
          color={
            isFavorite
              ? "#BB9AFF"
              : COLORS.iconSecondary
          }
        />
      </View>

      {/* TITLE */}
      <Text
        numberOfLines={1}
        style={styles.title}
      >
        {title}
      </Text>

      {/* TAGS */}
      <View style={styles.tagsContainer}>
        {tags.map((tag, index) => (
          <View
            key={index}
            style={styles.tag}
          >
            <Text style={styles.tagText}>
              #{tag}
            </Text>
          </View>
        ))}
      </View>

      {/* FOOTER */}
      <View style={styles.footer}>
        <View style={styles.footerLeft}>
          <Ionicons
            name="time-outline"
            size={14}
            color={COLORS.textSecondary}
          />

          <Text style={styles.dateText}>
            {updatedAt}
          </Text>
        </View>

        <Ionicons
          name="chevron-forward"
          size={18}
          color={COLORS.iconSecondary}
        />
      </View>
    </TouchableOpacity>
  );
};

export default SnippetCard;

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.card,

    borderRadius: 24,

    padding: 18,

    marginBottom: 16,

    borderWidth: 1,
    borderColor: COLORS.border,

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 10,

    elevation: 6,
  },

  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",

    marginBottom: 14,
  },

  languageBadge: {
    backgroundColor: "rgba(187,154,255,0.12)",

    paddingHorizontal: 12,
    paddingVertical: 6,

    borderRadius: 999,

    borderWidth: 1,
    borderColor: "rgba(187,154,255,0.25)",
  },

  languageText: {
    color: "#D7C2FF",

    fontSize: 12,

    fontFamily: FONT.bodyMedium,

    letterSpacing: 0.5,
  },

  title: {
    color: COLORS.textPrimary,

    fontSize: 20,

    fontFamily: FONT.heading,

    marginBottom: 14,

    letterSpacing: 0.5,
  },

  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",

    gap: 8,

    marginBottom: 18,
  },

  tag: {
    backgroundColor: COLORS.glass,

    paddingHorizontal: 10,
    paddingVertical: 5,

    borderRadius: 999,
  },

  tagText: {
    color: COLORS.textSecondary,

    fontSize: 11,

    fontFamily: FONT.bodyMedium,
  },

  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  footerLeft: {
    flexDirection: "row",
    alignItems: "center",

    gap: 6,
  },

  dateText: {
    color: COLORS.textSecondary,

    fontSize: 12,

    fontFamily: FONT.bodyMedium,
  },
});