import { Stack, useRouter } from "expo-router";
import { AuthProvider, useAuth } from "../contexts/AuthContext";
import { supabase } from "../lip/supabase";
import { useEffect } from "react";
import { getUserData } from "../sevices/userService";
import { LogBox } from "react-native";

LogBox.ignoreLogs([
  "Warning: TNodeChildrenRenderer:",
  "Warning: MemoizedTNodeRenderer: ",
  "Warning: TRenderEngineProvider:",
]);
const _Layout = () => {
  return (
    <AuthProvider>
      <MainLayout />
    </AuthProvider>
  );
};

function MainLayout() {
  const { setAuth, setUserData } = useAuth();
  const router = useRouter();
  useEffect(() => {
    supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        setAuth(session?.user);
        updateUserData(session?.user, session?.user?.email);
        router.replace("/home");
      } else {
        setAuth(null);
        router.replace("/welcome");
      }
    });
  }, []);
  async function updateUserData(user, email) {
    let res = await getUserData(user?.id);
    if (res.success) {
      setUserData({ ...res.data, email });
    }
  }
  return <Stack screenOptions={{ headerShown: false }} />;
}
export default _Layout;
