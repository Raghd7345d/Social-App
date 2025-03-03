import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import ScreenWrapper from "./ScreenWrapper";
import { theme } from "../constants/theme";
import { useAuth } from "../contexts/AuthContext";
import { hp } from "../helpers/common";
import AvatarImage from "./AvatarImage";
import moment from "moment";

export default function NotificationsItem({ item, router }) {
  const { user } = useAuth();
  function handleClick() {
    let { postId, commentId } = JSON.parse(item?.data);
    router.push({ pathname: "postDetails", params: { postId, commentId } });
  }
  const createdAt = moment(item?.created_at).format("MMM D");

  return (
    <TouchableOpacity style={styles.container} onPress={handleClick}>
      <AvatarImage uri={item?.sender?.image} size={hp(5)} />
      <View style={styles.nameTitle}>
        <Text style={styles.text}>{item?.sender?.name}</Text>
        <Text style={[styles.text, { color: theme.colors.textDark }]}>
          {item?.title}
        </Text>
      </View>
      <Text style={[styles.text, { color: theme.colors.textLight }]}>
        {createdAt}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    backgroundColor: "white",
    borderWidth: 0.5,
    borderColor: theme.colors.darkLight,
    padding: 15,
    borderRadius: theme.redius.xxl,
    borderCurve: "continuous",
  },
  nameTitle: {
    flex: 1,
    gap: 2,
  },
  text: {
    fontSize: hp(1.6),
    fontWeight: theme.fonts.medium,
    color: theme.colors.text,
  },
});
