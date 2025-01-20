import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  Pressable,
  Alert,
} from "react-native";
import ScreenWrapper from "../../components/ScreenWrapper";
import Header from "../../components/Header";
import { hp, wp } from "../../helpers/common";
import { Image } from "expo-image";
import { useAuth } from "../../contexts/AuthContext";
import Icon from "../../assets/Icons";
import { theme } from "../../constants/theme";
import Input from "../../components/Input";
import { useEffect, useState } from "react";
import Button from "../../components/Button";
import { useRouter } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import { updateUser } from "../../sevices/userService";
import { supabase } from "../../lip/supabase";
import { getUserImageSource, uploadfile } from "../../sevices/imageService";

export default function EditProfile() {
  const { user: currentUser, setUserData } = useAuth();
  const [loading, setLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const router = useRouter();

  const [user, setUser] = useState({
    name: "",
    phoneNumber: "",
    address: "",
    image: null,
    bio: "",
  });

  useEffect(() => {
    if (currentUser) {
      setUser({
        name: currentUser.name || "",
        image: currentUser.image || null,
        phoneNumber: currentUser.phoneNumber || "",
        address: currentUser.address || "",
        bio: currentUser.bio || "",
      });
      setSelectedImage(currentUser.image || null);
    }
  }, [currentUser]);

  const pickImage = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      Alert.alert("Permission to access camera roll is required!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images", "videos"],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.7,
    });

    if (!result.canceled) {
      setUser({ ...user, image: result.assets[0] });
    }
  };

  const onSubmit = async () => {
    let userData = { ...user };
    let { name, phoneNumber, address, image, bio } = userData;

    if (!name || !phoneNumber || !bio || !address || !image) {
      Alert.alert("Please fill all the fields");
      return;
    }

    setLoading(true);

    // Check if the image needs to be uploaded
    if (typeof image === "object" && image.uri) {
      const imageRes = await uploadfile("profiles", image.uri, true);

      // Check if the upload was successful
      if (imageRes.success) {
        userData.image = imageRes.data; // Use the returned image URL from Supabase
      } else {
        userData.image = null;
      }
    }

    // Update the user information
    const res = await updateUser(currentUser?.id, userData);

    setLoading(false);

    if (res.success) {
      setUserData({ ...currentUser, ...userData });
      router.back();
    } else {
      Alert.alert("Failed to update profile. Please try again later.");
    }
  };

  let imageSource =
    user.image && typeof user.image == "object"
      ? user.image.uri
      : getUserImageSource(user.image);

  return (
    <ScreenWrapper bg={"white"}>
      <View style={styles.container}>
        <ScrollView style={{ flex: 1 }}>
          <Header title="Edit Profile" />
          <View style={styles.form}>
            <View style={styles.avatarContainer}>
              <Image source={imageSource} style={styles.avatar} />
              <Pressable style={styles.icon} onPress={pickImage}>
                <Icon
                  name="camera"
                  size={20}
                  strokeWidth={2.5}
                  style={{ color: theme.colors.darkgray }}
                />
              </Pressable>
            </View>
            <Text style={{ fontSize: hp(1.9), color: theme.colors.text }}>
              Please fill your profile details
            </Text>
            <Input
              icon={
                <Icon
                  name="user"
                  size={24}
                  strokeWidth={1.5}
                  color={theme.colors.textLight}
                />
              }
              value={user.name}
              placeholder="Enter your Name"
              onChangeText={(value) => setUser({ ...user, name: value })}
            />
            <Input
              icon={
                <Icon
                  name="call"
                  size={24}
                  strokeWidth={1.5}
                  color={theme.colors.textLight}
                />
              }
              value={user.phoneNumber}
              placeholder="Enter your phone number"
              keyboardType="numeric"
              onChangeText={(value) => setUser({ ...user, phoneNumber: value })}
            />
            <Input
              icon={
                <Icon
                  name="location"
                  size={24}
                  strokeWidth={1.5}
                  color={theme.colors.textLight}
                />
              }
              value={user.address}
              placeholder="Enter your location"
              onChangeText={(value) => setUser({ ...user, address: value })}
            />
            <Input
              value={user.bio}
              placeholder="Enter your bio"
              multiline={true}
              containerStyle={styles.bio}
              onChangeText={(value) => setUser({ ...user, bio: value })}
            />
            <Button
              title="Update Profile"
              loading={loading}
              onPress={onSubmit}
            />
          </View>
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
  avatarContainer: {
    height: hp(14),
    width: hp(14),
    alignSelf: "center",
  },
  avatar: {
    height: "100%",
    width: "100%",
    borderRadius: theme.redius.xxl * 1.8,
    borderWidth: 1,
    borderColor: theme.colors.gray,
  },
  form: {
    gap: 18,
    marginTop: 20,
  },
  icon: {
    width: wp(10),
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    bottom: 9,
    right: -13,
    padding: 7,
    backgroundColor: "white",
    borderRadius: theme.redius.xxl,
    borderColor: theme.colors.gray,
    borderWidth: 1,
    shadowColor: theme.colors.dark,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
    elevation: 7,
  },
  bio: {
    flexDirection: "row",
    height: hp(20),
    alignItems: "flex-start",
    paddingVertical: 15,
  },
});
