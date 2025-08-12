// app/_layout.jsx
import React from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { ScanProvider } from "@/context/scanContext";
import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ScanProvider>
        <Stack screenOptions={{ headerTitleAlign: "center" }}>
          <Stack.Screen name="index" options={{ headerShown: false, title: "DC Scan Network" }} />
        </Stack>
      </ScanProvider>
    </GestureHandlerRootView>
  );
}
