import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Pressable, ScrollView, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  addRegistrationContainer,
  beginRegistration,
  getPendingRegistration,
  removeRegistrationContainer,
  type moduleModel,
} from "../../constants/sessionStore";

type ValidationState = "idle" | "checking" | "valid" | "invalid";

export default function SignupSetupScreen() {
  const router = useRouter();

  const [setupId, setSetupId] = useState("");
  const [moduleModel, setmoduleModel] =
    useState<moduleModel>("single-container");
  const [containerIdInput, setContainerIdInput] = useState("");
  const [containerNameInput, setContainerNameInput] = useState("");
  const [error, setError] = useState("");
  const [validationState, setValidationState] =
    useState<ValidationState>("idle");
  const [validationMessage, setValidationMessage] = useState("");

  const pending = getPendingRegistration();

  useEffect(() => {
    const normalized = setupId.trim();

    setContainerIdInput("");
    setContainerNameInput("");

    if (!normalized) {
      setValidationState("idle");
      setValidationMessage("");
      return;
    }

    setValidationState("checking");
    setValidationMessage("");

    const timer = setTimeout(() => {
      const result = beginRegistration(moduleModel, setupId);

      if (!result.ok) {
        setValidationState("invalid");
        setValidationMessage(result.message);
        return;
      }

      setValidationState("valid");
      setValidationMessage("");
    }, 350);

    return () => clearTimeout(timer);
  }, [setupId, moduleModel]);

  const addContainer = () => {
    setError("");
    const result = addRegistrationContainer(
      containerIdInput,
      containerNameInput,
    );
    if (!result.ok) {
      setError(result.message);
      return;
    }

    setContainerIdInput("");
    setContainerNameInput("");
  };

  const next = () => {
    setError("");

    if (validationState !== "valid") {
      setError("Setup ID is not verified yet.");
      return;
    }

    const state = getPendingRegistration();
    if (!state) {
      setError("Setup ID is not verified yet.");
      return;
    }

    if (
      state.moduleModel === "control-center" &&
      state.containers.length === 0
    ) {
      setError("Add at least one container before continuing.");
      return;
    }

    router.push("/auth/signup-access");
  };

  const checked =
    validationState === "valid" &&
    pending?.setupId === setupId.trim().toUpperCase() &&
    pending?.moduleModel === moduleModel;

  const setupPlaceholder =
    moduleModel === "single-container" ? "CTR-xxxx" : "CTRL-xxxx";

  return (
    <SafeAreaView className="flex-1 bg-cream">
      <View className="px-6 pt-4">
        <View className="mb-4 flex-row">
          <View className="mr-2 h-1.5 flex-1 rounded-full bg-primary" />
          <View className="ml-2 h-1.5 flex-1 rounded-full bg-sand" />
        </View>
      </View>
      <ScrollView
        className="flex-1 px-6"
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: "center",
          paddingBottom: 28,
        }}
      >
        <Text className="text-3xl font-black text-cocoa text-center">
          Register Setup
        </Text>

        <Text className="mt-5 text-sm font-bold text-cocoa text-center">
          Model
        </Text>
        <View className="mt-2">
          <Pressable
            onPress={() => {
              setmoduleModel("single-container");
              setError("");
            }}
            className="rounded-2xl border border-sand bg-white p-3"
          >
            <View className="flex-row items-center">
              <View className="mr-3 h-5 w-5 items-center justify-center rounded-full border border-cocoa">
                {moduleModel === "single-container" ? (
                  <View className="h-2.5 w-2.5 rounded-full bg-cocoa" />
                ) : null}
              </View>
              <Text className="flex-1 text-center font-semibold text-cocoa">
                Single Smart Container
              </Text>
            </View>
          </Pressable>

          <Pressable
            onPress={() => {
              setmoduleModel("control-center");
              setError("");
            }}
            className="mt-2 rounded-2xl border border-sand bg-white p-3"
          >
            <View className="flex-row items-center">
              <View className="mr-3 h-5 w-5 items-center justify-center rounded-full border border-cocoa">
                {moduleModel === "control-center" ? (
                  <View className="h-2.5 w-2.5 rounded-full bg-cocoa" />
                ) : null}
              </View>
              <Text className="flex-1 text-center font-semibold text-cocoa">
                Multi-Container Control Center
              </Text>
            </View>
          </Pressable>
        </View>

        <TextInput
          value={setupId}
          onChangeText={(value) => {
            setSetupId(value);
            setError("");
          }}
          placeholder={setupPlaceholder}
          autoCapitalize="characters"
          className="mt-4 rounded-2xl border border-sand bg-white px-4 py-3 text-center text-cocoa"
          placeholderTextColor="#6B7280"
        />

        {validationState === "checking" ? (
          <View className="mt-3 rounded-xl border border-sand bg-white p-3">
            <Text className="text-center text-sm text-cocoa">
              Checking ID...
            </Text>
          </View>
        ) : null}

        {validationState === "valid" ? (
          <View className="mt-3 rounded-xl border border-sand bg-white p-3">
            <Text className="text-center text-sm text-cocoa">ID verified.</Text>
          </View>
        ) : null}

        {validationState === "invalid" ? (
          <View className="mt-3 rounded-xl border border-red-200 bg-red-50 p-3">
            <Text className="text-center text-sm text-red-700">
              {validationMessage}
            </Text>
          </View>
        ) : null}

        {checked && moduleModel === "control-center" ? (
          <View className="mt-4 rounded-2xl border border-sand bg-white p-4">
            <Text className="text-center text-sm font-bold text-cocoa">
              Add Containers
            </Text>

            <TextInput
              value={containerIdInput}
              onChangeText={setContainerIdInput}
              placeholder="CTR-xxxx"
              autoCapitalize="characters"
              className="mt-3 rounded-2xl border border-sand px-4 py-3 text-center text-cocoa"
              placeholderTextColor="#6B7280"
            />

            <TextInput
              value={containerNameInput}
              onChangeText={setContainerNameInput}
              placeholder="Optional Name"
              className="mt-2 rounded-2xl border border-sand px-4 py-3 text-center text-cocoa"
              placeholderTextColor="#6B7280"
            />

            <Pressable
              onPress={addContainer}
              className="mt-3 rounded-2xl bg-primary py-3"
            >
              <Text className="text-center font-bold text-white">
                + Add Container
              </Text>
            </Pressable>

            <View className="mt-3">
              {pending?.containers.map((item) => (
                <View
                  key={item.containerId}
                  className="mb-2 rounded-xl border border-sand bg-cream p-3"
                >
                  <Text className="text-center font-semibold text-cocoa">
                    {item.containerId}
                  </Text>
                  <Text className="text-center text-xs text-mocha">
                    {item.nickname || "No name"}
                  </Text>
                  <Pressable
                    onPress={() =>
                      removeRegistrationContainer(item.containerId)
                    }
                    className="mt-2 self-center"
                  >
                    <Text className="text-xs font-semibold text-red-700">
                      Remove
                    </Text>
                  </Pressable>
                </View>
              ))}
            </View>
          </View>
        ) : null}

        {error ? (
          <View className="mt-3 rounded-xl border border-red-200 bg-red-50 p-3">
            <Text className="text-center text-sm text-red-700">{error}</Text>
          </View>
        ) : null}

        <Pressable onPress={next} className="mt-6 rounded-2xl bg-primary py-4">
          <Text className="text-center text-base font-bold text-white">
            Next
          </Text>
        </Pressable>

        <Pressable
          onPress={() => router.replace("/auth/login")}
          className="mt-4"
        >
          <Text className="text-center text-sm text-mocha">
            Already registered?{" "}
            <Text className="font-bold text-cocoa">Sign in</Text>
          </Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}
