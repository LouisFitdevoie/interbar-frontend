import React from "react";
import { View, TextInput } from "react-native";
import colors from "../config/colors";

import defaultStyle from "../config/styles";

function AppTextInput({
  disabled = false,
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
        editable={!disabled}
        style={[
          defaultStyle.textInputDefaultText,
          style,
          disabled && {
            backgroundColor: colors.buttonPrimary,
            color: colors.white,
          },
        ]}
        placeholderTextColor={defaultStyle.colors.textInputDefaultPlaceholder}
        {...otherProperties}
      />
    </View>
  );
}

export default AppTextInput;
