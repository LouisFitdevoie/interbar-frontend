import React from "react";
import { View, StyleSheet } from "react-native";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";
import { FontAwesome, MaterialCommunityIcons } from "@expo/vector-icons";

import colors from "../../config/colors";

function CommandItemActions({ onPaidPress, isPaid, onServedPress, isServed }) {
  return (
    <View
      style={{
        flexDirection: "row",
        width: isPaid && isServed ? 0 : isPaid || isServed ? 70 : 140,
      }}
    >
      {!isPaid && (
        <TouchableWithoutFeedback
          onPress={onPaidPress}
          style={styles.paidButtonContainer}
        >
          <View style={styles.paidButtonContainer}>
            <FontAwesome name="euro" size={36} color={colors.white} />
          </View>
        </TouchableWithoutFeedback>
      )}
      {!isServed && (
        <TouchableWithoutFeedback
          onPress={onServedPress}
          style={styles.servedButtonContainer}
        >
          <View style={styles.servedButtonContainer}>
            <MaterialCommunityIcons
              name="truck-delivery-outline"
              size={36}
              color={colors.white}
            />
          </View>
        </TouchableWithoutFeedback>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  paidButtonContainer: {
    backgroundColor: colors.green,
    width: 70,
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  servedButtonContainer: {
    backgroundColor: colors.buttonPrimary,
    width: 70,
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
});

export default CommandItemActions;
