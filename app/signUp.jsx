import {
  Image,
  StyleSheet,
  Text,
  View,
  TextInput,
  Pressable,
  Alert,
} from "react-native";
import ScreenWrapper from "../components/ScreenWrapper";
import { theme } from "../constants/theme";
import Icons from "../assets/Icons";
import { StatusBar } from "expo-status-bar";
import BackButton from "../components/BackButton";
import { useRouter } from "expo-router";
import { hp, wp } from "../helpers/common";
import Button from "../components/Button";
import Input from "../components/Input";
import Icon from "../assets/Icons";
import { useRef, useState } from "react";
import Login from "./login";
import { supabase } from "../lip/supabase";

export default function SignUp() {
  const router = useRouter();
  const emailRef = useRef("");
  const nameRef = useRef("");
  const passwordRef = useRef("");
  const [loading, setLoading] = useState(false);
  async function onSubmit() {
    const funnyMessages = [
      "Oops! It seems like your keyboard took a break. Try filling those fields!",
      "Hey, did you forget something? Like... your login details?",
      "Empty fields? Bold move. Let’s try that again with some actual info!",
    ];

    if (!emailRef.current || !passwordRef.current || !nameRef.current) {
      const randomMessage =
        funnyMessages[Math.floor(Math.random() * funnyMessages.length)];
      alert(randomMessage);
      return false;
    }
    let email = emailRef.current.trim();
    let name = nameRef.current.trim();
    let password = passwordRef.current.trim();

    setLoading(true);

    const {
      data: { session },
      error,
    } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
        },
      },
    });
    if (error) Alert.alert("Sign Up", error.message);
    setLoading(false);
  }

  return (
    <ScreenWrapper bg={"white"}>
      <StatusBar style="dark" />
      <View style={styles.container}>
        <BackButton router={router} />

        {/* Welcome Text */}
        <View style={styles.welcome}>
          <Text style={styles.text}>Don’t miss out!</Text>
          <Text style={styles.text}>Be part of something amazing</Text>
        </View>

        {/* Input Fields */}
        <View style={styles.form}>
          <Text style={{ fontSize: hp(1.7), color: theme.colors.text }}>
            Please fill the details to create an account!
          </Text>

          <Input
            icon={
              <Icon
                name="mail"
                size={26}
                strokeWidth={1.6}
                color={theme.colors.textLight}
              />
            }
            placeholder="Enter your Email"
            onChangeText={(value) => (emailRef.current = value)}
          />
          <Input
            icon={
              <Icon
                name="user"
                size={26}
                strokeWidth={1.6}
                color={theme.colors.textLight}
              />
            }
            placeholder="Enter your Name"
            onChangeText={(value) => (nameRef.current = value)}
          />
          <Input
            icon={
              <Icon
                name="lock"
                size={26}
                strokeWidth={1.6}
                color={theme.colors.textLight}
              />
            }
            placeholder="Enter your Password"
            secureTextEntry
            onChangeText={(value) => (passwordRef.current = value)}
          />

          {/* Sign In */}

          <Button title="Sign Up" loading={loading} onPress={onSubmit} />
        </View>
        {/* footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Already have an account?</Text>
          <Pressable
            onPress={() => {
              router.push("login");
            }}
          >
            <Text
              style={[
                styles.footerText,
                {
                  color: theme.colors.primaryDark,
                  fontWeight: theme.fonts.semibold,
                },
              ]}
            >
              Login
            </Text>
          </Pressable>
        </View>
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 45,
    paddingHorizontal: wp(5),
  },
  welcome: {
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    color: theme.colors.textLight,
    fontSize: hp(3),
    justifyContent: "center",
    alignItems: "center",
    fontWeight: theme.fonts.bold,
  },
  signIn: {
    height: hp(40),
    width: "100%",
    alignSelf: "center",
    justifyContent: "flex-start",
    top: 0,
  },
  form: {
    gap: 20,
  },
  forgotPassword: {
    textAlign: "right",
    fontWeight: theme.fonts.semibold,
    color: theme.colors.text,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 2,
  },
});
