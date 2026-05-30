import React from "react";
import {
  StyleSheet,
  View,
  ViewStyle,
} from "react-native";

import { COLORS, SPACING } from "@/theme/theme";
import { SafeAreaView } from "react-native-safe-area-context";
interface ScreenProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

export default function Screen({
  children,
  style,
}: ScreenProps) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={[styles.container, style]}>
        {children}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  container: {
    flex: 1,

    paddingTop: SPACING[4],
    paddingBottom: SPACING[4],
    paddingHorizontal: SPACING[4],

    backgroundColor: COLORS.background,
  },
});