import { Redirect, useLocalSearchParams } from "expo-router";
import { ScrollView, Text, View } from "react-native";
import PageHeader from "../../../components/PageHeader";
import { getBatchById, getContainerById } from "../../../constants/appStore";

export default function BatchDetailsScreen() {
  const params = useLocalSearchParams<{ id: string }>();
  const batch = getBatchById(String(params.id ?? ""));

  if (!batch) {
    return <Redirect href="/dashboard/batches" />;
  }

  const container = getContainerById(batch.containerId);

  return (
    <ScrollView className="flex-1 bg-cream px-5 pt-8" contentContainerStyle={{ paddingBottom: 30 }}>
      <PageHeader title="Batch Details" subtitle={`${batch.productName} • ${batch.containerName}`} />

      <View className="rounded-2xl border border-sand bg-white p-4">
        <Text className="text-xs text-mocha">Product</Text>
        <Text className="mt-1 text-base font-bold text-cocoa">{batch.productName}</Text>
      </View>

      <View className="mt-3 rounded-2xl border border-sand bg-white p-4">
        <Text className="text-xs text-mocha">Profile</Text>
        <Text className="mt-1 text-base font-bold text-cocoa">{batch.profile}</Text>
      </View>

      <View className="mt-3 rounded-2xl border border-sand bg-white p-4">
        <Text className="text-xs text-mocha">Quantity</Text>
        <Text className="mt-1 text-base font-bold text-cocoa">{batch.quantityKg} kg</Text>
      </View>

      <View className="mt-3 rounded-2xl border border-sand bg-white p-4">
        <Text className="text-xs text-mocha">Entry / Expiry</Text>
        <Text className="mt-1 text-base font-bold text-cocoa">{batch.enteredOn} to {batch.expiryOn}</Text>
      </View>

      <View className="mt-3 rounded-2xl border border-sand bg-white p-4">
        <Text className="text-xs text-mocha">Target Conditions</Text>
        <Text className="mt-1 text-base font-bold text-cocoa">
          {batch.targetTempC}°C, {batch.targetHumidityPct}% RH, {batch.targetOxygenPct}% O2
        </Text>
      </View>

      {container ? (
        <View className="mt-3 rounded-2xl border border-sand bg-white p-4">
          <Text className="text-xs text-mocha">Assigned Container</Text>
          <Text className="mt-1 text-base font-bold text-cocoa">{container.name}</Text>
          <Text className="mt-1 text-sm text-accent">{container.type} • Status {container.status}</Text>
        </View>
      ) : null}
    </ScrollView>
  );
}
