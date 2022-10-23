import React, { useState } from "react";
import { View, StyleSheet, TouchableHighlight } from "react-native";
import AppText from "../components/AppText";

import Screen from "../components/Screen";

function ColorModeScreen(props) {
  const [value, setValue] = useState("");

  return (
    <Screen>
      <View style={styles.container}>
        <View>
          <TouchableHighlight
            style={{ backgroundColor: value === "Test 1" ? "red" : "white" }}
            onPress={() => setValue("Test 1")}
          >
            <AppText>Test 1</AppText>
          </TouchableHighlight>
        </View>
        <View>
          <TouchableHighlight
            style={{ backgroundColor: value === "Test 2" ? "red" : "white" }}
            onPress={() => setValue("Test 2")}
          >
            <AppText>Test 2</AppText>
          </TouchableHighlight>
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {},
});

export default ColorModeScreen;
