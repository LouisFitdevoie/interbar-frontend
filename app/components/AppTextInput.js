import React from "react";
import { View, TextInput } from "react-native";

import defaultStyle from "../config/styles";

function AppTextInput({ registration, width = "100%", ...otherProperties }) {
  if (registration) {
    return (
      <View style={[defaultStyle.textInputRegistrationContainer, { width }]}>
        <TextInput
          style={defaultStyle.textInputRegistrationText}
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
        style={defaultStyle.textInputDefaultText}
        placeholderTextColor={defaultStyle.colors.textInputDefaultPlaceholder}
        {...otherProperties}
      />
    </View>
  );
}

export default AppTextInput;
