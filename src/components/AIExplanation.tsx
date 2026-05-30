import { useState } from "react";
import {
  View,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from "react-native";

import Markdown from "react-native-markdown-display";

import Typography from "@/components/ui/Typography";
import { explainCode } from "@/services/apiServices";
import { COLORS, SPACING } from "@/theme/theme";

type Props = {
  code: string;
  language: string;
};

const AIExplanation = ({ code, language }: Props) => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");

  const handleExplain = async () => {
    setLoading(true);

    const res = await explainCode(code, language);

    setResult(res);

    setLoading(false);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.button}
        onPress={handleExplain}
        activeOpacity={0.8}
      >
        <Typography variant="monoMedium" color={COLORS.onPrimary}>
          Explain with AI
        </Typography>
      </TouchableOpacity>

      {loading && (
        <ActivityIndicator
          size="large"
          color={COLORS.primary}
          style={{ marginTop: 20 }}
        />
      )}

      {!!result && (
        <View style={styles.resultBox}>
          <Markdown>{result}</Markdown>
        </View>
      )}
    </View>
  );
};

export default AIExplanation;

const styles = StyleSheet.create({
  container: {
    marginTop: SPACING[5],
  },

  button: {
    backgroundColor: COLORS.primary,
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
  },

  resultBox: {
    marginTop: 20,
    backgroundColor: COLORS.surfaceContainer,
    padding: 16,
    borderRadius: 12,
  },
});