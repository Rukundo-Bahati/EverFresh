import { useCallback, useState } from "react";
import { FlatList, Pressable, Text, View } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { getBatches } from "../../constants/appStore";
import ScreenMotion from "../../components/ScreenMotion";
import SwipePage from "../../components/SwipePage";

const statusTone = {
  Good: "bg-cream text-cocoa",
  Watch: "bg-amber-100 text-amber-700",
  Critical: "bg-red-100 text-red-700",
};

export default function BatchesScreen() {
  const router = useRouter();
  const [batches, setBatches] = useState(getBatches());

  useFocusEffect(
    useCallback(() => {
      setBatches(getBatches());
    }, []),
  );

  return (
    <SafeAreaView className="flex-1 bg-cream" edges={["top"]}>
      <SwipePage page="batches">
        <ScreenMotion>
          <FlatList
            className="flex-1"
            data={batches}
            keyExtractor={(item) => item.id}
            ListHeaderComponent={
              <View className="px-5 pt-3 pb-4">
                <Text className="text-2xl font-black text-cocoa">Batches</Text>
                <Text className="text-sm text-accent">Single-product traceability per container</Text>

                <Pressable
                  onPress={() => router.push("/dashboard-add-batch")}
                  className="mt-3 rounded-2xl bg-primary py-4"
                >
                  <Text className="text-center text-base font-bold text-white">+ Add Batch</Text>
                </Pressable>
              </View>
            }
            renderItem={({ item }) => (
              <Pressable
                onPress={() => router.push(`/dashboard/batch/${item.id}`)}
                className="mx-5 mb-3 rounded-3xl border border-sand bg-white p-4"
              >
                <View className="flex-row items-center justify-between">
                  <Text className="text-lg font-bold text-cocoa">{item.productName}</Text>
                  <Text className={`rounded-full px-3 py-1 text-xs font-semibold ${statusTone[item.status]}`}>
                    {item.status}
                  </Text>
                </View>

                <Text className="mt-1 text-sm text-mocha">
                  {item.profile} • {item.quantityKg} kg • {item.containerName}
                </Text>

                <View className="mt-3 rounded-2xl bg-cream p-3">
                  <Text className="text-xs text-cocoa">Entered: {item.enteredOn} | Expiry: {item.expiryOn}</Text>
                  <Text className="mt-1 text-xs text-cocoa">
                    Targets: {item.targetTempC}°C, {item.targetHumidityPct}% RH, {item.targetOxygenPct}% O2
                  </Text>
                </View>
              </Pressable>
            )}
            ListEmptyComponent={() => (
              <View className="mt-20 items-center px-5">
                <Text className="text-center text-sm text-mocha">No batches yet. Tap Add Batch to start.</Text>
              </View>
            )}
            contentContainerStyle={{ paddingBottom: 120 }}
            showsVerticalScrollIndicator={false}
          />
        </ScreenMotion>
      </SwipePage>
    </SafeAreaView>
  );
}
