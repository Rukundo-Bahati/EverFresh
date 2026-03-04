import { useEffect, useMemo, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import PageHeader from "../../components/PageHeader";
import {
  addBatch,
  generateBatchDraft,
  getManagedContainers,
  type GeneratedBatchDraft,
} from "../../constants/appStore";

export default function AddBatchScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const containers = useMemo(() => getManagedContainers(), []);

  const [selectedContainerId, setSelectedContainerId] = useState(containers[0]?.id ?? "");
  const [productName, setProductName] = useState("");
  const [draft, setDraft] = useState<GeneratedBatchDraft | null>(null);
  const [confirmVisible, setConfirmVisible] = useState(false);

  useEffect(() => {
    const name = productName.trim();
    if (!name || !selectedContainerId) {
      setDraft(null);
      return;
    }

    const timer = setTimeout(() => {
      setDraft(generateBatchDraft(name, selectedContainerId));
    }, 300);

    return () => clearTimeout(timer);
  }, [productName, selectedContainerId]);

  const handleSave = () => {
    if (!draft) {
      Alert.alert("Missing details", "Enter a product name so AI can generate storage details.");
      return;
    }

    setConfirmVisible(true);
  };

  const handleConfirm = () => {
    if (!draft) {
      return;
    }

    addBatch(draft);
    setConfirmVisible(false);
    Alert.alert("Saved", `${draft.productName} batch added. Container targets were updated.`);
    router.replace("/dashboard/batches");
  };

  return (
    <SafeAreaView className="flex-1 bg-cream">
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0}
      >
        <ScrollView
          className="flex-1 px-5"
          contentContainerStyle={{ paddingTop: 20, paddingBottom: Math.max(24, insets.bottom + 16) }}
          keyboardShouldPersistTaps="handled"
        >
          <PageHeader
            title="New Batch"
            subtitle="Enter product name only. AI autofills profile."
          />

          <View className="mt-1 rounded-3xl border border-sand bg-white p-4">
            <Text className="mb-2 text-sm font-semibold text-cocoa">Product name</Text>
            <TextInput
              className="rounded-2xl border border-sand px-4 py-3 text-base text-cocoa"
              placeholder="e.g., beans"
              placeholderTextColor="#6B7280"
              value={productName}
              onChangeText={setProductName}
              returnKeyType="done"
            />

            <Text className="mb-2 mt-4 text-sm font-semibold text-cocoa">Assign container</Text>
            <View className="flex-row flex-wrap">
              {containers.map((container) => {
                const active = selectedContainerId === container.id;
                return (
                  <Pressable
                    key={container.id}
                    onPress={() => setSelectedContainerId(container.id)}
                    className={`mb-2 mr-2 rounded-full px-3 py-2 ${active ? "bg-primary" : "bg-cream"}`}
                  >
                    <Text className={`text-xs font-semibold ${active ? "text-white" : "text-cocoa"}`}>
                      {container.name}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            <Text className="mt-1 text-xs text-mocha">AI updates details automatically as you type.</Text>
          </View>

          {draft ? (
            <View className="mt-4 rounded-3xl border border-sand bg-white p-4">
              <View className="mb-3 flex-row items-center">
                <Ionicons name="sparkles" size={17} color="#3A3438" />
                <Text className="ml-2 text-sm font-bold text-cocoa">AI-generated details</Text>
              </View>

              <Text className="text-sm text-mocha">Product: {draft.productName}</Text>
              <Text className="text-sm text-mocha">Profile: {draft.profile}</Text>
              <Text className="text-sm text-mocha">Container: {draft.containerName}</Text>
              <Text className="text-sm text-mocha">Quantity: {draft.quantityKg} kg</Text>
              <Text className="text-sm text-mocha">Entered: {draft.enteredOn}</Text>
              <Text className="text-sm text-mocha">Expiry: {draft.expiryOn}</Text>
              <Text className="text-sm text-mocha">
                Targets: {draft.targetTempC}°C | {draft.targetHumidityPct}% RH | {draft.targetOxygenPct}% O2
              </Text>

              <Pressable onPress={handleSave} className="mt-4 rounded-2xl bg-primary py-3">
                <Text className="text-center font-bold text-white">Save</Text>
              </Pressable>
            </View>
          ) : null}
        </ScrollView>
      </KeyboardAvoidingView>

      <Modal visible={confirmVisible} transparent animationType="slide" onRequestClose={() => setConfirmVisible(false)}>
        <View className="flex-1 justify-end bg-black/40">
          <View className="rounded-t-3xl bg-white px-5 pt-5" style={{ paddingBottom: Math.max(20, insets.bottom + 10) }}>
            <Text className="text-xl font-black text-cocoa">Confirm Batch</Text>
            <Text className="mt-1 text-sm text-accent">Review AI-filled details before final save.</Text>

            {draft ? (
              <ScrollView className="mt-4 max-h-[260px] rounded-2xl bg-cream p-4">
                <Text className="text-sm text-cocoa">Product: {draft.productName}</Text>
                <Text className="text-sm text-cocoa">Profile: {draft.profile}</Text>
                <Text className="text-sm text-cocoa">Container: {draft.containerName}</Text>
                <Text className="text-sm text-cocoa">Quantity: {draft.quantityKg} kg</Text>
                <Text className="text-sm text-cocoa">Entered: {draft.enteredOn}</Text>
                <Text className="text-sm text-cocoa">Expiry: {draft.expiryOn}</Text>
                <Text className="text-sm text-cocoa">
                  Targets: {draft.targetTempC}°C, {draft.targetHumidityPct}% RH, {draft.targetOxygenPct}% O2
                </Text>
              </ScrollView>
            ) : null}

            <View className="mt-5 flex-row">
              <Pressable
                onPress={() => setConfirmVisible(false)}
                className="mr-2 flex-1 rounded-2xl border border-sand py-3"
              >
                <Text className="text-center font-semibold text-cocoa">Cancel</Text>
              </Pressable>
              <Pressable onPress={handleConfirm} className="ml-2 flex-1 rounded-2xl bg-primary py-3">
                <Text className="text-center font-semibold text-white">Confirm</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
