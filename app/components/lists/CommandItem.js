import React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Swipeable from "react-native-gesture-handler/Swipeable";

import AppText from "../AppText";
import colors from "../../config/colors";
import CommandItemActions from "./CommandItemActions";

function CommandItem({
  clientName,
  products,
  commandId,
  totalPrice,
  isPaid,
  isServed,
  renderRightActions,
}) {
  let productNumber = 0;
  products.forEach((product) => {
    productNumber += product.number;
  });
  return (
    <Swipeable renderRightActions={renderRightActions}>
      <TouchableOpacity onPress={() => console.log(commandId)}>
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
            <AppText style={styles.totalPrice}>{totalPrice} €</AppText>
            <MaterialCommunityIcons
              name="chevron-right"
              size={30}
              color={colors.buttonPrimary}
            />
          </View>
        </View>
      </TouchableOpacity>
    </Swipeable>
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
