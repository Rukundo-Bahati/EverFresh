import { Redirect } from "expo-router";
import { ScrollView, Text, View } from "react-native";
import PageHeader from "../../components/PageHeader";
import { getCurrentAccount } from "../../constants/sessionStore";

export default function ProfileSettings() {
  const account = getCurrentAccount();

  if (!account) {
    return <Redirect href="/auth/login" />;
  }

  return (
    <ScrollView className="flex-1 bg-cream px-5 pt-8" contentContainerStyle={{ paddingBottom: 30 }}>
      <PageHeader title="Profile" />

      <View className="rounded-2xl border border-sand bg-white p-4">
        <Text className="text-xs text-mocha">Account Label (Auto)</Text>
        <Text className="mt-1 text-base font-bold text-cocoa">{account.companyName}</Text>
      </View>

      <View className="mt-3 rounded-2xl border border-sand bg-white p-4">
        <Text className="text-xs text-mocha">Deployment</Text>
        <Text className="mt-1 text-base font-bold text-cocoa">
          {account.deploymentModel === "single-container"
            ? "Single Smart Container"
            : "Multi-Container Control Center"}
        </Text>
      </View>

      <View className="mt-3 rounded-2xl border border-sand bg-white p-4">
        <Text className="text-xs text-mocha">
          {account.deploymentModel === "single-container" ? "Registered Container ID" : "Registered Control Center ID"}
        </Text>
        <Text className="mt-1 text-base font-bold text-cocoa">{account.setupId}</Text>
      </View>

      <View className="mt-3 rounded-2xl border border-sand bg-white p-4">
        <Text className="text-xs text-mocha">Containers Under This Setup</Text>
        <Text className="mt-1 text-base font-bold text-cocoa">{account.managedContainers.length}</Text>
      </View>
    </ScrollView>
  );
}
