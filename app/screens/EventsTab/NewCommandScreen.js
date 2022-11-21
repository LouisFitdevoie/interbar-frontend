import React from "react";
import { View, StyleSheet } from "react-native";
import AppText from "../../components/AppText";

import Screen from "../../components/Screen";

function NewCommandScreen(props) {
  const { navigation } = props;
  const { eventId } = props.route.params;
  return (
    <Screen style={styles.container}>
      <AppText>{eventId}</AppText>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    flex: 1,
    justifyContent: "flex-start",
    width: "100%",
  },
});

export default NewCommandScreen;
