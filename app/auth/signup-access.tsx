import { Redirect, useRouter } from "expo-router";
import { useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { completeRegistration, getPendingRegistration } from "../../constants/sessionStore";

export default function SignupAccessScreen() {
  const router = useRouter();
  const pending = getPendingRegistration();
  const [accessCode, setAccessCode] = useState("");
  const [error, setError] = useState("");

  if (!pending) {
    return <Redirect href="/auth/signup" />;
  }

  const handleSave = () => {
    setError("");
    const result = completeRegistration(accessCode);
    if (!result.ok) {
      setError(result.message);
      return;
    }

    router.replace("/dashboard");
  };

  return (
    <SafeAreaView className="flex-1 bg-cream">
      <View className="px-6 pt-4">
        <View className="mb-4 flex-row">
          <View className="mr-2 h-1.5 flex-1 rounded-full bg-primary" />
          <View className="ml-2 h-1.5 flex-1 rounded-full bg-primary" />
        </View>
      </View>

      <View className="flex-1 justify-center px-6">
        <Text className="text-3xl font-black text-cocoa text-center">Access Code</Text>
        <Text className="mt-2 text-sm text-accent text-center">{pending.setupId}</Text>

        <TextInput
          value={accessCode}
          onChangeText={(value) => {
            setAccessCode(value);
            setError("");
          }}
          placeholder="Access Code"
          secureTextEntry
          className="mt-6 rounded-2xl border border-sand bg-white px-4 py-3 text-cocoa text-center"
          placeholderTextColor="#A67C63"
        />

        {error ? (
          <View className="mt-3 rounded-xl border border-red-200 bg-red-50 p-3">
            <Text className="text-sm text-red-700">{error}</Text>
          </View>
        ) : null}

        <Pressable onPress={handleSave} className="mt-5 rounded-2xl bg-primary py-4">
          <Text className="text-center text-base font-bold text-white">Save Registration</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
