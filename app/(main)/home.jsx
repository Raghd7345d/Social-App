import { Alert, Text, View, StyleSheet, Pressable } from "react-native";
import ScreenWrapper from "../../components/ScreenWrapper";
import Button from "../../components/Button";
import { useAuth } from "../../contexts/AuthContext";
import { supabase } from "../../lip/supabase";
import { hp, wp } from "../../helpers/common";
import { theme } from "../../constants/theme";
import Icon from "../../assets/Icons";
import { useRouter } from "expo-router";
import AvatarImage from "../../components/AvatarImage";
import { useState } from "react";
import { useEffect } from "react";
import { fetchPosts } from "../../sevices/postService";
import PostCard from "../../components/PostCard";
import { FlatList } from "react-native";
import Loading from "../../components/Loading";

var limit = 0;
export default function Home() {
  const router = useRouter();
  const { user, setAuth } = useAuth();

  const [posts, setPosts] = useState([]);

  async function handlePostEvents(payload) {
    console.log("changes are recieved", payload);
  }
  useEffect(() => {
    let Channel = supabase
      .channel("posts")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "posts" },
        handlePostEvents
      )
      .subscribe();

    getPost();
    return () => {
      supabase.removeChannel(postChannel);
    };
  }, []);
  async function getPost() {
    limit = limit + 10;

    console.log("fetching post", limit);
    let res = await fetchPosts(limit);
    if (res.success) {
      setPosts(res.data);
    }
  }

  // const onlogout = async () => {
  //   const { error } = await supabase.auth.signOut();
  //   if (error) {
  //     Alert.alert("Error signing out");
  //   }
  // };

  return (
    <ScreenWrapper>
      <View style={styles.container}>
        {/*header*/}
        <View style={styles.header}>
          <Text style={styles.title}>SekarMaker</Text>
          <View style={styles.icons}>
            <Pressable
              onPress={() => {
                router.push("notifications");
              }}
            >
              <Icon
                name="notifications"
                size={24}
                strokeWidth={2}
                color={theme.colors.text}
              />
            </Pressable>
            <Pressable
              onPress={() => {
                router.push("newPost");
              }}
            >
              <Icon
                name="plus"
                size={24}
                strokeWidth={2}
                color={theme.colors.text}
              />
            </Pressable>
            <Pressable
              onPress={() => {
                router.push("messages");
              }}
            >
              <Icon
                name="messages"
                size={24}
                strokeWidth={2}
                color={theme.colors.text}
              />
            </Pressable>
            <Pressable
              onPress={() => {
                router.push("profile");
              }}
            >
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
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <PostCard item={item} currenUser={user} router={router} />
          )}
          ListFooterComponent={
            <View style={{ marginVertical: posts.length == 0 ? 200 : 30 }}>
              <Loading />
            </View>
          }
        />
      </View>
      {/* <Button title="logout" onPress={onlogout} /> */}
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
});
