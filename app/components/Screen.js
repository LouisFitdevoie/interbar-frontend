import Constants from "expo-constants";
import React, { useLayoutEffect } from "react";
import {
  Keyboard,
  View,
  SafeAreaView,
  StyleSheet,
  TouchableWithoutFeedback,
  StatusBar,
  Platform,
} from "react-native";

import colors from "../config/colors";

function Screen({ children, style, version = "default", barStyle = "light" }) {
  useLayoutEffect(() => {
    if (barStyle === "light" || Platform.OS === "android") {
      StatusBar.setBarStyle("light-content");
    } else {
      StatusBar.setBarStyle("dark-content");
    }
  }, [barStyle]);

  if (version === "default") {
    return (
      <SafeAreaView style={[styles.screen, style]}>
        <StatusBar backgroundColor={colors.buttonPrimary} animated={true} />
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
    paddingTop: Platform.OS === "ios" ? Constants.statusBarHeight : 0,
  },
  view: {
    flex: 1,
  },
});

export default Screen;
