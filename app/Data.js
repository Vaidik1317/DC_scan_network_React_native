import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Linking,
  ScrollView,
  StyleSheet as RNStyleSheet,
  StyleSheet,
  TouchableOpacity,
  View,
  Platform,
} from "react-native";
import { Card, Searchbar, Text } from "react-native-paper";
import { useScan } from "@/context/scanContext";
import scanStyle from "@/styles/scanStyle";

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

  const [loading, setLoading] = useState(false);
  const styles = scanStyle();

  const fetchData = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get("http://192.168.29.198:7001/arp-scan");
      setAllDevices(data.devices || []);
      setFilteredDevices(data.devices || []);
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

  // re-fetch when drawer triggers a scan
  useEffect(() => {
    if (trigger) {
      fetchData();
      resetTrigger();
    }
  }, [trigger]);

  // filter logic
  useEffect(() => {
    if (!searchQuery || searchQuery.trim() === "") {
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
      return;
    }
    Linking.openURL(url).catch(() => alert("Unable to open the IP address."));
  };

  return (
    <View style={styles.container}>
      <Searchbar
        placeholder="Search devices..."
        onChangeText={(q) => setSearchQuery(q)}
        value={searchQuery}
        style={localStyles.searchBar}
      />

      {loading && <Text style={localStyles.statusText}>Loading...</Text>}

      {!loading && filteredDevices.length === 0 ? (
        <Text style={localStyles.statusText}>No devices found</Text>
      ) : (
        <ScrollView contentContainerStyle={styles.cardWrapper}>
          {filteredDevices.map((item, i) => (
            <View key={`${item.mac}-${i}`} style={styles.cardDesign}>
              {/* background done via style; no BlurView here (optionally re-add) */}
              <View style={{ padding: 12 }}>
                <TouchableOpacity onPress={() => handleIpPress(item.ip)}>
                  <Text
                    style={[
                      styles.cardText,
                      { color: "lightblue", textDecorationLine: "underline" },
                    ]}
                  >
                    {item.ip}
                  </Text>
                </TouchableOpacity>

                <Text style={styles.cardText}>
                  <Text style={{ fontWeight: "bold" }}>MAC:</Text> {item.mac}
                </Text>
                <Text style={styles.cardText}>
                  <Text style={{ fontWeight: "bold" }}>Hostname:</Text>{" "}
                  {item.hostname}
                </Text>
              </View>
            </View>
          ))}
        </ScrollView>
      )}
    </View>
  );
};

const localStyles = StyleSheet.create({
  searchBar: {
    marginTop: 12,
    marginHorizontal: 12,
    borderRadius: 12,
  },
  statusText: {
    marginTop: 20,
    textAlign: "center",
    fontSize: 16,
    color: "#fff",
  },
});

export default Data;
