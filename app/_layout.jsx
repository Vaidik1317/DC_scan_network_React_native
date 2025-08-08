import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import { Drawer } from 'expo-router/drawer';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { ScanProvider, useScan } from '@/context/scanContext';
import { downloadExcel } from '@/utils/downloadExcel';
import { View } from 'react-native';
// import './globals.css';

// custom drawer content component MUST be inside provider's render tree
function CustomDrawerContent(props) {
  const {
    triggerScan,
    allDevices,
    filteredDevices,
    searchQuery,
  } = useScan();

  const handleDownload = () => downloadExcel({ allDevices, filteredDevices, searchQuery });

  return (
    <DrawerContentScrollView {...props}>
      <DrawerItem
        label="Scan"
        icon={({ color, size }) => <Ionicons name="scan" size={size} color={color} />}
        onPress={triggerScan}
      />
      <DrawerItem
        label="Excel"
        icon={({ color, size }) => <Ionicons name="download" size={size} color={color} />}
        onPress={handleDownload}
      />
    </DrawerContentScrollView>
  );
}

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ScanProvider>
        <Drawer drawerContent={(props) => <CustomDrawerContent {...props} />}>
          <Drawer.Screen name="index" options={{
            title: 'DC Scan Network',
            headerStyle: {
              backgroundColor: "#292ce9ff",

            },
            headerTintColor: '#fff',
            headerTitleAlign: 'center',

          }} />
        </Drawer>
      </ScanProvider>
    </GestureHandlerRootView>
  );
}
