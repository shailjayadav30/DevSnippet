import {
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { BlurView } from "expo-blur";
import Ionicons from "@expo/vector-icons/Ionicons";
import { COLORS, FONT, FONT_SIZE, FONT_WEIGHT } from "@/theme/theme";
import { router } from "expo-router";

const HeaderCreateSnipet = () => {
  const [fileName, setFileName] = useState("New Snippet");
  return (
    <SafeAreaView edges={["top"]} style={styles.safeArea}>
      <BlurView intensity={40} tint="dark" style={styles.blurContainer}>
        <View style={styles.container}>
          <TouchableOpacity
            onPress={() => router.back()}
            activeOpacity={0.8}
            style={styles.backArrow}
          >
            <Ionicons color={COLORS.text} size={24} name="arrow-back-outline" />
          </TouchableOpacity>
          <TextInput
            value={fileName}
            onChangeText={setFileName}
            placeholder="Untitled Snippet"
            placeholderTextColor={COLORS.textMuted}
            style={styles.fileNameInput}
          />

          {/* <TouchableOpacity activeOpacity={0.8} style={styles.saveBtnContainer}>
            <Typography
              style={styles.saveBtn}
              color={COLORS.onPrimary}
              variant="mono"
            >
              Save
            </Typography>
          </TouchableOpacity> */}
        </View>
      </BlurView>
    </SafeAreaView>
  );
};

export default HeaderCreateSnipet;

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: COLORS.background,
  },
  blurContainer: {
    overflow: "hidden",
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },

  container: {
    height: 70,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    backgroundColor: COLORS.background,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 8,
  },
  backArrow: {
    height: 40,
    width: 40,

    borderRadius: 999,

    alignItems: "center",
    justifyContent: "center",

    backgroundColor: COLORS.surfaceContainer,
    borderWidth: 1,
    borderColor: COLORS.border,
  },

  saveBtnContainer: {
    backgroundColor: COLORS.primary,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
  },
  saveBtn: {
    fontWeight: FONT_WEIGHT.bold,
    fontSize: FONT_SIZE.md,
  },
  fileNameInput: {
    flex: 1,

    marginLeft: 14,
    marginRight: 12,

    color: COLORS.text,

    fontSize: FONT_SIZE.lg,

    fontFamily: FONT.headingMedium,

    paddingVertical: 0,
  },
});
