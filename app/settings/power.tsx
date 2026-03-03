import { ScrollView, Text, View } from "react-native";
import PageHeader from "../../components/PageHeader";

const systems = [
  { name: "Battery Level", value: "87%" },
  { name: "Solar Input", value: "Stable" },
  { name: "UPS Reserve", value: "68h" },
];

export default function PowerManagement() {
  return (
    <ScrollView className="flex-1 bg-cream px-5 pt-8" contentContainerStyle={{ paddingBottom: 30 }}>
      <PageHeader title="Power Management" />

      {systems.map((item) => (
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
