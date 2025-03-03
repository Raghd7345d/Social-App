import React, { useState } from "react";
import { Text, View, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { useRouter } from "expo-router";
import ScreenWrapper from "../../components/ScreenWrapper";
import { theme } from "../../constants/theme";
import { hp, wp } from "../../helpers/common";
import { supabase } from "../../lip/supabase";
import { useAuth } from "../../contexts/AuthContext";
import BackButton from "../../components/BackButton";
import AvatarImage from "../../components/AvatarImage";
import Header from "../../components/Header";
import { Pressable } from "react-native";
import Icon from "../../assets/Icons";
import { fetchPosts } from "../../sevices/postService";
import { FlatList } from "react-native";
import PostCard from "../../components/PostCard";
import Loading from "../../components/Loading";
import { useEffect } from "react";
let limit = 0;

export default function Profile() {
  const router = useRouter();
  const { user, setAuth } = useAuth();
  const [posts, setPosts] = useState([]);
  const [hasMore, setHasMore] = useState(true);

  async function getPost() {
    if (!hasMore) return null;

    limit = limit + 10;
    let res = await fetchPosts(limit, user.id);
    if (res.success) {
      if (posts.length === res.data.length) setHasMore(false);
      setPosts(res.data);
    }
  }

  const handleLogout = async () => {
    Alert.alert(
      "Confirm Logout",
      "Are you sure you want to log out? The app might cry...",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Logout canceled"),
          style: "cancel",
        },
        {
          text: "Logout",
          onPress: async () => {
            const { error } = await supabase.auth.signOut();
            if (error) {
              Alert.alert("Error", "Error signing out");
            } else {
              setAuth(null);
            }
          },
          style: "destructive",
        },
      ]
    );
  };
  // useEffect(() => {
  //   let commentChannel = supabase
  //     .channel("realtime-comments")
  //     .on(
  //       "postgres_changes",
  //       { event: "*", schema: "public", table: "comments" },
  //       handlePostComments
  //     )
  //     .subscribe();
  //   // getPostCommnetsCount();
  //   return () => {
  //     supabase.removeChannel(commentChannel).catch(console.error);
  //   };
  // }, []);
  // async function handlePostComments(payload) {
  //   console.log("New comment event received:", payload);

  //   // Re-fetch posts to update the comment count
  //   let res = await fetchPosts();
  //   if (res.success) {
  //     setPosts(res.data);
  //   } else {
  //     console.error("Error fetching updated posts:", res.error);
  //   }
  // }
  return (
    <ScreenWrapper>
      <FlatList
        data={posts}
        ListHeaderComponent={
          <Userheader user={user} router={router} handleLogout={handleLogout} />
        }
        ListHeaderComponentStyle={{ marginBottom: 30 }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listStyle}
        keyExtractor={(item, index) =>
          item.id ? item.id.toString() : `post-${index}`
        }
        renderItem={({ item }) => (
          <PostCard item={item} currentUser={user} router={router} />
        )}
        ListFooterComponent={
          <View style={{ marginVertical: posts.length === 0 ? 100 : 30 }}>
            {hasMore ? (
              <Loading />
            ) : (
              <View style={{ marginVertical: 30 }}>
                <Text style={styles.EndText}>
                  No more posts available. You've seen everything!
                </Text>
              </View>
            )}
          </View>
        }
        onEndReached={() => {
          getPost();
        }}
      />
    </ScreenWrapper>
  );
}

const Userheader = ({ user, router, handleLogout }) => {
  return (
    <View
      style={{ flex: 1, backgroundColor: "white", paddingHorizontal: wp(4) }}
    >
      <View>
        <Header title="Profile" mb={30} />
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Icon name="logout" color={theme.colors.rose} />
        </TouchableOpacity>
      </View>
      <View style={styles.container}>
        <View style={{ gap: 12 }}>
          <View style={styles.avatarContainer}>
            <AvatarImage
              uri={user?.image}
              size={hp(19)}
              rounded={theme.redius.xxl * 1.4}
            />
            <Pressable
              style={styles.editIcon}
              onPress={() => router.push("editProfile")}
            >
              <Icon
                name="edit"
                strokeWidth={2.6}
                size={20}
                color={theme.colors.darkgray}
              />
            </Pressable>
          </View>
          {/* userName */}
          <View style={{ alignItems: "center", gap: 4 }}>
            <Text style={styles.userName}>{user?.name}</Text>
            <Text style={styles.infoText}>{user?.adress}</Text>
          </View>
          <View style={{ gap: 10 }}>
            <View style={styles.info}>
              <Icon
                name="mail"
                size={20}
                strokeWidth={1.6}
                color={theme.colors.textLight}
              />
              <Text style={styles.infoText}>{user?.email}</Text>
            </View>
          </View>
          {user?.phoneNumber && (
            <View style={styles.info}>
              <Icon
                name="call"
                size={20}
                strokeWidth={1.6}
                color={theme.colors.textLight}
              />
              <Text style={styles.infoText}>{user?.phoneNumber}</Text>
            </View>
          )}
          {user?.bio && <Text style={styles.infoText}>{user.bio}</Text>}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  logoutButton: {
    position: "absolute",
    right: 0,
    padding: 5,
    borderRadius: theme.redius.sm,
    backgroundColor: "#fee2e2",
  },
  avatarContainer: {
    alignSelf: "center",
  },
  editIcon: {
    position: "absolute",
    bottom: 0,
    right: -12,
    padding: 7,
    backgroundColor: "white",
    borderRadius: theme.redius.xxl, // Fixed typo 'redius' to 'radius'
    borderColor: theme.colors.gray,
    borderWidth: 1, // Ensures the border color is visible
    shadowColor: theme.colors.dark,
    shadowOffset: { width: 0, height: 4 }, // Adds depth to the shadow
    shadowOpacity: 0.8, // Adjust the shadow opacity
    shadowRadius: 4, // Defines the blur radius for the shadow
    elevation: 7,
  },
  userName: {
    fontSize: hp(3),
    fontWeight: "500",
    color: theme.colors.textDark,
  },
  infoText: {
    fontSize: hp(1.6),
    fontWeight: "500",
    color: theme.colors.textDark,
  },
  info: {
    flexDirection: "row",
    justifyContent: "flex-start",
    gap: 10,
    alignItems: "center",
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
    marginHorizontal: wp(4),
  },
  title: {
    color: theme.colors.textLight,
    fontSize: hp(3.8),
    fontWeight: theme.fonts.bold,
  },
  icons: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  listStyle: {
    paddingTop: 20,
    paddingHorizontal: wp(4),
  },
  EndText: {
    textAlign: "center",
    color: theme.colors.textLight,
    fontSize: hp(1.6),
  },
});
