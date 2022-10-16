import Constants from "expo-constants";
import React from "react";
import {
  Keyboard,
  View,
  SafeAreaView,
  StyleSheet,
  TouchableWithoutFeedback,
} from "react-native";

function Screen({ children, style }) {
  return (
    <SafeAreaView style={[styles.screen, style]}>
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <View style={[styles.view, style]}>{children}</View>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
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
