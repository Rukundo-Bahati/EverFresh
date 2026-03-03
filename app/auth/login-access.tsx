import { Redirect, useRouter } from "expo-router";
import { useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { completeLogin, getPendingLogin } from "../../constants/sessionStore";

export default function LoginAccessScreen() {
  const router = useRouter();
  const pending = getPendingLogin();
  const [accessCode, setAccessCode] = useState("");
  const [error, setError] = useState("");

  if (!pending) {
    return <Redirect href="/auth/login" />;
  }

  const handleEnter = () => {
    setError("");
    const result = completeLogin(accessCode);
    if (!result.ok) {
      setError(result.message);
      return;
    }

    router.replace("/dashboard");
  };

  return (
    <SafeAreaView className="flex-1 bg-cream">
      <View className="flex-1 justify-center px-6">
        <Text className="text-3xl font-black text-cocoa text-center">Access Code</Text>
        <Text className="mt-2 text-sm text-accent text-center">Setup verified: {pending.setupId}. Enter access code.</Text>

        <TextInput
          value={accessCode}
          onChangeText={(value) => {
            setAccessCode(value);
            setError("");
          }}
          placeholder="Access Code"
          secureTextEntry
          className="mt-6 text-center rounded-2xl border border-sand bg-white px-4 py-3 text-cocoa"
          placeholderTextColor="#A67C63"
        />

        {error ? (
          <View className="mt-3 rounded-xl border border-red-200 bg-red-50 p-3">
            <Text className="text-sm text-center text-red-700">{error}</Text>
          </View>
        ) : null}

        <Pressable onPress={handleEnter} className="mt-5 rounded-2xl bg-primary py-4">
          <Text className="text-center text-base font-bold text-white">Enter Control App</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
