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

export default function Login() {
  const router = useRouter();
  const emailRef = useRef("");
  const passwordRef = useRef("");
  const [loading, setLoading] = useState(false);

  async function onSubmit() {
    const funnyMessages = [
      "Oops! It seems like your keyboard took a break. Try filling those fields!",
      "Hey, did you forget something? Like... your login details?",
      "Empty fields? Bold move. Let’s try that again with some actual info!",
      "Whoopsie! You missed a spot. How about filling in those blanks?",
      "Are you a magician? Because you made your details disappear!",
      "Looks like you’re keeping secrets! We need those fields filled.",
      "Fields empty? Were you going for invisible text? We need the visible kind!",
    ];

    if (!emailRef.current || !passwordRef.current) {
      const randomMessage =
        funnyMessages[Math.floor(Math.random() * funnyMessages.length)];
      alert(randomMessage);
      return false;
    }

    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (error) Alert.alert(error.message);
    setLoading(false);
  }

  return (
    <ScreenWrapper bg={"white"}>
      <StatusBar style="dark" />
      <View style={styles.container}>
        <BackButton router={router} />

        {/* Welcome Text */}
        <View style={styles.welcome}>
          <Text style={styles.text}>Hi</Text>
          <Text style={styles.text}>Welcome Back!</Text>
        </View>

        {/* Input Fields */}
        <View style={styles.form}>
          <Text style={{ fontSize: hp(1.7), color: theme.colors.text }}>
            Please login to continue!
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
          <Text style={styles.forgotPassword}>Forgot Password?</Text>

          {/* Sign In */}

          <Button title="Sign In" loading={loading} onPress={onSubmit} />
        </View>
        {/* footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Do not have an account? </Text>
          <Pressable
            onPress={() => {
              router.push("signUp");
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
              Sign Up
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
