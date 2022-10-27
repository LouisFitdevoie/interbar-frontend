import React from "react";
import { View, StyleSheet } from "react-native";
import AppButton from "../components/AppButton";
import AppText from "../components/AppText";
import Screen from "../components/Screen";

function CreateEventInformationsScreen({ navigation }) {
  return (
    <Screen style={styles.container}>
      <AppText>Test</AppText>
      <AppButton
        title="Créer un évènement"
        onPress={() => navigation.navigate("CreateEvent")}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: 10,
  },
});

export default CreateEventInformationsScreen;
