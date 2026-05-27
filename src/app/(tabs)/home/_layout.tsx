import MainHeader from "@/components/MainHeader";
import { Drawer } from "expo-router/drawer";
import { StatusBar } from "react-native";

export default function HomeLayout() {
  return (
    <Drawer
      screenOptions={{
        headerShown: true,
        header: () => <MainHeader />,
        drawerType: "slide",
      }}
    >
      <Drawer.Screen
        name="index"
        options={{
          title: "Recent snippets",
        }}
      />
      <Drawer.Screen
        name="all_snippets"
        options={{
          title: "All snippets",
        }}
      />
    </Drawer>
  );
}
