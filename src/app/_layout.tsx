import { Stack } from "expo-router";
import { useFonts } from "expo-font";
import { View } from "react-native";
import { useEffect } from "react";

import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
} from "@expo-google-fonts/inter";

import {
  SpaceGrotesk_500Medium,
  SpaceGrotesk_700Bold,
} from "@expo-google-fonts/space-grotesk";

import {
  JetBrainsMono_400Regular,
  JetBrainsMono_500Medium,
} from "@expo-google-fonts/jetbrains-mono";

import { COLORS } from "@/theme/theme";
import { initDatabase } from "../database/schema";

export default function RootLayout() {
  const [loaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,

    SpaceGrotesk_500Medium,
    SpaceGrotesk_700Bold,

    JetBrainsMono_400Regular,
    JetBrainsMono_500Medium,
  });

  useEffect(() => {
    initDatabase();
  }, []);

  if (!loaded) {
    return null;
  }

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.background }}>
      <Stack screenOptions={{ headerShown: false }} />
    </View>
  );
}