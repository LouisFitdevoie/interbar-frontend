import React from "react";
import { View, StyleSheet } from "react-native";
import AppText from "../components/AppText";
import Screen from "../components/Screen";

function CreatePriceListScreen(props) {
  const eventId = props.route.params.eventId;
  return (
    <Screen>
      <AppText>Tous les produits pour l'évènement</AppText>
      <AppText>{eventId}</AppText>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {},
});

export default CreatePriceListScreen;
