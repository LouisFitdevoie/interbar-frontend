import Constants from "expo-constants";
import React, { useLayoutEffect } from "react";
import {
  Keyboard,
  View,
  SafeAreaView,
  StyleSheet,
  TouchableWithoutFeedback,
  StatusBar,
} from "react-native";

function Screen({ children, style, version = "default", barStyle = "light" }) {
  useLayoutEffect(() => {
    if (barStyle === "light") {
      StatusBar.setBarStyle("light-content");
    } else {
      StatusBar.setBarStyle("dark-content");
    }
  }, [barStyle]);

  if (version === "default") {
    return (
      <SafeAreaView style={[styles.screen, style]}>
        <StatusBar animated={true} />
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
          <View style={[styles.view, style]}>{children}</View>
        </TouchableWithoutFeedback>
      </SafeAreaView>
    );
  } else if (version === "scroll") {
    return (
      <>
        <StatusBar animated={true} />
        <SafeAreaView style={[styles.screen, style]}>{children}</SafeAreaView>
      </>
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
