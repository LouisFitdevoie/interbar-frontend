import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import AppButton from "../components/AppButton";
import RadioButton from "../components/RadioButton";

import Screen from "../components/Screen";

function ColorModeScreen(props) {
  const [colorMode, setColorMode] = useState("light");

  const handleChangeColorMode = () => {
    console.log(colorMode);
  };

  return (
    <Screen>
      <View style={styles.container}>
        <RadioButton
          value="light"
          stateValue={colorMode}
          label="Clair"
          onPress={() => setColorMode("light")}
        />
        <View style={styles.separator} />
        <RadioButton
          value="dark"
          stateValue={colorMode}
          label="Sombre"
          onPress={() => setColorMode("dark")}
        />
        <View style={styles.separator} />
        <RadioButton
          value="auto"
          stateValue={colorMode}
          label="Automatique"
          onPress={() => setColorMode("auto")}
        />
        <View style={styles.buttonContainer}>
          <AppButton
            title="Enregistrer"
            onPress={handleChangeColorMode()}
            style={styles.button}
          />
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
  },
  button: {
    width: "95%",
    marginHorizontal: 10,
  },
  buttonContainer: {
    width: "100%",
  },
});

export default ColorModeScreen;
