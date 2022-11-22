import React, { useState } from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";

import colors from "../../config/colors";
import AppText from "../AppText";
import AppTextInput from "../AppTextInput";
import { ErrorMessage } from "../forms";

function NewProductCommandItem({ product, role, quantities, setQuantities }) {
  const [error, setError] = useState(null);

  return (
    <View style={styles.container}>
      <View style={styles.productContainer}>
        <View style={styles.product}>
          <AppText style={styles.title}>{product.name}</AppText>
          <AppText>{product.sellingPrice} €</AppText>
        </View>
        <View style={styles.addMenu}>
          <AppTextInput
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
                    };
                  }
                  return q;
                })
              );
            }}
            value={quantities
              .filter((q) => q.productId === product.events_products_id)[0]
              .quantity.toString()}
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
}

const styles = StyleSheet.create({
  addMenu: {
    marginLeft: 10,
    width: 60,
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

export default NewProductCommandItem;
