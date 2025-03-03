import React, { Component, createContext, useEffect, useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Share,
} from "react-native";
import { useAuth } from "../contexts/AuthContext";
import { theme } from "../constants/theme";
import { hp, wp } from "../helpers/common";
import AvatarImage from "./AvatarImage";
import moment from "moment";
import RenderHtml from "react-native-render-html";
import { downloadFile, getSupabaseFileUrl } from "../sevices/imageService";
import { Image } from "expo-image";
import { VideoView, useVideoPlayer } from "expo-video";
import Icon from "../assets/Icons";
import { createLike, removeLike } from "../sevices/postService";
import { stripHtmlTags } from "../helpers/common";
import Loading from "./Loading";

const textStyle = {
  color: theme.colors.dark,
  fontSize: hp(1.75),
};

const tagesStyles = {
  div: textStyle,
  p: textStyle,
  ol: textStyle,
  h1: {
    color: theme.colors.gray,
  },
  h4: {
    color: theme.colors.gray,
  },
};

export default function PostCard({
  item,
  router,
  currentUser,
  hasShadow = true,
  showMoreIcon = true,
  onDelete = () => {},
  onEdit = () => {},
  showDeleteIcon = false,
}) {
  const shadowStyles = {
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 1,
  };
  // const { user } = useAuth();
  const [loading, setloading] = useState(false);

  const [likes, setLikes] = useState([]);

  useEffect(() => {
    setLikes(item?.postLikes);
  }, []);

  const player = useVideoPlayer(
    getSupabaseFileUrl(item?.file)?.uri,
    (player) => {
      player.loop = true;
      player.play();
    }
  );

  function openPostsdetails() {
    if (!showMoreIcon) return;
    router.push({
      pathname: "postDetails",
      params: { postId: item?.id },
    });
  }

  async function onLike() {
    let data = {
      userId: currentUser?.id, // Make sure you use currentUser.id
      postId: item?.id,
    };

    if (liked) {
      let updateLikes = likes.filter((like) => like.userId !== currentUser?.id); // Correct the condition here as well
      setLikes([...updateLikes]);
      const res = await removeLike(currentUser?.id, item?.id); // Fix `currentUser?.id` and `item?.id`

      if (!res.success) {
        Alert.alert("Error", "Something went wrong while removing the like.");
      }
    } else {
      let res = await createLike(data);
      setLikes([...likes, data]);

      if (!res.success) {
        Alert.alert("Error", "Something went wrong while adding the like.");
      }
    }
  }

  const createdAt = moment(item?.created_at).format("MMM D");
  const liked = likes.filter((like) => like.userId == currentUser?.id)[0]
    ? true
    : false;
  async function onShare() {
    setloading(true);
    let content = {
      message: stripHtmlTags(item?.body),
    };

    if (item?.file) {
      let url = await downloadFile(getSupabaseFileUrl(item?.file)?.uri);

      content.url = url;
    }
    setloading(false);

    await Share.share(content);
  }
  function handldelete() {
    Alert.alert("Yikes!", "Nuke this comment? It vanishes like free pizza!", [
      { text: "Nah", onPress: () => console.log("Saved!") },
      { text: "Bye bye!", onPress: () => onDelete(item), style: "destructive" },
    ]);
  }
  return (
    <View style={[styles.container, hasShadow && shadowStyles]}>
      <View style={styles.header}>
        {/* user info */}
        <View style={styles.userInfo}>
          <AvatarImage
            size={hp(4.5)}
            uri={item?.user?.image}
            rounded={theme.redius.xl}
          />
          <View style={{ gap: 2 }}>
            <Text style={styles.username}>{item?.user?.name}</Text>
            <Text style={styles.postTime}>{createdAt}</Text>
          </View>
        </View>
        {showMoreIcon && (
          <TouchableOpacity style={styles.icon} onPress={openPostsdetails}>
            <Icon
              name="threeDotsHorizontal"
              size={hp(4)}
              strokeWidth={1.5}
              color={theme.colors.text}
            />
          </TouchableOpacity>
        )}
        {showDeleteIcon && currentUser.id == item?.userId && (
          <View style={styles.actions}>
            <TouchableOpacity onPress={() => onEdit(item)}>
              <Icon name="edit" size={hp(2.5)} color={theme.colors.text} />
            </TouchableOpacity>
            <TouchableOpacity onPress={handldelete}>
              <Icon name="delete" size={hp(2.5)} color={theme.colors.rose} />
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Post body */}
      <View style={styles.content}>
        <View style={styles.postBody}>
          {item?.body && (
            <RenderHtml
              contentWidth={wp(100)}
              source={{ html: item?.body }}
              tagsStyles={tagesStyles}
            />
          )}
        </View>
        {/* Displaying image from Supabase storage */}
        {item?.file && item?.file.includes("postImage") && (
          <Image
            source={{ uri: getSupabaseFileUrl(item?.file)?.uri }}
            transition={100}
            style={styles.postMedia}
            contentFit="cover"
            onError={(e) =>
              console.log("Image Load Error: ", e.nativeEvent.error)
            }
          />
        )}

        {item?.file && item?.file.includes("postVideo") && (
          <VideoView
            style={[styles.postMedia, { height: hp(30), width: wp(90) }]}
            player={player}
            allowsFullscreen
            allowsPictureInPicture
            resizeMode="cover"
          />
        )}
      </View>
      {/* Like, comment & share */}
      <View style={styles.footer}>
        <View style={styles.footerButton}>
          <TouchableOpacity onPress={onLike}>
            {/* You can adjust the Icon name as needed */}
            <Icon
              name="heart"
              size={24}
              fill={liked ? theme.colors.roseLight : "transparent"}
              color={liked ? theme.colors.roseLight : theme.colors.textDark}
            />
          </TouchableOpacity>
          <Text style={styles.count}>{likes?.length}</Text>
        </View>
        <View style={styles.footerButton}>
          <TouchableOpacity onPress={openPostsdetails}>
            {/* You can adjust the Icon name as needed */}
            <Icon name="comment" size={24} color={theme.colors.textDark} />
          </TouchableOpacity>
          <Text style={styles.count}>{item?.comments?.[0]?.count || 0}</Text>
        </View>

        <View style={styles.footerButton}>
          {loading ? (
            <Loading size="small" />
          ) : (
            <TouchableOpacity onPress={onShare}>
              {/* You can adjust the Icon name as needed */}
              <Icon name="share" size={24} color={theme.colors.textDark} />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 10,
    marginBottom: 15,
    borderRadius: theme.redius.xxl,
    borderCurve: "continous",
    padding: 10,
    paddingVertical: 12,
    backgroundColor: "white",
    borderwidth: 0.5,
    borderColor: theme.colors.gray,
    shadowColor: "#000",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  postTime: {
    fontSize: hp(1.4),
    color: theme.colors.textLight,
    fontWeight: theme.fonts.medium,
  },
  content: {
    gap: 10,
  },
  postMedia: {
    height: hp(40),
    width: "100%",
    borderRadius: theme.redius.xl,
    borderCurve: "continuous",
  },
  postBody: {
    marginLeft: 5,
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
  },
  footerButton: {
    marginLeft: 5,
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  actions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 18,
  },
});
