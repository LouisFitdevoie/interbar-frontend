import React from "react";
import { View, TextInput } from "react-native";

import defaultStyle from "../config/styles";

function AppTextInput({
  registration,
  width = "100%",
  style,
  ...otherProperties
}) {
  if (registration) {
    return (
      <View style={[defaultStyle.textInputRegistrationContainer, { width }]}>
        <TextInput
          style={[defaultStyle.textInputRegistrationText, style]}
          placeholderTextColor={
            defaultStyle.colors.textInputRegistrationPlaceholder
          }
          {...otherProperties}
        />
      </View>
    );
  }
  return (
    <View style={[defaultStyle.textInputDefaultContainer, { width }]}>
      <TextInput
        style={[defaultStyle.textInputDefaultText, style]}
        placeholderTextColor={defaultStyle.colors.textInputDefaultPlaceholder}
        {...otherProperties}
      />
    </View>
  );
}

export default AppTextInput;
