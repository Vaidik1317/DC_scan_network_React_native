import { Platform, StyleSheet } from "react-native";

const scanStyle = () =>
  StyleSheet.create({
    container: {
      flex: 1,
      zIndex: 0,
      overflow: "hidden",
      width: "100%",
      backgroundColor: "#4e51c8", // bluish background
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
      width: Platform.OS === "web" ? "28%" : "80%",
      height: 120,
      margin: 10,
      padding: 12,
      borderRadius: 16,
      backgroundColor: "rgba(154, 125, 223, 0.08)", // translucent
      borderWidth: 1,
      borderColor: "rgba(255,255,255,0.12)",
      justifyContent: "center",
      elevation: 0, // remove android default shadow
    },

    cardText: {
      color: "#fff",
      fontSize: 15,
      marginBottom: 6,
    },
  });

export default scanStyle;
