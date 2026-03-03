import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import ScreenMotion from "../../components/ScreenMotion";
import SwipePage from "../../components/SwipePage";

type SettingItemProps = {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle: string;
  route: string;
};

function SettingItem({ icon, title, subtitle, route }: SettingItemProps) {
  const router = useRouter();

  return (
    <TouchableOpacity
      onPress={() => router.push(route as never)}
      className="mb-2 flex-row items-center justify-between rounded-2xl border border-sand bg-white p-4"
    >
      <View className="mr-2 flex-1 flex-row items-center">
        <View className="mr-3 rounded-xl bg-cream p-2">
          <Ionicons name={icon} size={18} color="#4A2E21" />
        </View>
        <View className="flex-1">
          <Text className="text-base font-bold text-cocoa">{title}</Text>
          <Text className="mt-1 text-xs text-mocha">{subtitle}</Text>
        </View>
      </View>
      <Ionicons name="chevron-forward" size={18} color="#A67C63" />
    </TouchableOpacity>
  );
}

export default function SettingsScreen() {
  return (
    <SwipePage page="settings">
      <ScreenMotion>
      <ScrollView className="flex-1 bg-cream px-5 pt-8" contentContainerStyle={{ paddingBottom: 34 }}>
        <Text className="text-2xl font-black text-cocoa">Settings</Text>
        <Text className="mt-1 text-sm text-accent">Deployment, sensors, notifications, and system controls</Text>

        <Text className="mb-2 mt-6 text-xs font-bold tracking-wide text-mocha">ACCOUNT</Text>
        <SettingItem
          icon="person-outline"
          title="Profile"
          subtitle="Team owner and contact details"
          route="/settings/profile"
        />

        <Text className="mb-2 mt-5 text-xs font-bold tracking-wide text-mocha">OPERATIONS</Text>
        <SettingItem
          icon="albums-outline"
          title="Container Model"
          subtitle="Single-container or multi-container mode"
          route="/settings/container"
        />
        <SettingItem
          icon="hardware-chip-outline"
          title="Sensor Calibration"
          subtitle="Temperature, humidity and oxygen probes"
          route="/settings/sensors"
        />
        <SettingItem
          icon="notifications-outline"
          title="Alert Preferences"
          subtitle="Push/SMS and critical-only rules"
          route="/settings/alerts"
        />
        <SettingItem
          icon="warning-outline"
          title="Alerts Center"
          subtitle="Open operational notifications feed"
          route="/dashboard/alerts"
        />
        <SettingItem
          icon="bar-chart-outline"
          title="Reports & Data"
          subtitle="Insights and export readiness"
          route="/settings/analytics"
        />
        <SettingItem
          icon="battery-charging-outline"
          title="Power Management"
          subtitle="Battery, solar and UPS status"
          route="/settings/power"
        />
        <SettingItem
          icon="settings-outline"
          title="Advanced"
          subtitle="Firmware and diagnostics"
          route="/settings/advanced"
        />

        <Text className="mb-2 mt-5 text-xs font-bold tracking-wide text-mocha">SESSION</Text>
        <SettingItem
          icon="log-out-outline"
          title="Logout"
          subtitle="End current operator session"
          route="/settings/logout"
        />
      </ScrollView>
      </ScreenMotion>
    </SwipePage>
  );
}
