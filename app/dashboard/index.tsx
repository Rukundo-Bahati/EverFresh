import { Pressable, ScrollView, Text, View, useWindowDimensions } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useMemo, useState } from "react";
import { useRouter } from "expo-router";
import { LineChart } from "react-native-chart-kit";
import SensorCard from "../../components/SensorCard";
import ScreenMotion from "../../components/ScreenMotion";
import SwipePage from "../../components/SwipePage";
import {
  getBatches,
  getManagedContainers,
  getSystemMode,
  getUnreadAlertCount,
  runContainerHealthCheck,
  runPowerHealthCheck,
} from "../../constants/appStore";

export default function DashboardHome() {
  const router = useRouter();
  const { width } = useWindowDimensions();

  const [containersCount, setContainersCount] = useState(0);
  const [batchesCount, setBatchesCount] = useState(0);
  const [attentionCount, setAttentionCount] = useState(0);
  const [avgTemp, setAvgTemp] = useState(0);
  const [avgHumidity, setAvgHumidity] = useState(0);
  const [airControl, setAirControl] = useState(0);
  const [unreadAlerts, setUnreadAlerts] = useState(0);
  const [tempSeries, setTempSeries] = useState<number[]>([]);
  const [humiditySeries, setHumiditySeries] = useState<number[]>([]);

  const refresh = useCallback(() => {
    runContainerHealthCheck();
    runPowerHealthCheck();

    const containers = getManagedContainers();
    const batches = getBatches();

    setContainersCount(containers.length);
    setBatchesCount(batches.length);
    setAttentionCount(
      containers.filter((item) => item.status === "Attention" || item.status === "Critical").length,
    );

    const temp = containers.reduce((sum, item) => sum + item.currentTempC, 0) / containers.length;
    const humidity =
      containers.reduce((sum, item) => sum + item.currentHumidityPct, 0) / containers.length;
    const avgOxygenGap =
      containers.reduce((sum, item) => sum + Math.abs(item.currentOxygenPct - item.targetOxygenPct), 0) /
      containers.length;
    const oxygenControlScore = Math.max(0, Math.round(100 - avgOxygenGap * 20));

    setAvgTemp(temp);
    setAvgHumidity(humidity);
    setAirControl(Number.isFinite(oxygenControlScore) ? oxygenControlScore : 0);
    setUnreadAlerts(getUnreadAlertCount());

    setTempSeries(containers.map((item) => item.currentTempC));
    setHumiditySeries(containers.map((item) => item.currentHumidityPct));
  }, []);

  useFocusEffect(
    useCallback(() => {
      refresh();
    }, [refresh]),
  );

  const healthScore = useMemo(() => {
    const penalty = attentionCount * 12;
    return Math.max(55, 98 - penalty);
  }, [attentionCount]);
  const isSingleContainer = getSystemMode() === "single-container";

  const chartWidth = Math.max(280, width - 64);
  const labels = tempSeries.map((_, idx) => `C${idx + 1}`);

  return (
    <SwipePage page="home">
      <ScreenMotion>
      <ScrollView className="flex-1 bg-cream" contentContainerStyle={{ paddingBottom: 38 }}>
        <View className="px-5 pt-8">
          <View className="rounded-3xl bg-primary p-5 shadow-lg">
            <Text className="text-3xl font-black text-white">EverFresh</Text>
            <Text className="mt-2 text-sm leading-5 text-sand">
              Control one smart container or a multi-container control center from one app.
            </Text>

            <View className="mt-4 flex-row items-center gap-2 rounded-2xl bg-accent px-3 py-2">
              <Ionicons name="shield-checkmark" size={16} color="#FFFFFF" />
              <Text className="text-xs font-semibold text-cream">System health score: {healthScore}%</Text>
            </View>
          </View>

          <View className="mb-3 mt-6 flex-row items-center justify-between">
            <Text className="text-lg font-bold text-cocoa">Live overview</Text>
            <Pressable
              onPress={() => router.push("/dashboard/alerts")}
              className="flex-row items-center rounded-full border border-sand bg-white px-3 py-2"
            >
              <Ionicons name="notifications-outline" size={16} color="#2C2830" />
              <Text className="ml-2 text-xs font-semibold text-cocoa">{unreadAlerts} unread</Text>
            </Pressable>
          </View>

          <View className="flex-row flex-wrap justify-between">
            <SensorCard label="Containers" value={`${containersCount}`} tone="dark" />
            <SensorCard label="Batches" value={`${batchesCount}`} tone="light" />
            <SensorCard label="Attention" value={`${attentionCount}`} tone="dark" />
            <SensorCard label="Avg Temp" value={`${avgTemp.toFixed(1)}°C`} tone="light" />
            <SensorCard label="Avg Humidity" value={`${avgHumidity.toFixed(0)}%`} tone="light" />
            {isSingleContainer ? (
              <SensorCard label="Air Inside Control" value={`${airControl}%`} tone="dark" />
            ) : null}
          </View>

          <View className="mt-4 rounded-3xl border border-sand bg-white p-4">
            <Text className="text-base font-bold text-cocoa">Analytics</Text>
            <Text className="mt-1 text-xs text-accent">Temperature trend by container</Text>
            <LineChart
              data={{
                labels: labels.length > 0 ? labels : ["C1"],
                datasets: [{ data: tempSeries.length > 0 ? tempSeries : [0] }],
              }}
              width={chartWidth}
              height={180}
              yAxisSuffix="°"
              withShadow={false}
              withInnerLines={false}
              withOuterLines={false}
              chartConfig={{
                backgroundGradientFrom: "#FFFFFF",
                backgroundGradientTo: "#FFFFFF",
                color: () => "#2C2830",
                labelColor: () => "#3A3438",
                decimalPlaces: 1,
                propsForDots: {
                  r: "4",
                  strokeWidth: "2",
                  stroke: "#3A3438",
                },
              }}
              bezier
              style={{ marginTop: 8, borderRadius: 16, marginLeft: -14 }}
            />

            <Text className="mt-3 text-xs text-accent">Humidity trend by container</Text>
            <LineChart
              data={{
                labels: labels.length > 0 ? labels : ["C1"],
                datasets: [{ data: humiditySeries.length > 0 ? humiditySeries : [0] }],
              }}
              width={chartWidth}
              height={180}
              yAxisSuffix="%"
              withShadow={false}
              withInnerLines={false}
              withOuterLines={false}
              chartConfig={{
                backgroundGradientFrom: "#FFFFFF",
                backgroundGradientTo: "#FFFFFF",
                color: () => "#3A3438",
                labelColor: () => "#3A3438",
                decimalPlaces: 0,
                propsForDots: {
                  r: "4",
                  strokeWidth: "2",
                  stroke: "#2C2830",
                },
              }}
              bezier
              style={{ marginTop: 8, borderRadius: 16, marginLeft: -14 }}
            />
          </View>

          <View className="mt-4 rounded-3xl border border-sand bg-white p-4">
            <Text className="text-base font-bold text-cocoa">Operating model</Text>
            <Text className="mt-2 text-sm leading-5 text-accent">
              Each container carries a single product type and maintains storage conditions independently.
              This prevents cross-impact and keeps traceability clean for batch audits.
            </Text>
          </View>
        </View>
      </ScrollView>
      </ScreenMotion>
    </SwipePage>
  );
}
