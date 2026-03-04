import { Tabs, Redirect } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { isAuthenticated } from "../../constants/sessionStore";

export default function DashboardLayout() {
  if (!isAuthenticated()) {
    return <Redirect href="/auth/login" />;
  }

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        animation: "shift",
        tabBarActiveTintColor: "#2C2830",
        tabBarInactiveTintColor: "#9B7C6A",
        tabBarStyle: {
          backgroundColor: "#FFFFFF",
          borderTopColor: "#E5E7EB",
          height: 66,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "700",
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => <Ionicons name="home" size={20} color={color} />,
        }}
      />
      <Tabs.Screen
        name="containers"
        options={{
          title: "Containers",
          tabBarIcon: ({ color }) => <Ionicons name="albums" size={20} color={color} />,
        }}
      />
      <Tabs.Screen
        name="batches"
        options={{
          title: "Batches",
          tabBarIcon: ({ color }) => <Ionicons name="cube" size={20} color={color} />,
        }}
      />
      <Tabs.Screen
        name="alerts"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="batch/[id]"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="container/[id]"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
          tabBarIcon: ({ color }) => <Ionicons name="settings" size={20} color={color} />,
        }}
      />
    </Tabs>
  );
}
