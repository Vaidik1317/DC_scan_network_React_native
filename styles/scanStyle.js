import { Dimensions, Platform, StyleSheet } from "react-native";
const { width: screenWidth } = Dimensions.get("window");

const scanStyle = () =>
  StyleSheet.create({
    container: {
      flex: 1,
      zIndex: 0,
      overflow: "hidden",
      width: "100%",
      backgroundColor: "#322646", // bluish background
      paddingTop: 8,
    },

    cardWrapper: {
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "center",
      alignItems: "flex-start",
      width: "100%",
      padding: 10,
    },

    cardDesign: {
      width: Platform.OS === "web" ? 340 : "80%",
      height: 120,
      // minWidth:
      // Platform.OS === "web" && screenWidth < 800 ? { minWidth: 250 } : {},
      margin: 10,
      padding: 12,
      borderRadius: 16,
      backgroundColor: "#9856ba9f", // translucent
      borderWidth: 1,
      borderColor: "rgba(255,255,255,0.12)",
      justifyContent: "center",
      elevation: 0, // remove android default shadow
      overflow: "hidden",
    },

    cardText: {
      color: "#fff",
      fontSize: 15,
      marginBottom: 6,
    },
    statusText: {
      color: "#fff",
    },
  });

export default scanStyle;
