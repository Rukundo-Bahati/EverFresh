import { ScrollView, Text, View } from "react-native";
import PageHeader from "../../components/PageHeader";

export default function AnalyticsSettings() {
  return (
    <ScrollView className="flex-1 bg-cream px-5 pt-8" contentContainerStyle={{ paddingBottom: 30 }}>
      <PageHeader title="Reports & Data" />

      <View className="rounded-2xl border border-sand bg-white p-4">
        <Text className="font-bold text-cocoa">Batch Loss Trends</Text>
        <Text className="mt-1 text-sm text-mocha">Loss forecast reduced by 61% compared to manual storage.</Text>
      </View>

      <View className="mt-3 rounded-2xl border border-sand bg-white p-4">
        <Text className="font-bold text-cocoa">Climate Stability</Text>
        <Text className="mt-1 text-sm text-mocha">
          Average drift remains within ±1.4°C and ±3% RH across all containers.
        </Text>
      </View>

      <View className="mt-3 rounded-2xl border border-sand bg-white p-4">
        <Text className="font-bold text-cocoa">Export Readiness</Text>
        <Text className="mt-1 text-sm text-mocha">CSV and PDF reports generated automatically every week.</Text>
      </View>
    </ScrollView>
  );
}
