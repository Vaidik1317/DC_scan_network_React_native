import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import Octicons from "@expo/vector-icons/Octicons";
import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { Searchbar, Text } from "react-native-paper";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { WebView } from "react-native-webview";

import { useScan } from "@/context/scanContext";
import scanStyle from "@/styles/scanStyle";
import { downloadExcel } from "@/utils/downloadExcel";

const Data = () => {
  const {
    trigger,
    resetTrigger,
    allDevices,
    setAllDevices,
    filteredDevices,
    setFilteredDevices,
    searchQuery,
    setSearchQuery,
  } = useScan();

  const insets = useSafeAreaInsets();
  const styles = scanStyle();

  const [loading, setLoading] = useState(false);
  const [webViewUrl, setWebViewUrl] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get("http://192.168.29.198:7001/arp-scan");
      setAllDevices(data.devices || []);
      setFilteredDevices(data.devices || []);
      setSearchQuery("");
    } catch (error) {
      console.log("Error fetching devices:", error.message);
    } finally {
      setLoading(false);
    }
  };

  // initial load
  useEffect(() => {
    fetchData();
  }, []);

  // re-fetch on trigger
  useEffect(() => {
    if (trigger) {
      fetchData();
      resetTrigger();
    }
  }, [trigger]);

  // filtering
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredDevices(allDevices);
    } else {
      const q = searchQuery.toLowerCase();
      setFilteredDevices(
        allDevices.filter(
          (d) =>
            (d.ip || "").toLowerCase().includes(q) ||
            (d.mac || "").toLowerCase().includes(q) ||
            (d.hostname || "").toLowerCase().includes(q)
        )
      );
    }
  }, [searchQuery, allDevices]);

  const handleIpPress = (ip) => {
    const url = `http://${ip}`;
    if (Platform.OS === "web") {
      window.open(url, "_blank");
    } else {
      setWebViewUrl(url);
    }
  };

  // WebView screen
  if (webViewUrl) {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <View
          style={{ flexDirection: "row", padding: 10, backgroundColor: "#fff" }}
        >
          <TouchableOpacity onPress={() => setWebViewUrl(null)}>
            <Text style={{ color: "purple", marginLeft: 7, fontSize: 20 }}>
              ← Back
            </Text>
          </TouchableOpacity>
        </View>
        <WebView source={{ uri: webViewUrl }} style={{ flex: 1 }} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={localStyles.pageContent}>
        {/* Search */}

        {Platform.OS !== "web" && (
          <Searchbar
            placeholder="Search devices..."
            onChangeText={(q) => setSearchQuery(q)}
            value={searchQuery}
            style={localStyles.searchBar}
          />
        )}

        {Platform.OS === "web" && (
          <View style={localStyles.webTopBar}>
            <Searchbar
              placeholder="Search devices..."
              onChangeText={(q) => setSearchQuery(q)}
              value={searchQuery}
              style={localStyles.searchBarWeb}
            />
            <View style={localStyles.webButtons}>
              <TouchableOpacity
                style={localStyles.webButton}
                onPress={fetchData}
              >
                <Octicons name="codescan" size={20} color="purple" />
                <Text style={localStyles.webBtnText}>Scan</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={localStyles.webButton}
                onPress={() =>
                  downloadExcel({ allDevices, filteredDevices, searchQuery })
                }
              >
                <MaterialIcons name="file-download" size={20} color="purple" />
                <Text style={localStyles.webBtnText}>Excel</Text>
              </TouchableOpacity>
            </View>

            <View style={localStyles.webFooter}>
              <Text style={localStyles.webFooterText}>@Dash cam</Text>
            </View>
          </View>
        )}

        {loading && <Text style={localStyles.statusText}>Loading...</Text>}

        {!loading && filteredDevices.length === 0 ? (
          <Text style={localStyles.statusText}>No devices found</Text>
        ) : (
          <ScrollView
            contentContainerStyle={[
              styles.cardWrapper,
              Platform.OS !== "web"
                ? { paddingBottom: insets.bottom + 50 }
                : { paddingBottom: 70 },
            ]}
          >
            {filteredDevices.map((item, i) => (
              <View key={`${item.mac}-${i}`} style={styles.cardDesign}>
                <View style={{ padding: 12 }}>
                  {/* IP */}
                  <TouchableOpacity
                    onPress={() => handleIpPress(item.ip)}
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      marginBottom: 6,
                    }}
                  >
                    <MaterialIcons
                      name="language"
                      size={20}
                      color="#fff"
                      style={{ marginRight: 6, marginBottom: 8 }}
                    />
                    <Text
                      style={[
                        styles.cardText,
                        { fontWeight: "bold", color: "#fff" },
                      ]}
                    >
                      IP: {item.ip}
                    </Text>
                  </TouchableOpacity>

                  {/* MAC */}
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      marginBottom: 6,
                    }}
                  >
                    <Ionicons
                      name="hardware-chip-outline"
                      size={18}
                      color="#fff"
                      style={{ marginRight: 6, marginBottom: 8 }}
                    />
                    <Text style={styles.cardText}>
                      <Text style={{ fontWeight: "bold", color: "#fff" }}>
                        MAC:
                      </Text>{" "}
                      {item.mac}
                    </Text>
                  </View>

                  {/* Hostname */}
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <MaterialIcons
                      name="computer"
                      size={18}
                      color="#fff"
                      style={{ marginRight: 6, marginBottom: 7 }}
                    />
                    <Text style={styles.cardText}>
                      <Text style={{ fontWeight: "bold", color: "#fff" }}>
                        Hostname:
                      </Text>{" "}
                      {item.hostname}
                    </Text>
                  </View>
                </View>
              </View>
            ))}
          </ScrollView>
        )}

        {/* Bottom nav */}
        {Platform.OS !== "web" && (
          <View style={[localStyles.bottomNav(insets)]}>
            <TouchableOpacity style={localStyles.navItem} onPress={fetchData}>
              <Octicons name="codescan" size={24} color="purple" />
              <Text style={localStyles.navText}>Scan</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={localStyles.navItem}
              onPress={() =>
                downloadExcel({ allDevices, filteredDevices, searchQuery })
              }
            >
              <MaterialIcons name="file-download" size={24} color="purple" />
              <Text style={localStyles.navText}>Excel</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

const localStyles = StyleSheet.create({
  pageContent: {
    flex: 1,
    width: "100%",
    maxWidth: 1500, // keeps everything aligned
    alignSelf: "center", // centers inside SafeAreaView
  },

  webTopBar: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    // paddingHorizontal: 12,
    // paddingVertical: 8,
    // backgroundColor: "#090040",
  },

  webButtons: {
    flexDirection: "row",
  },
  webButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginLeft: 8,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    width: 100,
    height: "7dvh",
  },
  webBtnText: {
    marginLeft: 5,
    fontSize: 18,
    color: "#333",
  },
  searchBarWeb: {
    flex: 1,
    marginRight: 10,
    borderRadius: 12,
    borderColor: "black",
    borderWidth: 1,
  },
  webFooter: {
    position: "fixed",
    bottom: 0,
    left: 0,
    width: "100%",
    alignItems: "flex-start",
    justifyContent: "flex-start",
    paddingVertical: 10,

    backgroundColor: "#583493ff", // same as page background for blend
    borderTopWidth: 1,

    // borderTopColor: "rgba(255,255,255,0.1)",
  },
  webFooterText: {
    color: "#fff",
    fontSize: "1.1rem",
    marginLeft: 30,
    // opacity: 0.8,
  },

  searchBar: {
    marginTop: 10,
    marginHorizontal: 12,
    borderRadius: 12,
  },
  statusText: {
    marginTop: 20,
    textAlign: "center",
    fontSize: 16,
    color: "#fff",
  },
  navItem: {
    alignItems: "center",
  },
  navText: {
    fontSize: 12,
    color: "#333",
    marginTop: 2,
  },
  bottomNav: (insets) => ({
    position: "absolute",
    bottom: 5,
    left: 20,
    right: 20,
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#ffffffde",
    borderRadius: 50,
    paddingVertical: 10,
    paddingHorizontal: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  }),
});

export default Data;
