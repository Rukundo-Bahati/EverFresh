import { Stack } from "expo-router";
import "./globals.css";
import "./i18n";

export default function RootLayout() {
  return (
    <Stack
      initialRouteName="index"
      screenOptions={{
        headerShown: false,
        animation: "slide_from_right",
        animationDuration: 220,
        gestureEnabled: true,
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="auth/login" />
      <Stack.Screen name="auth/login-access" />
      <Stack.Screen name="auth/signup" />
      <Stack.Screen name="auth/signup-access" />
      <Stack.Screen name="dashboard" />
      <Stack.Screen
        name="dashboard-add-batch"
        options={{ presentation: "modal", animation: "slide_from_bottom", animationDuration: 220 }}
      />
      <Stack.Screen name="settings" />
    </Stack>
  );
}
