import { useCallback, useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { useRouter } from "expo-router";
import { getManagedContainers, getSystemMode } from "../../constants/appStore";
import ScreenMotion from "../../components/ScreenMotion";
import SwipePage from "../../components/SwipePage";

const statusStyle = {
  Optimal: "bg-cream text-cocoa",
  Attention: "bg-amber-100 text-amber-700",
  Critical: "bg-red-100 text-red-700",
};

export default function ContainersScreen() {
  const router = useRouter();
  const [containers, setContainers] = useState(getManagedContainers());
  const [mode, setMode] = useState(getSystemMode());

  useFocusEffect(
    useCallback(() => {
      setContainers(getManagedContainers());
      setMode(getSystemMode());
    }, []),
  );

  return (
    <SwipePage page="containers">
      <ScreenMotion>
      <ScrollView className="flex-1 bg-cream px-5 pt-8" contentContainerStyle={{ paddingBottom: 40 }}>
        <Text className="text-2xl font-black text-cocoa">Container Fleet</Text>
        <Text className="mt-1 text-sm text-accent">
          Running in {mode === "single-container" ? "Single-Container" : "Multi-Container"} mode.
        </Text>

        {containers.map((container) => (
          <Pressable
            key={container.id}
            onPress={() => router.push(`/dashboard/container/${container.id}`)}
            className="mt-4 rounded-3xl border border-sand bg-white p-4"
          >
            <View className="flex-row items-center justify-between">
              <Text className="text-lg font-bold text-cocoa">{container.name}</Text>
              <Text className={`rounded-full px-3 py-1 text-xs font-semibold ${statusStyle[container.status]}`}>
                {container.status}
              </Text>
            </View>

            <Text className="mt-2 text-sm text-mocha">
              {container.type} • Product: {container.productType}
            </Text>

            <View className="mt-3 flex-row justify-between">
              <Text className="text-sm text-accent">Fill level</Text>
              <Text className="text-sm font-semibold text-cocoa">{container.fillPercent}%</Text>
            </View>
            <View className="mt-1 h-2 overflow-hidden rounded-full bg-sand">
              <View className="h-2 rounded-full bg-primary" style={{ width: `${container.fillPercent}%` }} />
            </View>

            <View className="mt-3 flex-row flex-wrap justify-between rounded-2xl bg-cream p-3">
              <Text className="text-xs text-cocoa">Temp {container.currentTempC}°C / {container.targetTempC}°C</Text>
              <Text className="text-xs text-cocoa">
                Humidity {container.currentHumidityPct}% / {container.targetHumidityPct}%
              </Text>
              <Text className="mt-1 text-xs text-cocoa">
                Oxygen {container.currentOxygenPct}% / {container.targetOxygenPct}%
              </Text>
            </View>

            <View className="mt-3 flex-row items-center">
              <Ionicons name="time-outline" size={14} color="#7A4A32" />
              <Text className="ml-2 text-xs text-accent">Last sync: {container.lastSync}</Text>
            </View>
          </Pressable>
        ))}
      </ScrollView>
      </ScreenMotion>
    </SwipePage>
  );
}
