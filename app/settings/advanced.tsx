import { ScrollView, Text, View } from "react-native";
import PageHeader from "../../components/PageHeader";

const options = [
  { name: "Firmware", value: "v1.5.2" },
  { name: "Diagnostics", value: "No active faults" },
  { name: "Developer Mode", value: "Disabled" },
];

export default function AdvancedSettings() {
  return (
    <ScrollView className="flex-1 bg-cream px-5 pt-8" contentContainerStyle={{ paddingBottom: 30 }}>
      <PageHeader title="Advanced" />

      {options.map((item) => (
        <View
          key={item.name}
          className="mt-3 flex-row items-center justify-between rounded-2xl border border-sand bg-white p-4"
        >
          <Text className="font-semibold text-cocoa">{item.name}</Text>
          <Text className="font-bold text-accent">{item.value}</Text>
        </View>
      ))}
    </ScrollView>
  );
}
