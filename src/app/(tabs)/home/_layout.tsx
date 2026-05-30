import HeaderCreateSnipet from "@/components/HeaderCreateSnipet";
import MainHeader from "@/components/MainHeader";
import { Stack } from "expo-router";

export default function HomeLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          header: () => <MainHeader />,
          title: "Snippets",
        }}
      />
      <Stack.Screen
        name="createSnippet"
        options={{
          header: () => <HeaderCreateSnipet />,
          title: "Create Snippet",
        }}
      />
      <Stack.Screen
        name="snippets/[id]"
        options={{
          headerShown: false,
          title: "Snippet Details",
        }}
      />
      <Stack.Screen
        name="edit/[id]"
        options={{
          headerShown: false,
          title: "Edit Snippet",
        }}
      />
    </Stack>
  );
}
