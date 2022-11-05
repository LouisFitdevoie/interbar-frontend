import React from "react";
import { View, StyleSheet } from "react-native";
import AppText from "../../components/AppText";
import Screen from "../../components/Screen";

function JoinEventScreen(props) {
  return (
    <Screen style={styles.container}>
      <AppText></AppText>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    padding: 10,
  },
});

export default JoinEventScreen;
