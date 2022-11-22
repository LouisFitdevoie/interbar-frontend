import React, { useState } from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import colors from "../../config/colors";
import AppText from "../AppText";
import AppTextInput from "../AppTextInput";

function NewProductCommandItem({ product, role }) {
  const [quantity, setQuantity] = useState("0");

  return (
    <View style={styles.container}>
      <View style={styles.product}>
        <AppText style={styles.title}>{product.name}</AppText>
        <AppText>{product.sellingPrice} €</AppText>
      </View>
      <View style={styles.addMenu}>
        <AppTextInput
          onChangeText={(value) => setQuantity(value)}
          onBlur={() => {
            if (quantity === "") {
              setQuantity("0");
            }
          }}
          value={quantity}
          keyboardType="numeric"
          style={{ textAlign: "center" }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  addMenu: {
    marginLeft: 10,
    width: 60,
    alignItems: "center",
    justifyContent: "center",
  },
  container: {
    width: "100%",
    paddingVertical: 5,
    backgroundColor: colors.white,
    flexDirection: "row",
  },
  product: {
    flexDirection: "row",
    flex: 1,
    justifyContent: "space-between",
    padding: 5,
    alignItems: "center",
  },
  title: {
    fontWeight: "bold",
    color: colors.buttonPrimary,
  },
});

export default NewProductCommandItem;
