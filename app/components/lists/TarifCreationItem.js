import React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Swipeable from "react-native-gesture-handler/Swipeable";

import colors from "../../config/colors";
import AppText from "../AppText";

function TarifCreationItem({
  name,
  buyingPrice,
  sellingPrice,
  stock,
  productId,
  onPress,
  renderRightActions,
}) {
  return (
    <Swipeable renderRightActions={renderRightActions}>
      <TouchableOpacity style={styles.touchableContainer} onPress={onPress}>
        <View style={styles.container}>
          <View style={styles.dataContainer}>
            <AppText style={styles.name}>{name}</AppText>
            <View style={styles.priceStockContainer}>
              <AppText style={styles.buyingPrice}>
                Prix d'achat : {buyingPrice}€
              </AppText>
              <AppText style={styles.stock}>Stock : {stock}</AppText>
            </View>
          </View>
          <View style={styles.priceContainer}>
            <AppText style={styles.sellingPrice}>{sellingPrice}€</AppText>
            <MaterialCommunityIcons
              name="pencil"
              size={28}
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
    paddingHorizontal: 10,
  },
  dataContainer: {
    flexDirection: "column",
  },
  priceStockContainer: {
    flexDirection: "row",
    marginTop: 5,
  },
  buyingPrice: {
    color: colors.black,
    fontSize: 16,
  },
  stock: {
    color: colors.black,
    marginLeft: 10,
    fontSize: 16,
  },
  priceContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
  },
  sellingPrice: {
    color: colors.black,
    paddingRight: 5,
  },
  name: {
    fontSize: 20,
    color: colors.primary,
  },
  touchableContainer: {
    width: "100%",
    paddingVertical: 10,
    backgroundColor: colors.white,
  },
});

export default TarifCreationItem;
