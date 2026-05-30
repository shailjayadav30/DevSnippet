
import { StyleSheet, View } from "react-native";
import EditorHeader from "./EditorHeader";
import AppCodeEditor from "./CodeEditor";
import type { Languages } from "@rivascva/react-native-code-editor/lib/typescript/languages";
type Props = {
  language:Languages;
  code: string;
  onCodeChange: (code: string) => void;
};

const SnippetEditor = ({
  language,
  code,
  onCodeChange,
}: Props) => {
  return (
    <View style={styles.wrapper}>
      <EditorHeader
        language={language}
        code={code}
      />

      <AppCodeEditor
        code={code}
        language={language}
        onChange={onCodeChange}
      />
    </View>
  );
};

export default SnippetEditor;

const styles = StyleSheet.create({
  wrapper: {
    borderRadius: 12,
    overflow: "hidden",

    borderWidth: 1,
    borderColor: "#2A2E38",

    backgroundColor: "#10141A",
  },
});