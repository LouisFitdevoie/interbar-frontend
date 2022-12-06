import React, { useState } from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";

import colors from "../../config/colors";
import AppText from "../AppText";
import AppTextInput from "../AppTextInput";
import { ErrorMessage } from "../forms";

function ProductCommandItem({
  product,
  role,
  quantities,
  setQuantities,
  disabled = false,
}) {
  const [error, setError] = useState(null);

  const name = product.name
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  // console.log("\n\n\n");
  // console.log(product);
  // console.log(
  //   quantities
  //     .filter((p) => p.productId === product.events_products_id)[0]
  //     .quantity.toString()
  // );
  const quantity =
    quantities.filter((p) => p.productId === product.events_products_id)
      .length > 0
      ? quantities
          .filter((p) => p.productId === product.events_products_id)[0]
          .quantity.toString()
      : null;

  // console.log(
  //   quantities
  //     .filter((q) => q.productId === product.events_products_id)[0]
  //     .quantity.toString()
  // );

  // if (quantity) {
  return (
    <View style={styles.container}>
      <View style={styles.productContainer}>
        <View style={styles.product}>
          <AppText style={styles.title}>{name}</AppText>
          <AppText>{product.sellingPrice} €</AppText>
        </View>
        <View style={styles.addMenu}>
          <AppTextInput
            disabled={disabled}
            onChangeText={(value) => {
              setError(
                value > product.stock
                  ? "Il ne reste que " + product.stock + " produits en stock"
                  : null
              );
              setQuantities(
                quantities.map((q) => {
                  if (q.productId === product.events_products_id) {
                    return {
                      eventProductCommandId: q.eventProductCommandId
                        ? q.eventProductCommandId
                        : null,
                      productId: q.productId,
                      quantity: value,
                      error: value > product.stock,
                    };
                  }
                  return q;
                })
              );
            }}
            onBlur={() => {
              setQuantities(
                quantities.map((q) => {
                  if (q.productId === product.events_products_id) {
                    return {
                      productId: q.productId,
                      quantity: parseInt(q.quantity) ? parseInt(q.quantity) : 0,
                      eventProductCommandId: q.eventProductCommandId
                        ? q.eventProductCommandId
                        : null,
                    };
                  }
                  return q;
                })
              );
            }}
            value={quantity}
            keyboardType="numeric"
            style={{ textAlign: "center" }}
          />
        </View>
      </View>
      {error != null && (
        <View style={styles.error}>
          <AppText style={styles.errorText}>{error}</AppText>
        </View>
      )}
    </View>
  );
  // } else {
  //   console.log("no quantity");
  // }
}

const styles = StyleSheet.create({
  addMenu: {
    marginLeft: 10,
    minWidth: 60,
    alignItems: "center",
    justifyContent: "center",
  },
  error: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  errorText: {
    color: colors.danger,
    textAlign: "center",
    fontSize: 15,
  },
  container: {
    width: "100%",
    paddingVertical: 5,
    backgroundColor: colors.white,
    flexDirection: "column",
  },
  productContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
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

export default ProductCommandItem;
