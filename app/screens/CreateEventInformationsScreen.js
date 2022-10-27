import React from "react";
import { View, StyleSheet } from "react-native";
import AppButton from "../components/AppButton";
import AppText from "../components/AppText";
import Screen from "../components/Screen";

function CreateEventInformationsScreen({ navigation }) {
  return (
    <Screen style={styles.container}>
      <AppText style={styles.text}>
        Pour créer un évènement, vous devrez passer par plusieurs étapes.
      </AppText>
      <AppText style={styles.text}>
        Vous devrez d'abord donner des informations générales sur l'évènement,
        comme son nom, la date de début ou la date de fin.
      </AppText>
      <AppText style={styles.text}>
        Ensuite, vous devrez créer le tarif de l'évènement en ajoutant des
        produits existants ou en en créant de nouveaux.
      </AppText>
      <AppButton
        title="Commencer"
        onPress={() => navigation.navigate("CreateEvent")}
        style={{ width: "95%", marginTop: 20 }}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    flex: 1,
    width: "100%",
  },
  text: {
    marginTop: 10,
    textAlign: "left",
    width: "90%",
  },
});

export default CreateEventInformationsScreen;
