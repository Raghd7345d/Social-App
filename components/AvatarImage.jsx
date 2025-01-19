import { View, StyleSheet } from "react-native";
import { hp } from "../helpers/common";
import { theme } from "../constants/theme";
import { Image } from "expo-image";
import { getUserImageSource } from "../sevices/imageService";

export default function AvatarImage({
  uri,
  size = hp(4.5),
  rounded = theme.redius.md,
  style = {},
}) {
  return (
    <Image
      style={[
        styles.avatar,
        { height: size, width: size, borderRadius: rounded },
        style,
      ]}
      source={getUserImageSource(uri)}
      transition={100}
    />
  );
}

const styles = StyleSheet.create({
  avatar: {
    borderCurve: "continuous",
    borderColor: theme.colors.gray,
    borderWidth: 1,
  },
});
