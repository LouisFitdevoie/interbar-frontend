import React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import AppText from "./AppText";
import colors from "../config/colors";

function RadioButton({ value, onPress, label, stateValue }) {
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={onPress} style={styles.checkbox}>
        <MaterialCommunityIcons
          name={
            stateValue === value
              ? "checkbox-marked-circle"
              : "checkbox-blank-circle-outline"
          }
          size={25}
          color={colors.buttonPrimary}
        />
        <AppText style={{ marginLeft: 10 }}>{label}</AppText>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    width: "100%",
  },
  checkbox: {
    width: "100%",
    paddingVertical: 10,
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
  },
});

export default RadioButton;
