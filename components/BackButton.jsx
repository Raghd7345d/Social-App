import { Text, View, StyleSheet, Pressable } from "react-native";
import ArrowLeft from "../assets/Icons/ArrowLeft";
import Icon from "../assets/Icons";
import { theme } from "../constants/theme";
import { router } from "expo-router";
import { hp } from "../helpers/common";

export default function BackButton({ size = 40, router }) {
  return (
    <Pressable onPress={() => router.back()} style={styles.button}>
      <Icon
        name="arrowLeft"
        color={theme.colors.darkgray}
        strokeWidth={2.5}
        size={size}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: "center",
    justifyContent: "center",
    height: hp(6),
    alignSelf: "flex-start",
    padding: 5,
    backgroundColor: theme.colors.gray,
    borderRadius: theme.redius.sm,
  },
});
