import { useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { beginLogin, clearPendingLogin } from "../../constants/sessionStore";

export default function LoginSetupScreen() {
  const router = useRouter();
  const [setupId, setSetupId] = useState("");
  const [error, setError] = useState("");

  const handleNext = () => {
    setError("");
    clearPendingLogin();

    const result = beginLogin(setupId);
    if (!result.ok) {
      setError(result.message);
      return;
    }

    router.push("/auth/login-access");
  };

  return (
    <SafeAreaView className="flex-1 bg-cream">
      <View className="flex-1 justify-center px-6">
        <Text className="text-3xl font-black text-cocoa text-center">EverFresh Access</Text>
        <Text className="mt-2 text-sm text-accent text-center">Enter setup ID to check records </Text>

        <TextInput
          value={setupId}
          onChangeText={(value) => {
            setSetupId(value);
            setError("");
          }}
          placeholder="Setup or Container ID"
          autoCapitalize="characters"
          className="mt-6 rounded-2xl border border-sand bg-white px-4 py-3 text-cocoa text-center"
          placeholderTextColor="#6B7280"
        />

        {error ? (
          <View className="mt-3 rounded-xl border border-red-200 bg-red-50 p-3">
            <Text className="text-sm text-red-700">{error}</Text>
          </View>
        ) : null}

        <Pressable onPress={handleNext} className="mt-5 rounded-2xl bg-primary py-4">
          <Text className="text-center text-base font-bold text-white">Next</Text>
        </Pressable>

        <Pressable onPress={() => router.push("/auth/signup")} className="mt-4">
          <Text className="text-center text-sm text-mocha">
            New client? <Text className="font-bold text-cocoa">Register setup</Text>
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
