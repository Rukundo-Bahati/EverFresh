import { useState } from "react";
import { ScrollView, Switch, Text, View } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback } from "react";
import PageHeader from "../../components/PageHeader";
import {
  getNotificationPreferences,
  getUnreadAlertCount,
  updateNotificationPreferences,
  type NotificationPreferences,
} from "../../constants/appStore";

export default function AlertPreferences() {
  const [prefs, setPrefs] = useState<NotificationPreferences>(getNotificationPreferences());
  const [unread, setUnread] = useState(0);

  useFocusEffect(
    useCallback(() => {
      setPrefs(getNotificationPreferences());
      setUnread(getUnreadAlertCount());
    }, []),
  );

  const apply = (next: NotificationPreferences) => {
    setPrefs(next);
    updateNotificationPreferences(next);
    setUnread(getUnreadAlertCount());
  };

  return (
    <ScrollView className="flex-1 bg-cream px-5 pt-8" contentContainerStyle={{ paddingBottom: 30 }}>
      <PageHeader title="Alert Preferences" subtitle="Configure how operational alerts are delivered." />

      <View className="mt-1 rounded-2xl border border-sand bg-white p-4">
        <Text className="text-sm text-cocoa">Unread operational alerts: {unread}</Text>
      </View>

      <View className="mt-3">
        <View className="mb-3 flex-row items-center justify-between rounded-2xl border border-sand bg-white p-4">
          <Text className="font-semibold text-cocoa">Push notifications</Text>
          <Switch
            value={prefs.push}
            onValueChange={(value) => apply({ ...prefs, push: value })}
            trackColor={{ true: "#3A3438" }}
          />
        </View>

        <View className="mb-3 flex-row items-center justify-between rounded-2xl border border-sand bg-white p-4">
          <Text className="font-semibold text-cocoa">SMS notifications</Text>
          <Switch
            value={prefs.sms}
            onValueChange={(value) => apply({ ...prefs, sms: value })}
            trackColor={{ true: "#3A3438" }}
          />
        </View>

        <View className="flex-row items-center justify-between rounded-2xl border border-sand bg-white p-4">
          <Text className="font-semibold text-cocoa">Critical only</Text>
          <Switch
            value={prefs.criticalOnly}
            onValueChange={(value) => apply({ ...prefs, criticalOnly: value })}
            trackColor={{ true: "#3A3438" }}
          />
        </View>
      </View>
    </ScrollView>
  );
}
