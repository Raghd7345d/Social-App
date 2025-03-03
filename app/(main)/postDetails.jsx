import { useLocalSearchParams, useRouter } from "expo-router";
import React, { Component, useEffect, useRef, useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";
import {
  creatComment,
  fetchPostDelete,
  fetchPostDetails,
  fetchPostUpdate,
  removeComment,
} from "../../sevices/postService";
import { hp, wp } from "../../helpers/common";
import { ScrollView } from "react-native";
import PostCard from "../../components/PostCard";
import { useAuth } from "../../contexts/AuthContext";
import Loading from "../../components/Loading";
import { theme } from "../../constants/theme";
import Input from "../../components/Input";
import Icon from "../../assets/Icons";
import { CommentItem } from "../../components/commentItem";
import { supabase } from "../../lip/supabase";
import { getUserData } from "../../sevices/userService";
import { CreateNotification } from "../../sevices/notificatoinsservice";

export default function PostDetails() {
  const { postId, commentId } = useLocalSearchParams();

  const { user } = useAuth();
  const router = useRouter();
  const [startLoading, setStartLoading] = useState(true);
  const [showMoreIcon, setShoMoreIcon] = useState(false);
  const [post, setPost] = useState(null);
  const inputRef = useRef(null);
  const commentRef = useRef();
  const [comment, setCommentText] = useState("");
  const [loading, setloading] = useState(false);
  const [posts, setPosts] = useState([]);
  // fetch Comment

  const handleCommentEvent = async (payload) => {
    console.log("Realtime Event Received:", payload); // Debugging

    if (payload.eventType === "INSERT") {
      let newComment = { ...payload.new };
      let res = await getUserData(newComment.userId);
      newComment.user = res.success ? res.data : {};

      setPost((prevPost) => ({
        ...prevPost,
        comments: [newComment, ...prevPost.comments],
      }));
    } else if (payload.eventType === "DELETE") {
      console.log("Deleted Comment ID:", payload.old.id); // Check if delete event triggers

      setPost((prevPost) => ({
        ...prevPost,
        comments: prevPost.comments.filter((c) => c.id !== payload.old.id),
      }));
    }
  };

  useEffect(() => {
    let commentChannel = supabase
      .channel("comments")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "comments",
          filter: `postId=eq.${postId}`,
        },
        handleCommentEvent
      )
      .on(
        "postgres_changes",
        {
          event: "DELETE",
          schema: "public",
          table: "comments",
          filter: `postId=eq.${postId}`,
        },
        handleCommentEvent
      )
      .subscribe();

    getPostDetails();

    return () => {
      supabase.removeChannel(commentChannel);
    };
  }, []);

  async function getPostDetails() {
    let res = await fetchPostDetails(postId);
    if (res.success) {
      setPost(res.data);
    }
    setStartLoading(false);
  }
  if (startLoading) {
    return (
      <View style={styles.center}>
        <Loading />
      </View>
    );
  }
  const onDeleteComment = async (comment) => {
    const res = await removeComment(comment?.id);
    console.log(res); // Check if it succeeds

    if (!res.success) {
      Alert.alert("Error", res.msg);
    }
  };
  if (!post)
    return (
      <View
        style={[
          styles.center,
          { justifyContent: "flex-start", marginTop: 100 },
        ]}
      >
        <Text style={styles.notFount}>Post not Found</Text>
      </View>
    );
  async function sendComment() {
    if (!commentRef.current) return null;
    let data = { text: commentRef.current, userId: user?.id, postId: post?.id };
    setloading(true);
    const res = await creatComment(data);
    setloading(false);
    if (res.success) {
      if (user.id != post.userId) {
        // send Notification
        let notify = {
          senderId: user.id,
          receiverId: post.userId,
          title: "commented on your post",
          data: JSON.stringify({ postId: post.id, commentId: res?.data?.id }),
        };
        CreateNotification(notify);
      }
      inputRef?.current?.clear();
      commentRef.current = "";
    } else {
      Alert.alert("we could not do that");
    }
  }

  async function onDeletePost() {
    try {
      let res = await fetchPostDelete(postId);

      if (res.success) {
        router.back();
      } else {
        Alert.alert("Error", res.error || "Failed to delete the post");
      }
    } catch (err) {
      console.error("Unexpected error in onDeletePost:", err);
      Alert.alert("Error", "An unexpected error occurred");
    }
  }

  async function onEditPost(item) {
    router.back();
    router.push({ pathname: "newPost", params: { ...item } });
  }

  return (
    <View style={styles.container}>
      <ScrollView
        showsHorizontalScrollIndicator={true}
        contentContainerStyle={styles.list}
      >
        <PostCard
          item={{ ...post, comments: [{ count: post.comments.length }] }}
          currentUser={user}
          router={router}
          hasShadow={false}
          showMoreIcon={false}
          showDeleteIcon={true}
          onDelete={onDeletePost}
          onEdit={onEditPost}
        />
        <View style={styles.inputContainer}>
          <Input
            onChangeText={(value) => (commentRef.current = value)} // Update the state
            inputRef={inputRef}
            placeholder="Your comment could change the world!"
            placeholderTextColor={theme.colors.textLight}
            containerStyle={{
              flex: 1,
              height: hp(6),
              borderRadius: theme.redius.xl,
            }}
          />
          {loading ? (
            <View style={styles.loading}>
              <Loading size="small" />
            </View>
          ) : (
            <TouchableOpacity style={styles.sendIcon} onPress={sendComment}>
              <Icon
                name={"send"}
                size={hp(4)}
                strokeWidth={1.5}
                color={theme.colors.text}
              />
            </TouchableOpacity>
          )}
        </View>
        {/* // comment List */}
        <View style={{ marginVertical: 10, gap: 17 }}>
          {post?.comments?.map((comment) => (
            <CommentItem
              highlight={comment.id == commentId}
              item={comment}
              key={comment?.id?.toString()}
              canDelete={user.id == comment.userId || user.id == post.userId}
              onDelete={onDeleteComment}
            />
          ))}

          {post?.comments?.length == 0 && (
            <Text
              style={{
                color: theme.colors.text,
                justifyContent: "center",
                alignSelf: "center",
              }}
            >
              A moment of silence… forever.
            </Text>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    paddingVertical: wp(7),
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 9,
    paddingHorizontal: 12,
  },
});
