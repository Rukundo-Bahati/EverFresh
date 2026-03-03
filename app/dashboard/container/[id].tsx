import { Redirect, useLocalSearchParams } from "expo-router";
import { ScrollView, Text, View } from "react-native";
import PageHeader from "../../../components/PageHeader";
import { getContainerById, getBatches } from "../../../constants/appStore";

export default function ContainerDetailsScreen() {
  const params = useLocalSearchParams<{ id: string }>();
  const container = getContainerById(String(params.id ?? ""));

  if (!container) {
    return <Redirect href="/dashboard/containers" />;
  }

  const relatedBatches = getBatches().filter((item) => item.containerId === container.id);

  return (
    <ScrollView className="flex-1 bg-cream px-5 pt-8" contentContainerStyle={{ paddingBottom: 30 }}>
      <PageHeader title="Container Details" subtitle={container.name} />

      <View className="rounded-2xl border border-sand bg-white p-4">
        <Text className="text-xs text-mocha">Container Type</Text>
        <Text className="mt-1 text-base font-bold text-cocoa">{container.type}</Text>
      </View>

      <View className="mt-3 rounded-2xl border border-sand bg-white p-4">
        <Text className="text-xs text-mocha">Current Product</Text>
        <Text className="mt-1 text-base font-bold text-cocoa">{container.productType}</Text>
      </View>

      <View className="mt-3 rounded-2xl border border-sand bg-white p-4">
        <Text className="text-xs text-mocha">Current Conditions</Text>
        <Text className="mt-1 text-base font-bold text-cocoa">
          {container.currentTempC}°C, {container.currentHumidityPct}% RH, {container.currentOxygenPct}% O2
        </Text>
      </View>

      <View className="mt-3 rounded-2xl border border-sand bg-white p-4">
        <Text className="text-xs text-mocha">Target Conditions</Text>
        <Text className="mt-1 text-base font-bold text-cocoa">
          {container.targetTempC}°C, {container.targetHumidityPct}% RH, {container.targetOxygenPct}% O2
        </Text>
      </View>

      <View className="mt-3 rounded-2xl border border-sand bg-white p-4">
        <Text className="text-xs text-mocha">Fill & Sync</Text>
        <Text className="mt-1 text-base font-bold text-cocoa">{container.fillPercent}% • {container.lastSync}</Text>
      </View>

      <View className="mt-3 rounded-2xl border border-sand bg-white p-4">
        <Text className="text-xs text-mocha">Related Batches</Text>
        <Text className="mt-1 text-base font-bold text-cocoa">{relatedBatches.length}</Text>
      </View>
    </ScrollView>
  );
}
