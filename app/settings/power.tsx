import { useCallback, useState } from "react";
import { ScrollView, Text, View } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import PageHeader from "../../components/PageHeader";
import { getPowerStatus, runPowerHealthCheck, type PowerStatus } from "../../constants/appStore";

export default function PowerManagement() {
  const [status, setStatus] = useState<PowerStatus>(getPowerStatus());

  useFocusEffect(
    useCallback(() => {
      runPowerHealthCheck();
      setStatus(getPowerStatus());
    }, []),
  );

  const systems = [
    { name: "Battery Level", value: `${status.batteryPct}%` },
    { name: "UPS Reserve", value: `${status.upsReserveHours}h` },
  ];

  return (
    <ScrollView className="flex-1 bg-cream px-5 pt-8" contentContainerStyle={{ paddingBottom: 30 }}>
      <PageHeader title="Power Management" subtitle="Battery and UPS status with in-app power alerts." />

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
