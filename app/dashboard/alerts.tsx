import { useCallback, useState } from "react";
import { FlatList, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect } from "@react-navigation/native";
import PageHeader from "../../components/PageHeader";
import { getAlerts, markAllAlertsAsRead } from "../../constants/appStore";

const levelTone = {
  Info: "bg-blue-100 text-blue-700",
  Warning: "bg-amber-100 text-amber-700",
  Critical: "bg-red-100 text-red-700",
};

export default function AlertsScreen() {
  const [alerts, setAlerts] = useState(getAlerts());

  useFocusEffect(
    useCallback(() => {
      markAllAlertsAsRead();
      setAlerts(getAlerts());
    }, []),
  );

  return (
    <SafeAreaView className="flex-1 bg-cream" edges={["top"]}>
      <FlatList
        className="flex-1"
        data={alerts}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={
          <View className="px-5 pt-3 pb-4">
            <PageHeader title="Alerts" subtitle="Operational and spoilage-risk notifications" />
          </View>
        }
        renderItem={({ item }) => (
          <View className="mx-5 mb-3 rounded-2xl border border-sand bg-white p-4">
            <View className="flex-row items-center justify-between">
              <Text className={`rounded-full px-3 py-1 text-xs font-semibold ${levelTone[item.level]}`}>
                {item.level}
              </Text>
              <Text className="text-xs text-mocha">{new Date(item.timestamp).toLocaleString()}</Text>
            </View>

            <Text className="mt-3 text-sm leading-5 text-cocoa">{item.message}</Text>
            <Text className="mt-2 text-xs text-accent">
              Delivered via: {item.viaPush ? "Push " : ""}
              {item.viaSms ? "SMS" : ""}
              {!item.viaPush && !item.viaSms ? "In-app only" : ""}
            </Text>
          </View>
        )}
        ListEmptyComponent={() => (
          <View className="mt-20 items-center px-5">
            <Text className="text-sm text-mocha">No active alerts.</Text>
          </View>
        )}
        contentContainerStyle={{ paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}
