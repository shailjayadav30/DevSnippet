import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as Clipboard from "expo-clipboard";
import type { Languages } from "@rivascva/react-native-code-editor/lib/typescript/languages";
const COLORS = {
  surface: "#1A1D24",
  border: "#2A2E38",
  text: "#E2E8F0",
  muted: "#6B7280",
  accent: "#5B9EF0",
  green: "#4ADE80",
};

const EXT_MAP: Record<string, string> = {
  typescript: "ts",
  javascript: "js",
  python: "py",
  go: "go",
  rust: "rs",
  css: "css",
  html: "html",
  sql: "sql",
};

type Props = { language: Languages; code: string };



const EditorHeader = ({ code,language }: Props) => {
  const [copied, setCopied] = useState(false);
  const ext = EXT_MAP[language] ?? "txt";

  const copyCode = async () => {
    await Clipboard.setStringAsync(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <View style={styles.container}>
      <View style={styles.left}>
        <Ionicons name="document-text-outline" size={16} color={COLORS.accent} />
        <Text style={styles.filename}>editor.{ext}</Text>
      </View>
      <TouchableOpacity onPress={copyCode} activeOpacity={0.7} style={styles.copyBtn}>
        <Ionicons
          name={copied ? "checkmark" : "copy-outline"}
          size={18}
          color={copied ? COLORS.green : COLORS.muted}
        />
      </TouchableOpacity>
    </View>
  );
};

export default EditorHeader;

const styles = StyleSheet.create({
  container: {
    height: 48,
    backgroundColor: "#161B22",
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    borderWidth: 1,
    borderBottomWidth: 0,
    borderColor: "#2A2E38",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 14,
  },
  left: { flexDirection: "row", alignItems: "center", gap: 8 },
  filename: {
    color: COLORS.text,
    fontSize: 13,
    fontWeight: "500",
    fontFamily: "monospace",
  },
  copyBtn: { padding: 4 },
});