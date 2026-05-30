import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";

import Typography from "@/components/ui/Typography";
import { COLORS, FONT, RADIUS, SPACING } from "@/theme/theme";

type Props = {
  selectedLanguage: string;
  onSelectLanguage: (language: string) => void;
};

const languages = [
  "All",
  "JavaScript",
  "TypeScript",
  "React",
  "React Native",
  "HTML",
  "CSS",
  "Node.js",
  "Python",
  "Java",
  "C++",
  "Go",
  "Rust",
  "SQL",
];

const LangScrollbar = ({ selectedLanguage, onSelectLanguage }: Props) => {
  return (
    <View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {languages.map((lang) => {
          const isSelected = selectedLanguage === lang;

          return (
            <TouchableOpacity
              key={lang}
              activeOpacity={0.8}
              onPress={() => onSelectLanguage(lang)}
              style={[
                styles.languageChip,
                isSelected ? styles.selectedChip : undefined,
              ]}
            >
              <Typography
                variant="monoMedium"
                style={[
                  styles.languageText,
                  ...(isSelected ? [styles.selectedText] : []),
                ]}
              >
                {lang}
              </Typography>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

export default LangScrollbar;

const styles = StyleSheet.create({
  scrollContent: {
    paddingVertical: SPACING[2],
    gap: SPACING[2],
  },

  languageChip: {
    paddingHorizontal: SPACING[4],
    paddingVertical: SPACING[2],

    borderRadius: RADIUS.full,

    backgroundColor: COLORS.surfaceContainer,
    borderWidth: 1,
    borderColor: COLORS.border,

    justifyContent: "center",
    alignItems: "center",
  },

  selectedChip: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },

  languageText: {
    color: COLORS.textSecondary,
    fontSize: 12,
    fontFamily: FONT.monoMedium,
  },

  selectedText: {
    color: COLORS.onPrimary,
  },
});
