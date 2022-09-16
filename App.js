import { StyleSheet, View } from "react-native";
import AppButton from "./app/components/AppButton";

import AppText from "./app/components/AppText";
import Screen from "./app/components/Screen";

export default function App() {
  return (
    <Screen style={styles.container}>
      <AppText>Open up App.js to start working on your app!</AppText>
      <AppButton
        title="Rejoindre l'évènement"
        onPress={() => console.log("Tapped")}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 10,
    width: "100%",
  },
});
