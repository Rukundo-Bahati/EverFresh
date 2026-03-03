import { ScrollView, Text, View } from "react-native";
import PageHeader from "../../components/PageHeader";

const sensors = [
  { name: "Temperature Probe", status: "Calibrated" },
  { name: "Humidity Probe", status: "Calibrated" },
  { name: "Oxygen Probe", status: "Pending" },
];

export default function SensorCalibration() {
  return (
    <ScrollView className="flex-1 bg-cream px-5 pt-8" contentContainerStyle={{ paddingBottom: 30 }}>
      <PageHeader title="Sensor Calibration" />

      {sensors.map((sensor) => (
        <View
          key={sensor.name}
          className="mt-3 flex-row items-center justify-between rounded-2xl border border-sand bg-white p-4"
        >
          <Text className="font-semibold text-cocoa">{sensor.name}</Text>
          <Text
            className={`rounded-full px-3 py-1 text-xs font-semibold ${
              sensor.status === "Calibrated" ? "bg-cream text-cocoa" : "bg-amber-100 text-amber-700"
            }`}
          >
            {sensor.status}
          </Text>
        </View>
      ))}
    </ScrollView>
  );
}
