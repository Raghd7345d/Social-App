import { Text, View, StyleSheet, TextInput } from "react-native";
import { theme } from "../constants/theme";
import { hp } from "../helpers/common";

export default function Input(props) {
  return (
    <View
      style={[styles.container, props.containerStyle && props.containerStyle]}
    >
      {props.icon && props.icon}
      <TextInput
        style={{ flex: 1 }}
        placeholderTextColor={theme.colors.textLight}
        ref={props.inputRef && props.inputRef}
        {...props}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: theme.colors.gray,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: theme.redius.xl,
    borderCurve: "circular",
    borderColor: theme.colors.textLight,
    height: hp(8),
    padding: 9,
    borderWidth: 0.4,
    gap: 12,
  },
});
