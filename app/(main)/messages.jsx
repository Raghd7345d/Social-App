import { Pressable, StyleSheet, Text, View } from "react-native";
import ScreenWrapper from "../../components/ScreenWrapper";
import Header from "../../components/Header";
import { theme } from "../../constants/theme";
import Loading from "../../components/Loading";
import { useAuth } from "../../contexts/AuthContext";
import AvatarImage from "../../components/AvatarImage";
import { useEffect, useState } from "react";
import { ChatList } from "../../components/ChatList";
import { getAllUsers, getUserData } from "../../sevices/userService";
import { useRouter } from "expo-router";
import Profile from "./profile";

export default function Messages() {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const fetchUserData = async () => {
      if (user?.id) {
        try {
          const res = await getAllUsers(); // Fetch all users
          if (res.success) {
            // Filter out the current user
            const filteredUsers = res.data.filter((u) => u.id !== user.id);
            setUsers(filteredUsers);
          } else {
            console.error(res.msg);
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      }
    };

    fetchUserData();
  }, [user]); // Add `user` as a dependency to refetch when `user` changes

  return (
    <ScreenWrapper bg="white">
      <View style={styles.container}>
        <View style={styles.header}>
          <Header title="Let us chat!" />
        </View>

        {users.length > 0 ? (
          <ChatList users={users} />
        ) : (
          <View style={styles.loadingContainer}>
            <Loading size="large" />
          </View>
        )}
        <View style={styles.image}>
          <Pressable onPress={() => router.push("profile")}>
            <AvatarImage uri={user?.image} />
          </Pressable>
        </View>
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    backgroundColor: theme.colors.primary,
    padding: 20,
    borderEndStartRadius: theme.redius.xxl,
    borderStartEndRadius: theme.redius.xxl,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    position: "absolute",
    right: 9,
    top: 30,
  },
});
