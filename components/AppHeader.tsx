import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";

type Role = "farmer" | "household" | "institution";

interface Props {
    role: Role;
    containerName?: string;
    status?: "optimal" | "warning" | "critical";
}

const roleTitle = {
    farmer: "Farmer Smart Storage",
    household: "Household Food Preservation",
    institution: "Institutional Cold Storage",
};

const statusColor = {
    optimal: "bg-green-600",
    warning: "bg-yellow-600",
    critical: "bg-red-600",
};

export default function AppHeader({
                                      role,
                                      containerName = "Main Container",
                                      status = "optimal",
                                  }: Props) {
    return (
        <View className={`${statusColor[status]} rounded-2xl p-5 mb-6`}>
            <Text className="text-white text-xs opacity-80">
                EVERFRESH • {roleTitle[role]}
            </Text>

            <Text className="text-white text-2xl font-bold mt-1">
                {containerName}
            </Text>

            <View className="flex-row items-center mt-2">
                <Ionicons name="leaf" size={16} color="white" />
                <Text className="text-white text-sm ml-2">
                    AI Climate Control Active • Solar Powered
                </Text>
            </View>

            <Text className="text-white text-xs mt-1 opacity-90">
                Status: {status.toUpperCase()} • Predictive spoilage prevention enabled
            </Text>
        </View>
    );
}
