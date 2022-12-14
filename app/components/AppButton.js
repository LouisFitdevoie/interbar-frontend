import React from "react";
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";

import colors from "../config/colors";

function AppButton({ onPress, style, title, disabled }) {
  return (
    <TouchableOpacity
      style={[
        styles.button,
        disabled
          ? { backgroundColor: colors.buttonPrimaryDisabled }
          : { backgroundColor: colors.buttonPrimary },
        style,
      ]}
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
    borderRadius: 25,
    height: 50,
    justifyContent: "center",
    marginVertical: 10,
    paddingHorizontal: 15,
    width: "100%",
  },
  text: {
    color: colors.white,
    fontSize: 18,
    paddingVertical: 15,
  },
});

export default AppButton;
