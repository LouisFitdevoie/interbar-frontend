import { StatusBar } from "expo-status-bar";
import { StyleSheet } from "react-native";

import AppText from "./app/components/AppText";
import Screen from "./app/components/Screen";

export default function App() {
  return (
    <Screen style={styles.container}>
      <AppText>Open up App.js to start working on your app!</AppText>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
