import { Text, View } from "react-native";

type SensorCardProps = {
  label: string;
  value: string;
  tone?: "light" | "dark";
};

export default function SensorCard({ label, value, tone = "light" }: SensorCardProps) {
  const dark = tone === "dark";

  return (
    <View
      className={`mb-3 w-[48%] rounded-2xl p-4 ${dark ? "bg-accent" : "border border-sand bg-white"}`}
    >
      <Text className={`text-xs ${dark ? "text-cream" : "text-mocha"}`}>{label}</Text>
      <Text className={`mt-1 text-xl font-black ${dark ? "text-white" : "text-cocoa"}`}>{value}</Text>
    </View>
  );
}
