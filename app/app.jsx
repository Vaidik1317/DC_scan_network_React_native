// app.jsx
import { Slot } from 'expo-router';
import { PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

// If you're using custom fonts, load them here
// import * as Font from 'expo-font';
// import AppLoading from 'expo-app-loading';

export default function App() {
  return (
    <SafeAreaProvider>
      <PaperProvider>
        <StatusBar style="auto" />
        <Slot /> {/* This renders the current route (from your pages) */}
      </PaperProvider>
    </SafeAreaProvider>
  );
}
