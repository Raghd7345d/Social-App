import { useRouter } from "expo-router";
import { View, Text, Button } from "react-native";
import ScreenWrapper from "../components/ScreenWrapper";
import Loading from "../components/Loading";
export default function index() {
  const router = useRouter();
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Loading />
    </View>
  );
}
