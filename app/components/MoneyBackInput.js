import React, { useState } from "react";
import { View, StyleSheet } from "react-native";

import AppText from "./AppText";
import AppTextInput from "./AppTextInput";
import colors from "../config/colors";

function MoneyBackInput({ totalPrice }) {
  const [givenMoney, setGivenMoney] = useState(0);

  const moneyToGiveBack =
    givenMoney - totalPrice >= 0 ? givenMoney - totalPrice : 0;

  return (
    <View style={styles.container}>
      <AppTextInput
        keyboardType="numeric"
        onChangeText={(text) => setGivenMoney(text)}
        placeholder="Montant reçu"
        style={styles.input}
        value={givenMoney}
        width="50%"
      />
      <AppText style={styles.giveBackText}>
        Rendre {moneyToGiveBack.toString().replace(".", ",")} €
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingHorizontal: 10,
  },
  giveBackText: {
    fontSize: 20,
    fontWeight: "bold",
    color: colors.buttonPrimary,
  },
  input: {
    textAlign: "center",
  },
});

export default MoneyBackInput;
