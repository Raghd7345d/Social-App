import { Text, View, ActivityIndicator } from "react-native";
import { theme } from "../constants/theme";

export default function Loading({
  size = "large",
  color = theme.colors.primary,
}) {
  return (
    <View style={{ justifyContent: "center", alignItems: "center" }}>
      <ActivityIndicator size={size} color={color} />
    </View>
  );
}
