import React, { Component } from "react";
import { Text, View, StyleSheet, TouchableOpacity } from "react-native";
import { useAuth } from "../contexts/AuthContext";
import { theme } from "../constants/theme";
import { hp, wp } from "../helpers/common";
import AvatarImage from "./AvatarImage";
import moment from "moment";
import RenderHtml from "react-native-render-html";
import { getSupabaseFileUrl } from "../sevices/imageService";
import { Image } from "expo-image";
import { VideoView, useVideoPlayer } from "expo-video";
import Icon from "../assets/Icons";

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
  currenUser,
  hasShadow = true,
}) {
  const { user } = useAuth();
  const shadowStyles = {
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 1,
  };
  const player = useVideoPlayer(
    getSupabaseFileUrl(item?.file)?.uri,
    (player) => {
      player.loop = true;
      player.play();
    }
  );

  function openPostsdetails() {
    return;
  }

  const createdAt = moment(item?.created_At).format("MMM D");
  const liked = true;
  const likes = [];

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
        <TouchableOpacity style={styles.icon} onPress={openPostsdetails}>
          <Icon
            name="threeDotsHorizontal"
            size={hp(4)}
            strokeWidth={1.5}
            color={theme.colors.text}
          />
        </TouchableOpacity>
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
          <TouchableOpacity>
            {/* You can adjust the Icon name as needed */}
            <Icon
              name="heart"
              size={24}
              fill={liked ? theme.colors.rose : "transparent"}
              color={liked ? theme.colors.rose : theme.colors.textDark}
            />
          </TouchableOpacity>
          <Text style={styles.count}>{likes?.length}</Text>
        </View>
        <View style={styles.footerButton}>
          <TouchableOpacity>
            {/* You can adjust the Icon name as needed */}
            <Icon name="comment" size={24} color={theme.colors.textDark} />
          </TouchableOpacity>
          <Text style={styles.count}>{0}</Text>
        </View>
        <View style={styles.footerButton}>
          <TouchableOpacity>
            {/* You can adjust the Icon name as needed */}
            <Icon name="share" size={24} color={theme.colors.textDark} />
          </TouchableOpacity>
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
    gap: 18,
  },
});
