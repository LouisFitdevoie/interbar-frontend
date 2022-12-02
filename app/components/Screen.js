import Constants from "expo-constants";
import React from "react";
import {
  Keyboard,
  View,
  SafeAreaView,
  StyleSheet,
  TouchableWithoutFeedback,
} from "react-native";

function Screen({ children, style, version = "default" }) {
  if (version === "default") {
    return (
      <SafeAreaView style={[styles.screen, style]}>
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
          <View style={[styles.view, style]}>{children}</View>
        </TouchableWithoutFeedback>
      </SafeAreaView>
    );
  } else if (version === "scroll") {
    return (
      <SafeAreaView style={[styles.screen, style]}>{children}</SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    paddingTop: Constants.statusBarHeight,
  },
  view: {
    flex: 1,
  },
});

export default Screen;
