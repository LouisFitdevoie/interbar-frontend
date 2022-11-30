import React from "react";
import { View, StyleSheet } from "react-native";

import colors from "../../config/colors";
import AppText from "../AppText";

function TarifDisplayItem({ name, sellingPrice, stock }) {
  return (
    <View style={styles.container}>
      <AppText
        style={stock > 0 ? styles.productInStock : styles.productOutOfStock}
      >
        {name}
      </AppText>
      <AppText
        style={stock > 0 ? styles.productInStock : styles.productOutOfStock}
      >
        {sellingPrice} €
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 10,
  },
  productInStock: {
    fontSize: 20,
    color: colors.black,
  },
  productOutOfStock: {
    fontSize: 20,
    color: colors.danger,
  },
});

export default TarifDisplayItem;
