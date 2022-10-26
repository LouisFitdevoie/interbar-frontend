import React from "react";
import { View, StyleSheet } from "react-native";
import colors from "../../config/colors";

import AppText from "../AppText";

function ErrorMessage({ error, visible }) {
  if (!visible || !error) {
    return null;
  }
  return (
    <View>
      <AppText style={styles.error}>{error}</AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  error: {
    color: colors.danger,
    fontSize: 14,
    marginBottom: 5,
    textAlign: "center",
  },
});

export default ErrorMessage;
