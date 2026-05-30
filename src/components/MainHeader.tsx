import { StyleSheet, View } from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

import { BlurView } from "expo-blur";


import { COLORS } from "@/theme/theme";
import Typography from "./ui/Typography";

const MainHeader = () => {
  return (
    <SafeAreaView edges={["top"]} style={styles.safeArea}>
      <BlurView intensity={40} tint="dark" style={styles.blurContainer}>


        <View style={styles.container}>
          <View style={styles.left}>
            <Typography
              style={styles.heading}
              variant="heading"
              color={COLORS.text}
            >
              CODEZY
            </Typography>
          </View>
          <View style={styles.right}>
            <Typography variant="headingMedium" color={COLORS.text}>
              LOCAL
            </Typography>
          </View>
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

  left: {},
  right: {
    borderColor: COLORS.outlineVariant,
    borderWidth: 1,
    // backgroundColor:"red",
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
  },

  rightText: {},
  heading: {
    fontSize: 20,
  },

});
