import React from "react";
import { View, StyleSheet } from "react-native";
import LottieView from "lottie-react-native";

const indicator = require("../assets/lottie-animations/loading-indicator.json");

function LoadingIndicator(props) {
  return (
    <View style={styles.container}>
      <View style={styles.background}>
        <LottieView autoPlay style={styles.indicator} source={indicator} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 100,
  },
  background: {
    padding: 10,
    borderRadius: 20,
    backgroundColor: "#00000010",
  },
  indicator: {
    width: 50,
    height: 50,
  },
});

export default LoadingIndicator;
