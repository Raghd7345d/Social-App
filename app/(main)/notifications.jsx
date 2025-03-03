import { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import ScreenWrapper from "../../components/ScreenWrapper";
import { ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { hp, wp } from "../../helpers/common";
import { useAuth } from "../../contexts/AuthContext";
import NotificationsItem from "../../components/NotificationsItem";
import { fetchNotifications } from "../../sevices/notificatoinsservice";
import { theme } from "../../constants/theme";
import Header from "../../components/Header";

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const { user } = useAuth();
  const router = useRouter();

  async function getNotification() {
    try {
      const res = await fetchNotifications(user.id);
      if (res.success && Array.isArray(res.data)) {
        setNotifications(res.data);
      } else {
        console.error("Invalid notification data", res);
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  }

  useEffect(() => {
    getNotification();
  }, []);
  return (
    <ScreenWrapper>
      <View style={styles.container}>
        <Header title="Notifications" />
        <ScrollView
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.listStyle}
        >
          {notifications.map((item) => {
            return (
              <NotificationsItem item={item} key={item?.id} router={router} />
            );
          })}
          {notifications.length === 0 && (
            <Text style={styles.noData}>
              No notifications left. Your phone finally gets a break!
            </Text>
          )}
        </ScrollView>
      </View>
    </ScreenWrapper>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: wp(4),
  },
  listStyle: {
    paddingVertical: 20,
    gap: 10,
  },
  noData: {
    fontSize: hp(1.8),
    fontWeight: theme.fonts.medium,
    color: theme.colors.text,
    textAlign: "center",
  },
});
