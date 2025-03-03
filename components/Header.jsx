import { useRouter } from "expo-router";
import { Text, View, StyleSheet } from "react-native";
import BackButton from "./BackButton";
import { hp } from "../helpers/common";
import { theme } from "../constants/theme";

export default function Header({
  title,
  showBackButton = true,
  mb = 10,
  avatar,
  headerRight,
}) {
  const router = useRouter();

  return (
    <View style={[styles.container, { marginBottom: mb }]}>
      {/* Left Side: Back Button */}
      {showBackButton && (
        <View style={styles.backButton}>
          <BackButton router={router} />
        </View>
      )}

      {/* Middle: Avatar and Title */}
      <View style={styles.middleContainer}>
        {avatar && <View style={styles.avatar}>{avatar}</View>}
        <Text style={styles.title}>{title || ""}</Text>
      </View>

      {/* Right Side: Icons (Call and Video) */}
      {headerRight && <View style={styles.headerRight}>{headerRight()}</View>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between", // Space between left, middle, and right
    paddingHorizontal: 10, // Add some padding
  },
  backButton: {
    marginRight: 10, // Space between back button and middle content
  },
  middleContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  title: {
    fontSize: hp(2.7),
    fontWeight: theme.fonts.semibold,
    color: theme.colors.textDark,
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 15, // Space between icons
  },
});
