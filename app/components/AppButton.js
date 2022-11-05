import React from "react";
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";

import colors from "../config/colors";

function AppButton({
  color = "buttonPrimary",
  onPress,
  style,
  title,
  disabled,
}) {
  return (
    <TouchableOpacity
      style={[styles.button, { backgroundColor: colors[color] }, style]}
      onPress={onPress}
      disabled={disabled}
    >
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: "center",
    backgroundColor: colors.buttonPrimary,
    borderRadius: 25,
    height: 50,
    justifyContent: "center",
    marginVertical: 10,
    padding: 15,
    width: "100%",
  },
  text: {
    color: colors.white,
    fontSize: 18,
  },
});

export default AppButton;
