import { Tabs } from "expo-router";

export default function TabsLayout() {
  return (
    <Tabs>
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
        }}
      />
      <Tabs.Screen
        name="ai"
        options={{
          title: "Ai",
        }}
      />
       <Tabs.Screen
        name="files"
        options={{
          title: "Files",
        }}
      />
       <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
        }}
      />
    </Tabs>
  );
}
