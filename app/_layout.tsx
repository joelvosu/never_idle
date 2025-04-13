import { Stack } from "expo-router";
import './globals.css';

export default function RootLayout() {
  return <Stack>
    <Stack.Screen
        name="(categories)"
        options={{ headerShown: false }}
    />
    <Stack.Screen
        name="task/[id]"
        options={{ headerShown: false }}
    />
    <Stack.Screen
        name="profile"
        options={{ headerShown: false }}
    />
  </Stack>;
}
