import { Redirect } from "expo-router";
import { ScrollView, Text, View } from "react-native";
import PageHeader from "../../components/PageHeader";
import { getManagedContainers } from "../../constants/appStore";
import { getCurrentAccount } from "../../constants/sessionStore";

export default function ContainerSettingsScreen() {
  const account = getCurrentAccount();

  if (!account) {
    return <Redirect href="/auth/login" />;
  }

  const containers = getManagedContainers();

  return (
    <ScrollView className="flex-1 bg-cream px-5 pt-8" contentContainerStyle={{ paddingBottom: 30 }}>
      <PageHeader
        title="Container Model"
        subtitle="This is locked by registered setup type and admin records."
      />

      <View className="mt-1 rounded-3xl border border-sand bg-white p-4">
        <Text className="text-xs text-mocha">Registered Setup Type</Text>
        <Text className="mt-1 text-base font-bold text-cocoa">
          {account.deploymentModel === "single-container"
            ? "Single Smart Container"
            : "Multi-Container Control Center"}
        </Text>
        <Text className="mt-1 text-xs text-accent">
          {account.deploymentModel === "single-container"
            ? `Container ID: ${account.setupId}`
            : `Control Center ID: ${account.setupId}`}
        </Text>
      </View>

      <View className="mt-4 rounded-3xl border border-sand bg-white p-4">
        <Text className="text-base font-bold text-cocoa">Registered Containers</Text>
        {containers.map((container) => (
          <View key={container.id} className="mt-2 rounded-2xl bg-cream p-3">
            <Text className="font-semibold text-cocoa">{container.name}</Text>
            <Text className="text-xs text-mocha">ID: {container.id}</Text>
          </View>
        ))}
      </View>

      <View className="mt-4 rounded-3xl border border-sand bg-white p-4">
        <Text className="text-base font-bold text-cocoa">Operational rule</Text>
        <Text className="mt-2 text-sm leading-5 text-mocha">
          This account can only control registered container IDs linked to this setup in admin records.
        </Text>
      </View>
    </ScrollView>
  );
}
