import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Pressable,
  Alert,
} from "react-native";
import { useEffect, useRef, useState } from "react";
import { VideoView, useVideoPlayer } from "expo-video";
import * as ImagePicker from "expo-image-picker";
import ScreenWrapper from "../../components/ScreenWrapper";
import Header from "../../components/Header";
import { useAuth } from "../../contexts/AuthContext";
import { hp, wp } from "../../helpers/common";
import AvatarImage from "../../components/AvatarImage";
import { theme } from "../../constants/theme";
import RichTextEditor from "../../components/RichTextEditor";
import { router, useLocalSearchParams, useRouter } from "expo-router";
import Icon from "../../assets/Icons";
import Button from "../../components/Button";
import { getSupabaseFileUrl } from "../../sevices/imageService";
import { CreatePost } from "../../sevices/postService";

export default function NewPost() {
  const { user } = useAuth();
  const bodyRef = useRef("");
  const editorRef = useRef(null);
  const videoRef = useRef(null);
  const Router = useRouter();
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState(null);
  const post = useLocalSearchParams();
  useEffect(() => {
    if (post && post.id) {
      bodyRef.current = post.body;
      setFile(post.file || null);
      setTimeout(() => {
        editorRef?.current?.setContentHTML(post.body);
      }, 300);
    }
  }, []);

  async function onPick(isImage) {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      Alert.alert("Permission to access camera roll is required!");
      return;
    }
    let mediaConfig = {
      mediaTypes: ["images", "videos"],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.7,
    };
    if (!isImage) {
      mediaConfig = {
        mediaTypes: ["videos"],
        allowsEditing: true,
      };
    }

    let result = await ImagePicker.launchImageLibraryAsync(mediaConfig);
    // console.log("file:", result.assets[0]);
    if (!result.canceled) {
      setFile(result.assets[0]);
    }
  }
  const player = useVideoPlayer(getFileUri(file), (player) => {
    player.loop = true;
    player.play();
  });

  function isLocalFile(file) {
    if (!file) return null;
    if (typeof file === "object") return true;

    return false;
  }

  function getFileType(file) {
    if (!file) return null;
    if (isLocalFile(file)) {
      return file.type;
    }

    if (file.includes("postImage")) {
      return "image";
    }

    return "video";
  }

  function getFileUri(file) {
    if (!file) return null;
    if (isLocalFile(file)) {
      return file.uri;
    }

    return getSupabaseFileUrl(file)?.uri;
  }

  async function onSubmit() {
    if (!bodyRef.current && !file) {
      Alert.alert("Man you know that you can not post nothing right?😅");
    }

    let data = {
      file,
      body: bodyRef.current,
      userId: user?.id,
    };

    if (post && post.id) data.id = post.id;

    setLoading(true);
    let res = await CreatePost(data);
    setLoading(false);
    if (res.success) {
      setFile(null);
      bodyRef.current = "";
      editorRef.current?.setContentHTML("");
      router.back();
    } else {
      Alert.alert("post", res.msg);
    }
  }

  return (
    <ScreenWrapper bg="white">
      <View style={styles.container}>
        <Header title="Create Post with Raghito" />
        <ScrollView contentContainerStyle={{ gap: 20 }}>
          <View style={styles.header}>
            <AvatarImage
              uri={user?.image}
              size={hp(7)}
              rounded={theme.redius.xl}
            />
            <View style={{ gap: 2 }}>
              <Text style={styles.username}>{user?.name}</Text>
              <Text style={styles.publicText}>Public</Text>
            </View>
          </View>
          <View style={styles.textEditor}>
            <RichTextEditor
              editorRef={editorRef}
              onChange={(body) => {
                bodyRef.current = body;
              }}
            />
          </View>
          {file && (
            <View style={styles.file}>
              {getFileType(file) === "video" ? (
                <VideoView
                  style={{ flex: 1 }}
                  player={player}
                  allowsFullscreen
                  allowsPictureInPicture
                />
              ) : getFileType(file) === "image" ? (
                <Image
                  source={{ uri: getFileUri(file) }}
                  style={styles.image}
                  resizeMode="cover"
                />
              ) : null}

              <Pressable
                style={styles.deleteIcon}
                onPress={() => setFile(null)}
              >
                <Icon name="delete" size="25" color="white" />
              </Pressable>
            </View>
          )}

          <View style={styles.media}>
            <Text style={styles.addImageText}>Add to your post</Text>
            <View style={styles.mediaIcons}>
              <TouchableOpacity onPress={() => onPick(true)}>
                <Icon name="image" size={30} color={theme.colors.dark} />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => onPick(false)}>
                <Icon name="video" size={33} color={theme.colors.dark} />
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
        <Button
          buttonStyle={{ height: hp(6.2) }}
          title={post && post.id ? "Update me" : " Post me"}
          loading={loading}
          hasShadow={false}
          onPress={onSubmit}
        />
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginBottom: 30,
    paddingHorizontal: wp(4),
    gap: 15,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  username: {
    fontSize: hp(2.2),
    fontWeight: theme.fonts.semibold,
    color: theme.colors.text,
  },
  publicText: {
    fontSize: hp(1.8),
    fontWeight: theme.fonts.medium,
    color: theme.colors.textLight,
  },
  media: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1.5,
    padding: 12,
    paddingHorizontal: 18,
    borderRadius: theme.redius.xl,
    borderCurve: "continuous",
    borderColor: theme.colors.gray,
  },
  addImageText: {
    color: theme.colors.textDark,
    fontSize: hp(2.2),
  },
  mediaIcons: {
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
  },
  file: {
    height: hp(30),
    width: "100%",
    borderRadius: theme.redius.xl,
    overflow: "hidden",
    backgroundColor: theme.colors.gray,
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: theme.redius.xl,
  },
  deleteIcon: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "rgba(255, 0, 0, 0.6)",
    borderRadius: 50,
    padding: 7,
  },
});
