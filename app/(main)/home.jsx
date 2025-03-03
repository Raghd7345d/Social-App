import {
  Alert,
  Text,
  View,
  StyleSheet,
  Pressable,
  FlatList,
} from "react-native";
import ScreenWrapper from "../../components/ScreenWrapper";
import { useAuth } from "../../contexts/AuthContext";
import { supabase } from "../../lip/supabase";
import { hp, wp } from "../../helpers/common";
import { theme } from "../../constants/theme";
import Icon from "../../assets/Icons";
import { useRouter } from "expo-router";
import AvatarImage from "../../components/AvatarImage";
import { useState, useEffect } from "react";
import { fetchPosts, fetchPostsCommentsCount } from "../../sevices/postService";
import PostCard from "../../components/PostCard";
import Loading from "../../components/Loading";
import { getUserData } from "../../sevices/userService";

let limit = 0;

export default function Home() {
  const router = useRouter();
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [notificationCount, setNotificationsCount] = useState(0);

  // async function getPostCommnetsCount() {
  //   let res = await fetchPostsCommentsCount(postId);
  //   if (res.success) {
  //     setPosts(res.data);
  //   }
  //   setStartLoading(false);
  // }
  async function handlePostEvents(payload) {
    if (payload.eventType === "INSERT" && payload?.new?.id) {
      let newPost = { ...payload.new };
      let res = await getUserData(newPost.userId);
      newPost.postLikes = [];
      newPost.comments = [{ count: 0 }];
      newPost.user = res.success ? res.data : {};

      setPosts((prevPosts) => [newPost, ...prevPosts]);
    }

    if (payload.eventType === "DELETE" && payload.old?.id) {
      setPosts((prevPosts) =>
        prevPosts.filter((post) => post.id !== payload.old.id)
      );
    }
    if (payload.eventType === "UPDATE" && payload?.new?.id) {
      setPosts((prevPosts) => {
        let updatedPost = prevPosts.map((post) => {
          if (post.id === payload.new.id) {
            post.body = payload.new.body;
            post.file = payload.new.file;
          }
          return post;
        });
        return updatedPost;
      });
    }
  }

  async function handlePostComments(payload) {
    // Re-fetch posts to update the comment count
    let res = await fetchPosts();
    if (res.success) {
      setPosts(res.data);
    } else {
      console.error("Error fetching updated posts:", res.error);
    }
  }
  async function handleNotification(payload) {
    if (payload.eventType == "INSERT" && payload.new.id) {
      setNotificationsCount((prev) => prev + 1);
    }
  }

  useEffect(() => {
    let postChannel = supabase
      .channel("realtime-posts")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "posts" },
        handlePostEvents
      )

      .subscribe();
    let notificationChannel = supabase
      .channel("realtime-notify")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "notifications",
          filter: `receiverId=eq.${user.id}`,
        },
        handleNotification
      )

      .subscribe();
    getPost();

    return () => {
      supabase.removeChannel(postChannel).catch(console.error);
      supabase.removeChannel(notificationChannel).catch(console.error);
    };
  }, []);

  useEffect(() => {
    let commentChannel = supabase
      .channel("realtime-comments")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "comments" },
        handlePostComments
      )
      .subscribe();
    // getPostCommnetsCount();
    return () => {
      supabase.removeChannel(commentChannel).catch(console.error);
    };
  }, []);

  async function getPost() {
    if (!hasMore) return null;

    limit = limit + 10;
    let res = await fetchPosts(limit);
    if (res.success) {
      if (posts.length === res.data.length) setHasMore(false);
      setPosts(res.data);
    }
    // try {
    //   let res = await fetchPosts(limit);
    //   if (res.success) {
    //     setPosts((prevPosts) => {
    //       const newPosts = res.data.filter(
    //         (newPost) => !prevPosts.some((post) => post.id === newPost.id)
    //       );

    //       if (newPosts.length === 0) {
    //         setHasMore(false);
    //       }

    //       return [...prevPosts, ...newPosts];
    //     });

    //     console.log(
    //       "Post IDs:",
    //       res.data.map((p) => p.id)
    //     );
    //   } else {
    //     console.error("Error fetching posts:", res.error);
    //     Alert.alert(
    //       "Error",
    //       "There was a problem fetching posts. Please try again."
    //     );
    //   }
    // } catch (error) {
    //   console.error("Error fetching posts:", error);
    //   Alert.alert("Error", "There was an unexpected error. Please try again.");
    // }
  }
  return (
    <ScreenWrapper>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>SekarMaker</Text>
          <View style={styles.icons}>
            <Pressable
              onPress={() => {
                setNotificationsCount(0);
                router.push("notifications");
              }}
            >
              <Icon
                name="notifications"
                size={24}
                strokeWidth={2}
                color={theme.colors.text}
              />
              {notificationCount > 0 && (
                <View style={styles.pill}>
                  <Text style={styles.pillText}>{notificationCount}</Text>
                </View>
              )}
            </Pressable>
            <Pressable onPress={() => router.push("newPost")}>
              <Icon
                name="plus"
                size={24}
                strokeWidth={2}
                color={theme.colors.text}
              />
            </Pressable>
            <Pressable onPress={() => router.push("messages")}>
              <Icon
                name="messages"
                size={24}
                strokeWidth={2}
                color={theme.colors.text}
              />
            </Pressable>
            <Pressable onPress={() => router.push("profile")}>
              <AvatarImage
                uri={user?.image}
                size={hp(4.3)}
                rounded={theme.redius.sm}
                style={{ borderWidth: 2 }}
              />
            </Pressable>
          </View>
        </View>

        <FlatList
          data={posts}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listStyle}
          keyExtractor={(item, index) =>
            item.id ? item.id.toString() : `post-${index}`
          }
          renderItem={({ item }) => (
            <PostCard item={item} currentUser={user} router={router} />
          )}
          ListFooterComponent={
            <View style={{ marginVertical: posts.length === 0 ? 200 : 30 }}>
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
          onEndReached={getPost}
        />
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  pill: {
    position: "absolute",
    right: -10,
    top: -4,
    height: hp(2.2),
    width: hp(2.2),
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
    backgroundColor: theme.colors.roseLight,
  },
  pillText: {
    color: "white",
    fontSize: hp(1.2),
    fontWeight: theme.fonts.bold,
  },
});
