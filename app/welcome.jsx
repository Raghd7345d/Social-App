import { Text, View, StyleSheet, Image, Pressable } from "react-native";
import ScreenWrapper from "../components/ScreenWrapper";
import { StatusBar } from "expo-status-bar";
import { wp } from "../helpers/common";
import { hp } from "../helpers/common";
import { theme } from "../constants/theme";
import { router, useRouter } from "expo-router";
import Button from "../components/Button";
import Loading from "../components/Loading";
export default function Welcome() {
  const router = useRouter();
  return (
    <ScreenWrapper bg="white">
      <StatusBar style="dark" />

      <View style={styles.container}>
        {/* welcome image*/}
        <Image
          style={styles.welcomeImage}
          resizeMode="contain "
          source={require("../assets/images/Welcome.jpg")}
        />
        {/* title*/}
        <View style={{ gap: 20 }}>
          <Text style={styles.title}>SekarMaker</Text>

          <Text style={styles.punchLine}>
            Welcome! Ready to meet your new best friends, future dance partners,
            and maybe even your next ex? Let the fun begin!
          </Text>
        </View>
        {/* footer */}
        <View style={styles.footer}>
          <Button
            title="Getting Started"
            buttonStyle={{ marginHorizontal: wp(3) }}
            onPress={() => {
              router.push("signUp");
            }}
          />
          <View style={styles.bottomTextContainer}>
            <Text style={styles.loginText}>Already have an account!</Text>
            <Pressable onPress={() => router.push("login")}>
              <Text
                style={[
                  styles.loginText,
                  {
                    color: theme.colors.primary,
                    fontWeight: theme.fonts.semibold,
                  },
                ]}
              >
                Login
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "space-around",
    backgroundColor: "white",
    paddingHorizontal: wp(4),
  },
  welcomeImage: {
    height: hp(50),
    width: wp(100),
    alignSelf: "center",
    justifyContent: "flex-start",
    top: 0,
  },
  title: {
    color: theme.colors.text,
    fontSize: hp(4),
    textAlign: "center",
    fontWeight: theme.fonts.extrabold,
  },

  punchLine: {
    textAlign: "center",
    paddingHorizontal: wp(10),
    fontSize: hp(1.7),
    color: theme.colors.text,
  },
  footer: {
    gap: 30,
    width: "100%",
  },
  bottomTextContainer: {
    justifyContent: "center",
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  loginText: {
    color: theme.colors.text,
    textAlign: "center",
    fontSize: hp(1.9),
  },
});
