import Ionicons from "@expo/vector-icons/Ionicons";
import { Tabs } from "expo-router";
import { COLORS, FONT } from "@/theme/theme";

type IconName = React.ComponentProps<typeof Ionicons>["name"];

const TAB_ITEMS: {
  name: string;
  title: string;
  icon: IconName;
  activeIcon: IconName;
}[] = [
  { name: "home", title: "Home", icon: "home-outline", activeIcon: "home" },
  { name: "saved", title: "Saved", icon: "bookmark-outline", activeIcon: "bookmark" },
  { name: "ai", title: "AI", icon: "sparkles-outline", activeIcon: "sparkles" },
  { name: "files", title: "Files", icon: "folder-outline", activeIcon: "folder" },
  { name: "settings", title: "Settings", icon: "settings-outline", activeIcon: "settings" },
];

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: COLORS.surfaceLow,
          borderTopColor: COLORS.border,
          borderTopWidth: 1,
          height: 64,
          paddingBottom: 8,
          paddingTop: 6,
        },
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.textMuted,
        tabBarLabelStyle: {
          fontFamily: FONT.monoMedium,
          fontSize: 10,
          marginTop: 2,
        },
      }}
    >
      {TAB_ITEMS.map(({ name, title, icon, activeIcon }) => (
        <Tabs.Screen
          key={name}
          name={name}
          options={{
            title,
            tabBarIcon: ({ color, focused }) => (
              <Ionicons
                name={focused ? activeIcon : icon}
                size={22}
                color={color}
              />
            ),
          }}
        />
      ))}
    </Tabs>
  );
}
