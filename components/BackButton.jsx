import { Text, View, StyleSheet, Pressable } from "react-native";
import ArrowLeft from "../assets/Icons/ArrowLeft";
import Icon from "../assets/Icons";
import { theme } from "../constants/theme";
import { router } from "expo-router";

export default function BackButton({ size = 40, router }) {
  return (
    <Pressable onPress={() => router.back()} style={styles.button}>
      <Icon
        name="arrowLeft"
        color={theme.colors.primaryDark}
        strokeWidth={2.5}
        size={size}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    alignSelf: "flex-start",
    padding: 5,
    backgroundColor: theme.colors.darkLight,
    borderRadius: theme.redius.sm,
  },
});
