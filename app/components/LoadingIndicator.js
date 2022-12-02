import React, { useEffect, useRef } from "react";
import { View, StyleSheet } from "react-native";
import LottieView from "lottie-react-native";

const indicator = require("../assets/lottie-animations/loading-indicator.json");

function LoadingIndicator(props) {
  const animationRef = useRef();

  useEffect(() => {
    if (animationRef.current) {
      setTimeout(() => {
        animationRef.current?.play();
      }, 0);
    }
  }, [animationRef.current]);
  return (
    <View style={styles.container}>
      <View style={styles.background}>
        <LottieView
          ref={animationRef}
          autoPlay
          style={styles.indicator}
          source={indicator}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: "center",
    justifyContent: "center",
  },
  background: {
    padding: 10,
    borderRadius: 20,
    backgroundColor: "#00000025",
  },
  indicator: {
    width: 50,
    height: 50,
  },
});

export default LoadingIndicator;
