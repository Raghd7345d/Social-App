import { useRouter } from "expo-router";
import { Text, View, StyleSheet } from "react-native";
import BackButton from "./BackButton";
import { hp } from "../helpers/common";
import { theme } from "../constants/theme";
import { color } from "@rneui/themed/dist/config";

export default function Header({ title, showBackButton = true, mb = 10 }) {
  const router = useRouter();

  return (
    <View style={[styles.container, { marginBottom: mb }]}>
      {showBackButton && (
        <View style={styles.backButton}>
          <BackButton router={router} />
        </View>
      )}

      <Text style={styles.title}>{title || ""}</Text>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 5,
    gap: 10,
  },
  title: {
    fontSize: hp(2.7),
    fontWeight: theme.fonts.semibold,
    color: theme.colors.textDark,
  },
  backButton: {
    position: "absolute",
    left: 0,
  },
});
