import React, { useState } from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import colors from "../../config/colors";
import AppText from "../AppText";
import AppTextInput from "../AppTextInput";

function NewProductCommandItem({ product, role, quantities, setQuantities }) {
  return (
    <View style={styles.container}>
      <View style={styles.product}>
        <AppText style={styles.title}>{product.name}</AppText>
        <AppText>{product.sellingPrice} €</AppText>
      </View>
      <View style={styles.addMenu}>
        <AppTextInput
          onChangeText={(value) =>
            setQuantities(
              quantities.map((q) => {
                if (q.productId === product.events_products_id) {
                  return {
                    productId: q.productId,
                    quantity: value,
                  };
                }
                return q;
              })
            )
          }
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
