import { StyleSheet, View } from "react-native";

import CodeEditor, {
  CodeEditorSyntaxStyles,
} from "@rivascva/react-native-code-editor";
import type { Languages } from "@rivascva/react-native-code-editor/lib/typescript/languages";
type Props = {
  code: string;
  language: Languages;
  onChange: (value: string) => void;
};

const AppCodeEditor = ({  code,language, onChange }: Props) => {
  return (
    <View style={styles.container}>
      <CodeEditor
        style={{
          fontSize: 16,
          inputLineHeight: 26,
          highlighterLineHeight: 26,
          inputColor: "#abb2bf",
            padding: 16,
  fontFamily: "monospace",
        }}
        initialValue={code}
        language={language}
        syntaxStyle={CodeEditorSyntaxStyles.atomOneDark}
        onChange={onChange}
        showLineNumbers
        
      />
    </View>
  );
};

export default AppCodeEditor;

const styles = StyleSheet.create({
  container: {
    minHeight: 420,
    backgroundColor: "#10141A",
  },

  editor: {
    fontSize: 14,
    inputLineHeight: 22,
    highlighterLineHeight: 22,
    padding: 16,
    backgroundColor: "#10141A",
    color: "#E6EDF3",
    fontFamily: "monospace",
  } as any,

  textInput: {
    color: "#E6EDF3",
    fontSize: 14,
    lineHeight: 22,
    fontFamily: "monospace",
    padding: 16,
  },
  highlighter: {
    color: "#E6EDF3",
    fontSize: 14,
    lineHeight: 22,
    fontFamily: "monospace",
    padding: 16,
    backgroundColor: "#10141A",
  },
});
