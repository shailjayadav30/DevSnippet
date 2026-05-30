import React from "react";
import {
  Text as RNText,
  TextProps,
  StyleSheet,
  TextStyle,
} from "react-native";

import { FONT, COLORS } from "@/theme/theme";

type Variant =
  | "body"
  | "bodyMedium"
  | "bodySemiBold"
  | "heading"
  | "headingMedium"
  | "mono"
  | "monoMedium";

interface TypographyProps extends TextProps {
  variant?: Variant;
  color?: string;
  style?: TextStyle | TextStyle[];
  children: React.ReactNode;
}

const fontMap: Record<Variant, string> = {
  body: FONT.body,
  bodyMedium: FONT.bodyMedium,
  bodySemiBold: FONT.bodySemiBold,

  heading: FONT.heading,
  headingMedium: FONT.headingMedium,

  mono: FONT.mono,
  monoMedium: FONT.monoMedium,
};

export default function Typography({
  variant = "body",
  color = COLORS.text,
  style,
  children,
  ...props
}: TypographyProps) {
  return (
    <RNText
      style={[
        styles.text,
        {
          fontFamily: fontMap[variant],
          color,
        },
        style,
      ]}
      {...props}
    >
      {children}
    </RNText>
  );
}

const styles = StyleSheet.create({
  text: {
    fontSize: 14,
    lineHeight: 20,
  },
});