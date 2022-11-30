import React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import AppText from "../AppText";
import colors from "../../config/colors";

function CommandItem({
  clientName,
  products,
  commandId,
  totalPrice,
  isPaid,
  isServed,
  role,
  navigation,
  eventId,
}) {
  let productNumber = 0;
  products.forEach((product) => {
    productNumber += product.number;
  });
  return (
    <TouchableOpacity
      onPress={() =>
        navigation.navigate("Command", {
          commandId,
          eventId,
          role,
          isPaid,
          isServed,
        })
      }
    >
      <View style={styles.container}>
        <View style={styles.clientNameContainer}>
          <AppText
            style={isPaid && isServed ? {} : styles.notComplete}
            numberOfLines={1}
            ellipsizeMode="middle"
          >
            {clientName
              .split(" ")
              .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
              .join(" ")}{" "}
            ({productNumber} produits)
          </AppText>
        </View>
        <View style={styles.endView}>
          <AppText style={styles.totalPrice}>
            {totalPrice.toString().replace(".", ",")} €
          </AppText>
          <MaterialCommunityIcons
            name="chevron-right"
            size={30}
            color={colors.buttonPrimary}
          />
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 10,
    paddingVertical: 20,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: colors.light,
    backgroundColor: colors.white,
  },
  clientNameContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    paddingRight: 10,
  },
  endView: {
    flexDirection: "row",
    alignItems: "center",
  },
  totalPrice: {
    fontSize: 18,
    color: colors.buttonPrimary,
    fontWeight: "bold",
  },
  notComplete: {
    flex: 1,
    color: colors.danger,
  },
});

export default CommandItem;
