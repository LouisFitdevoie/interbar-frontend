import React, { useContext } from "react";
import { View, StyleSheet } from "react-native";

import Screen from "../components/Screen";
import { AuthContext } from "../auth/AuthContext";
import colors from "../config/colors";
import AppText from "../components/AppText";

function HomeScreen(props) {
  const { user } = useContext(AuthContext);

  return (
    <Screen style={styles.container}>
      <AppText>Bienvenue {user.firstName} !</AppText>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    flex: 1,
    justifyContent: "flex-start",
    padding: 10,
  },
});

export default HomeScreen;
