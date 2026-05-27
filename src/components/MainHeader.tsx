import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

import { BlurView } from "expo-blur";

import Ionicons from "@expo/vector-icons/Ionicons";

import { COLORS, FONT } from "@/theme/theme";
import { useNavigation } from "expo-router";
const MainHeader = () => {
  const navigation:any = useNavigation();
  return (
    <SafeAreaView edges={["top"]} style={styles.safeArea}>
      <BlurView intensity={40} tint="dark" style={styles.blurContainer}>
        <View style={styles.container}>
          {/* LEFT BUTTON */}
          <TouchableOpacity
              onPress={() => navigation.openDrawer()}
            activeOpacity={0.7}
            style={styles.iconButton}
          >
            <Ionicons
              name="menu-outline"
              color={COLORS.iconPrimary}
              size={28}
            />
          </TouchableOpacity>

          {/* TITLE */}
          <View style={styles.titleContainer}>
            <Text style={styles.text}>Codezy</Text>
            <Text style={styles.subText}>Seoul Noir Workspace</Text>
          </View>

          {/* RIGHT BUTTON */}
          <TouchableOpacity activeOpacity={0.7} style={styles.addButton}>
            <Ionicons
              name="add-outline"
              //   color={COLORS.iconPrimary}
              color={"#25005A"}
              size={26}
            />
          </TouchableOpacity>
        </View>
      </BlurView>
    </SafeAreaView>
  );
};

export default MainHeader;

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
    height: 90,

    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",

    paddingHorizontal: 20,

    // backgroundColor: "rgba(10,10,10,0.72)",
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

  titleContainer: {
    alignItems: "center",
    justifyContent: "center",
  },

  text: {
    color: COLORS.textPrimary,

    fontFamily: FONT.heading,

    fontSize: 24,

    letterSpacing: 1,
  },

  subText: {
    color: COLORS.textSecondary,

    fontSize: 11,

    marginTop: 2,

    letterSpacing: 1.2,

    textTransform: "uppercase",
  },

  iconButton: {
    width: 46,
    height: 46,

    alignItems: "center",
    justifyContent: "center",

    borderRadius: 16,

    backgroundColor: COLORS.glass,

    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },

  addButton: {
    width: 46,
    height: 46,

    alignItems: "center",
    justifyContent: "center",

    borderRadius: 16,

    // backgroundColor: "rgba(124, 58, 237, 0.15)",
    backgroundColor: "#BB9AFF",

    borderWidth: 1,
    borderColor: "rgba(124, 58, 237, 0.25)",
  },
});
