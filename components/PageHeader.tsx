import { Pressable, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

type PageHeaderProps = {
  title: string;
  subtitle?: string;
};

export default function PageHeader({ title, subtitle }: PageHeaderProps) {
  const router = useRouter();

  return (
    <View className="mb-4 flex-row items-start">
      <Pressable onPress={() => router.back()} className="mr-3 mt-1 rounded-full bg-white p-2">
        <Ionicons name="chevron-back" size={18} color="#4A2E21" />
      </Pressable>

      <View className="flex-1">
        <Text className="text-2xl font-black text-cocoa">{title}</Text>
        {subtitle ? <Text className="mt-1 text-sm text-accent">{subtitle}</Text> : null}
      </View>
    </View>
  );
}
