import { StatusBar } from "expo-status-bar";
import { StyleSheet, View } from "react-native";

import AppText from "./app/components/AppText";

export default function App() {
  return (
    <View style={styles.container}>
      <AppText>Open up App.js to start working on your app!</AppText>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
