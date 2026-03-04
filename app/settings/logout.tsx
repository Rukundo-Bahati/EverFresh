import { Text, TouchableOpacity, View } from "react-native";
import { useRouter } from "expo-router";
import PageHeader from "../../components/PageHeader";
import { isAuthenticated, logout } from "../../constants/sessionStore";

export default function LogoutScreen() {
  const router = useRouter();

  const handleLogout = () => {
    logout();
    (router as unknown as { dismissAll?: () => void }).dismissAll?.();
    router.replace("/auth/login");
  };

  return (
    <View className="flex-1 bg-cream px-5 pt-8">
      <PageHeader title="Logout" />

      <View className="mt-4 rounded-2xl border border-sand bg-white p-4">
        <Text className="text-sm text-mocha">
          {isAuthenticated()
            ? "Sign out to end this mobile control session."
            : "No active session. Return to sign in."}
        </Text>
      </View>

      <TouchableOpacity onPress={handleLogout} className="mt-6 rounded-2xl bg-primary px-6 py-3">
        <Text className="text-center font-bold text-white">Sign Out</Text>
      </TouchableOpacity>
    </View>
  );
}
